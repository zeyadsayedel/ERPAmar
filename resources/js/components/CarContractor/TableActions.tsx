import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Edit } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteModal from '@/components/Shared/ConfirmDeleteModal';
import { Link } from '@inertiajs/react';

interface TableActionsProps {
  viewRoute?: string;
  editRoute?: string;
  onDelete: () => void;
}

export default function TableActions({ viewRoute, editRoute, onDelete }: TableActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <div className="flex space-x-2">
        {viewRoute && (
          <Button variant="ghost" size="sm" asChild className="h-8 w-8">
            <Link href={viewRoute}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
        )}
        
        {editRoute && (
          <Button variant="ghost" size="sm" asChild className="h-8 w-8">
            <Link href={editRoute}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
        )}
        
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
        title="Delete Car Contractor"
        description="Are you sure you want to delete this car contractor? This action cannot be undone."
      />
    </>
  );
}