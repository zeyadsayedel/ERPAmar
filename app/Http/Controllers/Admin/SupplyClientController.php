<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplyClient\StoreSupplyClientRequest;
use App\Http\Requests\SupplyClient\UpdateSupplyClientRequest;
use App\Models\SupplyClient;
use App\Traits\AuthorizesModuleActions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplyClientController extends Controller
{
    use AuthorizesModuleActions;
    
    public function __construct()
    {
        $this->module = 'supply_client';
        $this->customActions = ['export', 'import'];
    }

    public function index(): Response
    {
        return Inertia::render('SupplyClient/Index', [
            'supplyClients' => SupplyClient::all(),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('SupplyClient/Create');
    }

    public function store(StoreSupplyClientRequest $request)
    {
        SupplyClient::create($request->validated());
        return redirect()->route('supply-clients.index')
            ->with('message', 'Supply client created successfully.');
    }

    public function show(SupplyClient $supplyClient): Response
    {
        return Inertia::render('SupplyClient/Show', [
            'supplyClient' => $supplyClient->load('contractors'),
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function edit(SupplyClient $supplyClient): Response
    {
        return Inertia::render('SupplyClient/Edit', [
            'supplyClient' => $supplyClient,
            'userPermissions' => $this->getUserModulePermissions(),
        ]);
    }

    public function update(UpdateSupplyClientRequest $request, SupplyClient $supplyClient)
    {
        $supplyClient->update($request->validated());
        return redirect()->route('supply-clients.index')
            ->with('message', 'Supply client updated successfully.');
    }

    public function destroy(SupplyClient $supplyClient)
    {
        $supplyClient->delete();
        return redirect()->route('supply-clients.index')
            ->with('message', 'Supply client deleted successfully.');
    }
}