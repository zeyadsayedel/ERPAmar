import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ForbiddenProps {
  status: number;
  message: string;
}

const Forbidden = ({ message }: ForbiddenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Head title="403: Forbidden" />
      
      <div className="text-center">
        <ShieldX className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Access Denied
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {message || "You don't have permission to access this resource."}
        </p>
        <div className="space-x-4">
          <Button variant="outline" asChild>
            <Link href={route('dashboard')}>Back to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={route('home')}>Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;