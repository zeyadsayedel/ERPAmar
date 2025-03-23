import React from 'react';
import { Head } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import UserProfile from '@/components/User/UserProfile';
import { User, UserRolesSummary } from '@/types/user';

interface ShowProps {
  user: User;
  userRolesSummary: UserRolesSummary;
  userPermissions: Record<string, boolean>;
}

const Show = ({ user, userRolesSummary, userPermissions }: ShowProps) => {

  return (
    <AppSidebarLayout breadcrumbs={[
      { title: 'Home', href: route('dashboard') },
      { title: 'Users', href: route('admin.users.index') },
      { title: user.name, href: route('admin.users.show', user.id) },
    ]}>
      <Head title={`User: ${user.name}`} />
      
      <div className="container py-6">
        <UserProfile userPermissions={userPermissions} user={user} userRolesSummary={userRolesSummary} />
      </div>
    </AppSidebarLayout>
  );
};

export default Show;
