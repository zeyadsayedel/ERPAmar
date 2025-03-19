<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ModuleRegistry
{
    protected array $modules = [];

    public function register(string $name, array $config = []): void
    {
        $this->modules[Str::lower($name)] = array_merge([
            'name' => $name,
            'label' => Str::title($name),
            'actions' => ['list', 'view', 'create', 'update', 'delete'],
            'routes' => [
                'index' => "admin.{$name}.index",
                'create' => "admin.{$name}.create",
                'edit' => "admin.{$name}.edit",
                'show' => "admin.{$name}.show",
            ],
        ], $config);
    }

    public function getModule(string $name): ?array
    {
        return $this->modules[Str::lower($name)] ?? null;
    }

    public function getAllModules(): array
    {
        return $this->modules;
    }

    public function getModulesForNavigation(): Collection
    {
        return collect($this->modules)
            ->filter(fn($module) => $module['showInNavigation'] ?? true)
            ->values();
    }

    public function getModuleActions(string $name): array
    {
        $module = $this->getModule($name);
        return $module ? $module['actions'] : [];
    }

    public function getModuleRoutes(string $name): array
    {
        $module = $this->getModule($name);
        return $module ? $module['routes'] : [];
    }

    public function isRegistered(string $name): bool
    {
        return isset($this->modules[Str::lower($name)]);
    }
}