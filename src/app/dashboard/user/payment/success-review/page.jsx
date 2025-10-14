"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, History, Star, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/hooks/AuthProvider";
import RideReviewModal from "@/components/Shared/RideReviewModal";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "0";
  const rideId = searchParams.get("rideId") || "";
  const riderId = searchParams.get("riderId") || "";
  const userId = searchParams.get("userId") || user?.id || "";
  const riderName = searchParams.get("riderName") || "Rider";
  const vehicleType = searchParams.get("vehicleType") || "Bike";
  const vehicleRegisterNumber = searchParams.get("vehicleRegisterNumber") || "";
  const distance = searchParams.get("distance") || "0";
  const transactionId = searchParams.get("transactionId") || "TXN123456789";
  console.log(amount);
  // Hide animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Open review modal after 5 seconds
  useEffect(() => {
    const reviewTimer = setTimeout(() => {
      setIsReviewOpen(true);
    }, 5000);

    return () => clearTimeout(reviewTimer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-card dark:to-background px-4 py-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      {showAnimation && (
        <>
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full animate-ping" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-accent/20 rounded-full animate-bounce" />
          <div className="absolute bottom-32 right-40 w-16 h-16 bg-green-500/20 rounded-full animate-ping" />
        </>
      )}

      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
          {/* Success Header with Gradient */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/90 text-lg">
              Your ride has been completed
            </p>
          </div>

          {/* Payment Details */}
          <div className="p-8 space-y-6">
            {/* Amount Paid */}
            <div className="text-center py-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-dashed border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Amount Paid</p>
              <p className="text-5xl font-bold text-primary">৳{amount}</p>
              <Badge className="mt-3 bg-green-600 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Transaction Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="text-sm font-semibold text-foreground">{transactionId}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-green-600 text-white">Paid</Badge>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Thank You for Riding with RideX!
              </h3>
              <p className="text-sm text-muted-foreground">
                We hope you had a great experience. Your receipt has been sent to your email.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => router.push("/dashboard/user/ride-history")}
                variant="outline"
                className="h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white"
              >
                <History className="w-5 h-5 mr-2" />
                View History
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/dashboard/user/book-a-ride")}
                variant="default"
                className="h-12 text-base font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Book Another Ride
              </Button>
            </div>

            {/* Download Receipt */}
            <Button
              variant="ghost"
              className="w-full text-primary hover:bg-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact our support team anytime.
        </p>
      </div>

      {/* Ride Review Modal - Opens after 5 seconds */}
      <RideReviewModal
        open={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        rideId={rideId}
        riderId={riderId}
        userId={userId}
        riderName={riderName}
        riderVehicle={`${vehicleType} - ${vehicleRegisterNumber}`}
      />
    </div>
  );
};

export default PaymentSuccessPage;