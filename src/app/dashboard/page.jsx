import React from 'react';
import AdminDash from './Components/dashboard/AdminDash';
import PassengerDash from './Components/dashboard/PassengerDash';
import RiderDash from './Components/dashboard/RiderDash';

export default function DashboardPage() {
  const role = 'user';
  return (
    <>
      {
        role === 'admin'
        && <AdminDash />
      }
      {
        role === 'user'
        && <PassengerDash />
      }
      {
        role === 'rider'
        && <RiderDash />
      }
    </>
  );
}
