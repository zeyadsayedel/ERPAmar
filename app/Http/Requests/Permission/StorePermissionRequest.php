<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePermissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization now handled by route middleware
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // If we're registering a module
        if ($this->has('module') && $this->has('actions')) {
            return [
                'module' => ['required', 'string', 'max:50'],
                'actions' => ['required', 'array'],
                'actions.*' => ['string', 'max:50'],
            ];
        }
        
        // If we're adding a permission to a module
        if ($this->has('action') && $this->route('module')) {
            return [
                'action' => ['required', 'string', 'max:50'],
            ];
        }
        
        // Default case - single permission creation
        return [
            'name' => [
                'required', 
                'string', 
                'max:125', 
                Rule::unique('permissions', 'name')->where('guard_name', config('auth.defaults.guard', 'web'))
            ],
            'module' => ['sometimes', 'string', 'max:50'],
            'action' => ['sometimes', 'string', 'max:50'],
            'display_name' => ['sometimes', 'string', 'max:125'],
        ];
    }
    
    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // If we're adding a permission to a module, construct the full name
        if ($this->has('action') && $this->route('module')) {
            $module = $this->route('module');
            $action = $this->input('action');
            
            // Add the constructed name to the request data
            $this->merge([
                'name' => "{$module}:{$action}",
            ]);
        }
    }
    
    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The permission name is required.',
            'name.unique' => 'A permission with this name already exists.',
            'module.required' => 'The module name is required.',
            'actions.required' => 'At least one action must be provided.',
            'action.required' => 'The action name is required.',
        ];
    }
}