import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, LoaderCircle } from 'lucide-react';
import type { RegisterModuleData } from '@/types/role';

interface RegisterModuleFormProps {
  onSubmit: (data: RegisterModuleData) => void;
  isSubmitting?: boolean;
}

export function RegisterModuleForm({ onSubmit, isSubmitting = false }: RegisterModuleFormProps) {
  const [module, setModule] = useState<string>('');
  const [newAction, setNewAction] = useState<string>('');
  const [actions, setActions] = useState<string[]>([
    'list', 'view', 'create', 'update', 'delete'
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const addAction = async () => {
    if (newAction.trim() && !actions.includes(newAction.trim())) {
      setIsAdding(true);
      try {
        setActions([...actions, newAction.trim()]);
        setNewAction('');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const removeAction = (action: string) => {
    setActions(actions.filter(a => a !== action));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (module.trim()) {
      onSubmit({
        module: module.trim(),
        actions,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="module">Module Name</Label>
        <Input
          id="module"
          value={module}
          onChange={e => setModule(e.target.value)}
          placeholder="e.g., product, invoice, report"
          required
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          This will create standardized permissions like {module ? `${module}:create, ${module}:update, etc.` : 'module:create, module:update, etc.'}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Standard Actions</Label>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Badge key={action} variant="outline" className="flex items-center gap-1">
              {action}
              <button
                type="button"
                onClick={() => removeAction(action)}
                className="text-muted-foreground hover:text-foreground"
                disabled={isSubmitting}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="new-action">Add Custom Action</Label>
          <Input
            id="new-action"
            value={newAction}
            onChange={e => setNewAction(e.target.value)}
            placeholder="e.g., export, import, archive"
            disabled={isSubmitting || isAdding}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={addAction}
          disabled={isSubmitting || isAdding || !newAction.trim()}
        >
          {isAdding ? (
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4 mr-2" />
          )}
          Add
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !module.trim()}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Registering...' : 'Register Module Permissions'}
        </Button>
      </div>
    </form>
  );
}