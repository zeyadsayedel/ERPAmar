<?php

use App\Models\Car;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('can_view_cars_index', function () {
    $user = User::factory()->create();
    $car = Car::create([
        'name' => 'Test Car',
        'car_load' => 100.50,
        'type_of_car' => 'Dump Truck',
        'car_load_supply' => 200.75
    ]);

    $response = $this->actingAs($user)
        ->get(route('cars.index'));

    $response->assertOk()
        ->assertInertia(fn ($assert) => $assert
            ->component('Car/Index')
            ->has('cars', 1)
            ->where('cars.0.name', 'Test Car')
            ->where('cars.0.car_load', 100.50)
            ->where('cars.0.type_of_car', 'Dump Truck')
            ->where('cars.0.car_load_supply', 200.75)
        );
});

test('can_create_car', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->post(route('cars.store'), [
            'name' => 'New Car',
            'car_load' => 150.25,
            'type_of_car' => 'Excavator',
            'car_load_supply' => 300.50
        ]);

    $response->assertRedirect(route('cars.index'))
        ->assertSessionHas('message', 'Car created successfully.');

    $this->assertDatabaseHas('car', [
        'name' => 'New Car',
        'car_load' => 150.25,
        'type_of_car' => 'Excavator',
        'car_load_supply' => 300.50
    ]);
});

test('can_update_car', function () {
    $user = User::factory()->create();
    $car = Car::create([
        'name' => 'Old Car',
        'car_load' => 100,
        'type_of_car' => 'Old Type',
        'car_load_supply' => 200
    ]);

    $response = $this->actingAs($user)
        ->put(route('cars.update', $car), [
            'name' => 'Updated Car',
            'car_load' => 175.50,
            'type_of_car' => 'Updated Type',
            'car_load_supply' => 350.75
        ]);

    $response->assertRedirect(route('cars.index'))
        ->assertSessionHas('message', 'Car updated successfully.');

    $this->assertDatabaseHas('car', [
        'id' => $car->id,
        'name' => 'Updated Car',
        'car_load' => 175.50,
        'type_of_car' => 'Updated Type',
        'car_load_supply' => 350.75
    ]);
});

test('can_delete_car', function () {
    $user = User::factory()->create();
    $car = Car::create([
        'name' => 'Car to Delete',
        'car_load' => 100,
        'type_of_car' => 'Any Type',
        'car_load_supply' => 200
    ]);

    $response = $this->actingAs($user)
        ->delete(route('cars.destroy', $car));

    $response->assertRedirect(route('cars.index'))
        ->assertSessionHas('message', 'Car deleted successfully.');

    $this->assertDatabaseMissing('car', ['id' => $car->id]);
});

test('can_import_cars', function () {
    $user = User::factory()->create();
    
    $csvContent = "name,car_load,type_of_car,car_load_supply\n";
    $csvContent .= "Imported Car,125.50,Imported Type,250.75\n";
    
    $tmpFile = tmpfile();
    fwrite($tmpFile, $csvContent);
    $tmpFilePath = stream_get_meta_data($tmpFile)['uri'];
    
    $file = new \Illuminate\Http\UploadedFile(
        $tmpFilePath,
        'cars.csv',
        'text/csv',
        null,
        true
    );

    $response = $this->actingAs($user)
        ->post(route('cars.import'), [
            'file' => $file
        ]);

    $response->assertRedirect(route('cars.index'))
        ->assertSessionHas('message', 'Cars imported successfully.');

    $this->assertDatabaseHas('car', [
        'name' => 'Imported Car',
        'car_load' => 125.50,
        'type_of_car' => 'Imported Type',
        'car_load_supply' => 250.75
    ]);
    
    fclose($tmpFile);
});

test('can_export_cars', function () {
    $user = User::factory()->create();
    Car::create([
        'name' => 'Car to Export',
        'car_load' => 100.25,
        'type_of_car' => 'Export Type',
        'car_load_supply' => 200.50
    ]);

    $response = $this->actingAs($user)
        ->get(route('cars.export'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'text/csv');
});