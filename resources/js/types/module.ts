import { Permission } from './role';

export interface ModuleAction {
    name: string;
    label: string;
    description?: string;
}

export interface Module {
    name: string;
    label: string;
    description?: string;
    icon?: string;
    permissions: Permission[];
    actions: ModuleAction[];
    routes: {
        index?: string;
        create?: string;
        edit?: string;
        show?: string;
    };
}

export interface ModuleConfig {
    [key: string]: Module;
}

export interface ModulePermissions {
    [key: string]: boolean;
}

export interface ModuleAccess {
    [key: string]: ModulePermissions;
}