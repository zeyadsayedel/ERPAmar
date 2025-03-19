<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class PermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Parse the resource:action format if available
        $parts = explode(':', $this->name);
        $module = $parts[0] ?? null;
        $action = $parts[1] ?? null;
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'module' => $module,
            'action' => $action,
            'display_name' => $this->getDisplayName(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
    
    /**
     * Get a human-readable display name for the permission
     */
    protected function getDisplayName(): string
    {
        $parts = explode(':', $this->name);
        
        if (count($parts) === 2) {
            [$module, $action] = $parts;
            
            // Convert to title case
            $module = Str::title($module);
            $action = Str::title($action);
            
            return "{$action} {$module}";
        }
        
        // Fallback for non-standard names
        return Str::title(str_replace(['_', '-', ':'], ' ', $this->name));
    }
}
