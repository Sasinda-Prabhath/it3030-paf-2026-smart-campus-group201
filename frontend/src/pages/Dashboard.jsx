import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import UserDashboard from './UserDashboard';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <div className="text-center text-red-600">Not authenticated</div>;

  // Render dashboard based on role
  if (user.role === 'ADMIN') return <AdminDashboard user={user} />;
  if (user.role === 'STAFF') return <StaffDashboard user={user} />;
  return <UserDashboard user={user} />;
}
