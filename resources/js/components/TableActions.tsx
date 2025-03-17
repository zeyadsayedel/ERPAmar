import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TableActionsProps {
  editRoute: string;
  deleteRoute: string;
  itemName: string;
}

export function TableActions({
  editRoute,
  deleteRoute,
  itemName,
}: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    router.delete(deleteRoute);
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.location.href = editRoute}
      >
        <Edit2 className="h-4 w-4" />
        <span className="sr-only">Edit {itemName}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
        <span className="sr-only">Delete {itemName}</span>
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {itemName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete {itemName}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}