import React from 'react';

export default function DashboardPage() {
  const role = 'user';
  return (
    <>
      {
        role === 'admin'
        && <div>hello from Admin!</div>
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
