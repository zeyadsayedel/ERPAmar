import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteModal from '@/components/Shared/ConfirmDeleteModal';

interface TableActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteModal(true)}
          className="h-8 w-8 text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </>
  );
}