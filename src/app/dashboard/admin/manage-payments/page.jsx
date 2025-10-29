"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState({});
  const [riders, setRiders] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/all`);
      const data = await response.json();
      
      if (response.ok) {
        // Ensure each payment has the required fields
        const processedPayments = (Array.isArray(data) ? data : []).map(payment => ({
          ...payment,
          status: payment.status || 'Pending',
          riderPaid: payment.riderPaid || payment.Paid || 'Pending'
        }));
        setPayments(processedPayments);
        // Fetch user and rider details
        fetchUserAndRiderDetails(processedPayments);
      } else {
        console.error("Failed to fetch payments:", data.message);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAndRiderDetails = async (payments) => {
    try {
      // Get unique user IDs and rider IDs
      const userIds = [...new Set(payments.map(p => p.userId).filter(Boolean))];
      const riderIds = [...new Set(payments.map(p => p.riderId).filter(Boolean))];
      
      // Fetch user details
      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user/all`);
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
          const userMap = {};
          // Handle both array and object formats
          const usersArray = Array.isArray(userData) ? userData : (userData.users || userData.data || []);
          usersArray.forEach(u => {
            const id = u._id || u.id;
            if (id) {
              userMap[id] = u;
            }
          });
          setUsers(userMap);
        }
      } catch (userError) {
        console.error("Error fetching user details:", userError);
      }
      
      // Fetch rider details
      try {
        const riderResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/rider/riders`);
        const riderData = await riderResponse.json();
        
        if (riderResponse.ok) {
          const riderMap = {};
          // Handle both array and object formats
          const ridersArray = Array.isArray(riderData) ? riderData : (riderData.riders || riderData.data || []);
          ridersArray.forEach(r => {
            const id = r._id || r.id;
            if (id) {
              riderMap[id] = r;
            }
          });
          setRiders(riderMap);
        }
      } catch (riderError) {
        console.error("Error fetching rider details:", riderError);
      }
    } catch (error) {
      console.error("Error fetching user/rider details:", error);
    }
  };

  const handlePayRider = async (paymentId) => {
    // Add paymentId to processing set
    setProcessing(prev => new Set(prev).add(paymentId));
    
    try {
      // Call the API to mark the rider as paid
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/payment/mark-rider-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update the payment status in the local state
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            payment._id === paymentId 
              ? { ...payment, riderPaid: 'Paid' } 
              : payment
          )
        );
        // Show success message
        console.log("Rider paid successfully");
      } else {
        console.error("Failed to mark rider as paid:", result.message);
        // Show error message to user
        alert(`Failed to pay rider: ${result.message}`);
      }
    } catch (error) {
      console.error("Error marking rider as paid:", error);
      // Show error message to user
      alert("Error paying rider. Please try again.");
    } finally {
      // Remove paymentId from processing set
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Payments</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Index</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Rider Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Rider Commission</TableHead>
              <TableHead>Platform Commission</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, index) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {payment.userEmail}
                </TableCell>
                <TableCell>
                      {payment.riderEmail}
                </TableCell>
                <TableCell>৳{payment?.rideDetails?.fareBreakdown?.totalAmount || 0}</TableCell>
                <TableCell>৳{payment?.rideDetails.fareBreakdown?.riderCommission || 0}</TableCell>
                <TableCell>৳{payment?.rideDetails?.fareBreakdown?.platformCommission || 0}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant={
                      payment.status === 'Paid' ? 'default' : 
                      'secondary'
                    }
                  >
                    {payment.paid === 'Paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {payment.status === 'Paid' && payment.paid !== 'Paid' && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePayRider(payment._id)}
                      disabled={processing.has(payment._id)}
                    >
                      {processing.has(payment._id) ? 'Processing...' : 'Pay'}
                    </Button>
                  )}
                  {payment.paid === 'Paid' && (
                    <Badge variant="default">Paid</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}