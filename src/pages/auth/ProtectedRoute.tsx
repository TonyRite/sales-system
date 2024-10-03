// ProtectedRoute.tsx
// @ts-nocheck 
import pb from '@/api/Pocketbase';
import AppShell from '@/components/app-shell';
import {  Outlet } from 'react-router-dom';
import SignIn2 from './sign-in-2';

export function ProtectedRoute() {
  if (!pb.authStore.isValid) {
    // If user is not authenticated, redirect to the login page
    // return <Navigate to="/sign-in-2" replace />;
    return <SignIn2/>
  }
  // If the user is authenticated, allow access to the child routes
  return (
    <AppShell>
      <Outlet /> {/* This renders the children (dashboard, tasks, etc.) */}
    </AppShell>
  );
}
