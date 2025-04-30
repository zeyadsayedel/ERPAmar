<?php

namespace App\Services;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\DatabaseManager;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class InvoiceCsvImportService
{
    /**
     * The database manager instance.
     *
     * @var \Illuminate\Database\DatabaseManager
     */
    protected $db;

    /**
     * The filesystem instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $filesystem;

    /**
     * Create a new invoice CSV import service instance.
     *
     * @param \Illuminate\Database\DatabaseManager $db
     * @param \Illuminate\Filesystem\Filesystem $filesystem
     * @return void
     */
    public function __construct(DatabaseManager $db, Filesystem $filesystem)
    {
        $this->db = $db;
        $this->filesystem = $filesystem;
    }

    /**
     * Import invoices from a WordPress-style CSV export.
     *
     * The process follows these steps:
     * 1. Parse CSV and group rows by their original WordPress table
     * 2. Build lookup tables from wp_postmeta
     * 3. Build complete invoice records from posts and pods_invoice data
     * 4. Batch insert into `invoices` table
     *
     * @param string $path Absolute path to the CSV file
     * @return int Number of invoices imported
     * @throws \Exception If the CSV file does not exist or cannot be read
     */
    public function import(string $path): int
    {
        if (!$this->filesystem->exists($path)) {
            throw new FileNotFoundException("CSV file not found: {$path}");
        }        try {
            // Step 1: Read and group CSV rows by their original WordPress table
            $rows = $this->parseCsvGroupedByTable($path);

            // Step 2: Build lookup tables from wp_postmeta
            $meta = $this->buildMetaByPostId($rows['wp_postmeta'] ?? []);

            // Step 3: Build invoice data from posts and pods_invoice
            $invoices = $this->buildInvoices($rows['wp_posts'] ?? [], $rows['wp_pods_invoice'] ?? [], $meta);

            if (empty($invoices)) {
                return 0;
            }

            // Step 4: Batch insert invoices with foreign keys disabled temporarily
            return $this->batchInsertInvoices($invoices);
        } catch (Exception $e) {
            Log::error("Invoice CSV import failed: {$e->getMessage()}", [
                'file' => $path,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }    /**
     * Parse CSV file and group by WordPress table name.
     *
     * Groups data into a format like:
     * [
     *    'wp_posts' => [
     *       [table, id, author, date, ...],
     *       ...
     *    ],
     *    'wp_pods_invoice' => [...],
     *    'wp_postmeta' => [...],
     * ]
     *
     * @param string $path Absolute path to the CSV file
     * @return array Grouped CSV data by WordPress table name
     * @throws \Exception If file cannot be read
     */
    protected function parseCsvGroupedByTable(string $path): array
    {
        $grouped = [];

        try {
            if (($handle = fopen($path, 'r')) !== false) {
                while (($row = fgetcsv($handle)) !== false) {
                    if (empty($row[0])) {
                        continue;
                    }
                    
                    $table = $row[0];
                    $grouped[$table][] = $row;
                }
                fclose($handle);
            }
        } catch (Exception $e) {
            Log::error("Failed to parse CSV file: {$e->getMessage()}", ['path' => $path]);
            throw new Exception("Failed to parse CSV file: {$e->getMessage()}", 0, $e);
        }

        return $grouped;
    }    /**
     * Build metadata lookup table by invoice post ID.
     *
     * Creates a structured array of meta values:
     * [
     *    271255 => [
     *      'quarry' => 13,
     *      'cashier' => 58,
     *      'customer' => 262362,
     *      'customer_car' => 11566,
     *      'contractor' => null
     *    ],
     * ]
     *
     * @param array $metaRows Array of WordPress postmeta rows
     * @return array Structured meta values by post ID
     */
    protected function buildMetaByPostId(array $metaRows): array
    {
        $meta = [];
        $relevantKeys = ['quarry', 'cashier', 'customer', 'customer_car', 'contractor'];

        foreach ($metaRows as $row) {
            // Safely extract values with proper index checking
            if (count($row) < 5) {
                continue;
            }
            
            [, , $postId, $metaKey, $metaValue] = $row;

            // Ignore keys like _pods_* which are Pods CMS internal storage
            if (Str::startsWith($metaKey, '_pods_')) {
                continue;
            }

            // Only keep relevant meta keys for our invoice model
            if (!in_array($metaKey, $relevantKeys)) {
                continue;
            }

            $meta[$postId][$metaKey] = is_numeric($metaValue) ? (int) $metaValue : null;
        }

        return $meta;
    }    /**
     * Build the final invoices array ready for database insertion.
     *
     * Each invoice record combines:
     * - Core fields (ID, invoice_number, timestamps)
     * - Relationship fields (cashier_id, quarry_id, etc.)
     * - Financial fields from pods (total, item_price, etc.)
     *
     * @param array $postRows WordPress post rows containing basic invoice data
     * @param array $podRows WordPress pods_invoice rows containing financial details
     * @param array $meta Metadata organized by post ID from buildMetaByPostId()
     * @return array Ready-to-insert invoice records
     */
    protected function buildInvoices(array $postRows, array $podRows, array $meta): array
    {
        $invoices = [];
        $requiredMetaFields = ['cashier', 'quarry', 'customer', 'customer_car'];

        // Index pods_invoice data by invoice ID for fast lookup
        $podsById = $this->indexPodsByInvoiceId($podRows);

        foreach ($postRows as $row) {
            // Skip rows with insufficient columns
            if (count($row) < 7) {
                continue;
            }
            
            [, $invoiceId, $postAuthor, $postDate, , , $postTitle] = $row;

            // Skip if no pods data or meta exists for this invoice
            if (!isset($podsById[$invoiceId]) || !isset($meta[$invoiceId])) {
                continue;
            }

            // Skip if any required metadata fields are missing
            if (!$this->hasRequiredMetaFields($meta[$invoiceId], $requiredMetaFields)) {
                Log::warning("Invoice {$invoiceId} skipped: missing critical meta", [
                    'invoice_id' => $invoiceId,
                    'available_meta' => array_keys($meta[$invoiceId] ?? []),
                ]);
                continue;
            }

            // Build the invoice record combining all data sources
            $invoice = [
                'id' => (int) $invoiceId,
                'invoice_number' => $postTitle,
                'cashier_id' => $meta[$invoiceId]['cashier'],
                'quarry_id' => $meta[$invoiceId]['quarry'],
                'customer_id' => $meta[$invoiceId]['customer'],
                'customer_car_id' => $meta[$invoiceId]['customer_car'],
                'contractor_id' => $meta[$invoiceId]['contractor'] ?? null,
                'created_at' => $postDate,
                'updated_at' => $postDate,
            ];

            // Merge in the pods financial data
            $invoice += $podsById[$invoiceId];

            $invoices[] = $invoice;
        }

        return $invoices;
    }

    /**
     * Index pods invoice data by invoice ID for faster lookups.
     *
     * @param array $podRows
     * @return array
     */
    protected function indexPodsByInvoiceId(array $podRows): array
    {
        $podsById = [];

        foreach ($podRows as $row) {
            // Skip rows with insufficient columns
            if (count($row) < 12) {
                continue;
            }
            
            [, $invoiceId, $invoiceType, $unit, $total, $itemPrice, $theItems, $quantity, $flag, $custody, $supply, $startDay] = $row;

            $podsById[$invoiceId] = [
                'invoice_type' => strtolower($invoiceType),
                'unit' => strtolower($unit),
                'total' => (float) $total,
                'item_price' => (float) $itemPrice,
                'the_items' => $theItems,
                'quantity' => (int) $quantity,
                'flag' => (int) $flag,
                'custody' => (float) $custody,
                'supply' => (bool) $supply,
                'start_day' => (bool) $startDay,
            ];
        }

        return $podsById;
    }

    /**
     * Check if all required metadata fields exist for an invoice.
     *
     * @param array $invoiceMeta
     * @param array $requiredFields
     * @return bool
     */
    protected function hasRequiredMetaFields(array $invoiceMeta, array $requiredFields): bool
    {
        return count(array_intersect_key(array_flip($requiredFields), $invoiceMeta)) === count($requiredFields);
    }    /**
     * Batch insert invoices into the database with temporary foreign key checks disabled.
     *
     * This method disables foreign key checks before the transaction starts,
     * performs the batch insertion within a transaction, then re-enables
     * foreign key checks regardless of transaction outcome.
     *
     * @param array $invoices Array of invoice data ready for insertion
     * @return int Number of invoices successfully inserted
     */
    protected function batchInsertInvoices(array $invoices): int
    {
        // Disable foreign keys BEFORE transaction (not inside it)
        $this->db->statement('SET FOREIGN_KEY_CHECKS=0');

        $count = $this->db->transaction(function () use ($invoices) {
            $this->db->table('invoices')->insertOrIgnore($invoices);
            return count($invoices);
        });

        // Re-enable foreign keys after transaction (whether successful or not)
        $this->db->statement('SET FOREIGN_KEY_CHECKS=1');

        Log::info("Successfully imported {$count} invoices.");

        return $count;
    }
}
