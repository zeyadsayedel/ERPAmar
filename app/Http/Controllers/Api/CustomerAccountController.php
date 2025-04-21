<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerAccount\StoreCustomerAccountRequest;
use App\Http\Requests\CustomerAccount\UpdateCustomerAccountRequest;
use App\Http\Resources\CustomerAccountResource;
use App\Models\CustomerAccount;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CustomerAccountController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CustomerAccountResource::collection(CustomerAccount::all());
    }

    public function store(StoreCustomerAccountRequest $request): CustomerAccountResource
    {
        $customerAccount = CustomerAccount::create($request->validated());
        return new CustomerAccountResource($customerAccount);
    }

    public function show(CustomerAccount $customerAccount): CustomerAccountResource
    {
        return new CustomerAccountResource($customerAccount->load(['quarries', 'contractors', 'invoices']));
    }

    public function update(UpdateCustomerAccountRequest $request, CustomerAccount $customerAccount): CustomerAccountResource
    {
        $customerAccount->update($request->validated());
        return new CustomerAccountResource($customerAccount);
    }

    public function destroy(CustomerAccount $customerAccount): Response
    {
        $customerAccount->delete();
        return response()->noContent();
    }
}