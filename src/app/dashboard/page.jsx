import React from 'react';
import AdminDash from './Components/dashboard/AdminDash';

export default function DashboardPage() {
  const role = 'admin';
  return (
    <>
      {
        role === 'admin'
        && <AdminDash />
      }
      {
        role === 'user'
        && <div>hello from User!</div>
      }
      {
        role === 'rider'
        && <div>hello from Rider!</div>
      }
    </>
  );
}
