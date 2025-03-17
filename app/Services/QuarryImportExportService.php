<?php

namespace App\Services;

use App\Models\Quarry;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use League\Csv\Writer;

class QuarryImportExportService
{
    private array $fields = [
        'name', 'army_account', 'royalty_account', 'loader_account',
        'army_status', 'calculate_loader_hours', 'quarry_case',
        'company_smoke_account_for_tractor', 'tractor_loaders_smoke',
        'tractor_sand_transfer_price', 'trilla_sand_transfer_price',
        'faradani_sand_transfer_price', 'faradani_double_sand_transfer_price',
        'farm_tractor_sand_transfer_price', 'trilla_loaders_smoke',
        'faradani_loaders_smoke', 'faradani_double_loaders_smoke',
        'farm_tractor_loaders_smoke', 'company_smoke_account_for_trilla',
        'company_smoke_account_for_faradani', 'company_smoke_account_for_faradani_double',
        'company_smoke_account_for_farm_tractor', 'tractor_soil_transfer_price',
        'trilla_soil_transfer_price', 'faradani_soil_transfer_price',
        'faradani_double_soil_transfer_price', 'farm_tractor_soil_transfer_price',
        'tractor_zalat_transfer_price', 'trilla_zalat_transfer_price',
        'faradani_zalat_transfer_price', 'faradani_double_zalat_transfer_price',
        'farm_tractor_zalat_transfer_price', 'tractor_rubble_transfer_price',
        'trilla_rubble_transfer_price', 'faradani_rubble_transfer_price',
        'faradani_double_rubble_transfer_price', 'farm_tractor_rubble_transfer_price',
        'royalty_status', 'loader_hours_status', 'printed', 'unit', 'code'
    ];

    private array $booleanFields = [
        'army_status', 'quarry_case', 'royalty_status', 'loader_hours_status'
    ];

    private array $stringFields = [
        'name', 'unit', 'code'
    ];

    public function import(UploadedFile $file)
    {
        $csv = Reader::createFromPath($file->getPathname());
        $csv->setHeaderOffset(0);

        DB::beginTransaction();
        try {
            $records = $csv->getRecords();
            foreach ($records as $index => $record) {
                $rowNumber = $index + 2; // +2 because of 0-based index and header row
                
                if (!isset($record['name'])) {
                    throw new Exception("Row {$rowNumber}: Name field is required");
                }

                $data = [];
                foreach ($this->fields as $field) {
                    $value = $record[$field] ?? null;
                    
                    // Handle boolean fields
                    if (in_array($field, $this->booleanFields)) {
                        $data[$field] = $this->parseBoolean($value, "Row {$rowNumber}: Invalid boolean value for {$field}");
                        continue;
                    }
                    
                    // Handle string fields
                    if (in_array($field, $this->stringFields)) {
                        $data[$field] = $value;
                        continue;
                    }
                    
                    // Handle numeric fields
                    $data[$field] = $this->parseNumeric($value, "Row {$rowNumber}: Invalid numeric value for {$field}");
                }
                
                Quarry::create($data);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function export(): string
    {
        $quarries = Quarry::all();
        $csv = Writer::createFromString('');
        
        // Add headers
        $csv->insertOne($this->fields);
        
        // Add records
        $quarries->each(function ($quarry) use ($csv) {
            $row = [];
            foreach ($this->fields as $field) {
                $row[] = $quarry->$field;
            }
            $csv->insertOne($row);
        });

        return $csv->toString();
    }

    private function parseNumeric($value, string $errorMessage): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (!is_numeric($value)) {
            throw new Exception($errorMessage);
        }

        return (float) $value;
    }

    private function parseBoolean($value, string $errorMessage): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (!in_array(strtolower($value), ['0', '1', 'true', 'false', 'yes', 'no'])) {
            throw new Exception($errorMessage);
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}