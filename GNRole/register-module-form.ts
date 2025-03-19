import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X } from 'lucide-react';
import { RegisterModuleData } from '@/types/role';

interface RegisterModuleFormProps {
  onSubmit: (data: RegisterModuleData) => void;
  isSubmitting?: boolean;
}

export const RegisterModuleForm: React.FC<RegisterModuleFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [module, setModule] = useState<string>('');
  const [newAction, setNewAction] = useState<string>('');
  const [actions, setActions] = useState<string[]>([
    'list', 'view', 'create', 'update', 'delete'
  ]);

  const addAction = () => {
    if (newAction.trim() && !actions.includes(newAction.trim())) {
      setActions([...actions, newAction.trim()]);
      setNewAction('');
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
    <Card>
      <CardHeader>
        <CardTitle>Register Module Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="module">Module Name</Label>
            <Input
              id="module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="e.g., product, invoice, report"
              required
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
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g., export, import, archive"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addAction}
              disabled={!newAction.trim()}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !module.trim()}>
              {isSubmitting ? 'Registering...' : 'Register Module Permissions'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterModuleForm;
