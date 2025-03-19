<?php

namespace App\Http\Requests\Permission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePermissionRequest extends FormRequest
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
        return [
            'name' => [
                'required', 
                'string', 
                'max:125', 
                Rule::unique('permissions', 'name')
                    ->where('guard_name', config('auth.defaults.guard', 'web'))
                    ->ignore($this->route('permission'))
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
        // If both module and action are provided, construct the name
        if ($this->has('module') && $this->has('action')) {
            $module = $this->input('module');
            $action = $this->input('action');
            
            // Construct the full permission name
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
            'module.required' => 'The module name is required when providing an action.',
            'action.required' => 'The action name is required when providing a module.',
        ];
    }
}