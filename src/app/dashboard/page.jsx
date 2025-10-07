'use client'

import React from 'react';
import AdminDash from './Components/dashboard/AdminDash';
import PassengerDash from './Components/dashboard/PassengerDash';
import RiderDash from './Components/dashboard/RiderDash';
import { useAuth } from '../hooks/AuthProvider';

export default function DashboardPage() {
  const { user} = useAuth();
  return (
    <>
      {
        user.role === 'admin'
        && <AdminDash />
      }
      {
        user.role === 'user'
        && <PassengerDash />
      }
      {
        user.role === 'rider'
        && <RiderDash />
      }
    </>
  );
}
