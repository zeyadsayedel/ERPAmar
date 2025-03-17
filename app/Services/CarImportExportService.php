<?php

namespace App\Services;

use App\Models\Car;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use League\Csv\Writer;

class CarImportExportService
{
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

                Car::create([
                    'name' => $record['name'],
                    'car_load' => $this->parseNumeric($record['car_load'] ?? null, "Row {$rowNumber}: Invalid car_load value"),
                    'type_of_car' => $record['type_of_car'] ?? null,
                    'car_load_supply' => $this->parseNumeric($record['car_load_supply'] ?? null, "Row {$rowNumber}: Invalid car_load_supply value"),
                ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function export(): string
    {
        $cars = Car::all();
        $csv = Writer::createFromString('');
        
        // Add headers
        $csv->insertOne(['name', 'car_load', 'type_of_car', 'car_load_supply']);
        
        // Add records
        $cars->each(function ($car) use ($csv) {
            $csv->insertOne([
                $car->name,
                $car->car_load,
                $car->type_of_car,
                $car->car_load_supply,
            ]);
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
}