"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/hooks/AuthProvider";
import { toast } from "sonner";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Get payment details from URL params
  const amount = searchParams.get("amount") || "0";
  const rideId = searchParams.get("rideId") || "";
  const riderId = searchParams.get("riderId") || "";
  const userId = searchParams.get("userId") || user?.id || "";
  const transactionId = searchParams.get("transactionId") || "TXN123456789";

  // Submit review function
  const handleSubmitReview = async () => {
    // Validation
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // Check if required IDs are present
    if (!rideId || !riderId || !userId) {
      toast.error("Missing ride information");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, update the rider rating (PUT)
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride-reviews/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          riderId,
          review: Number(rating), // Ensure rating is a number, not string
        }),
      });

      if (updateResponse.status === 200) {
        // Then, submit the full review (POST)
        const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride-reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rideId,
            riderId,
            userId,
            rating,
            comment: comment.trim(),
          }),
        });

        if (reviewResponse.ok) {
          setReviewSubmitted(true);
          toast.success("Review submitted successfully!", {
            description: "Thank you for your feedback!",
          });
          
          // Navigate to ride history after 2 seconds
          setTimeout(() => {
            router.push("/dashboard/user/ride-history");
          }, 2000);
        } else {
          const reviewData = await reviewResponse.json();
          toast.error(reviewData.message || "Failed to submit review");
        }
      } else {
        const updateData = await updateResponse.json();
        toast.error(updateData.message || "Failed to update rider rating");
      }
    } catch (error) {
      toast.error("Network error: Please check your connection");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hide animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
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
            {/* Amount Paid Card */}
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

            {/* Leave a Review Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Rate Your Ride Now</h3>
             
              {!reviewSubmitted ? (
                <>
                  {/* Rating Section */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Rate your experience</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-6 h-6 cursor-pointer transition-colors ${
                            star <= rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-muted-foreground hover:text-yellow-400"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    {rating > 0 && (
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <p className="text-sm font-semibold text-primary">
                          {rating === 5 && "⭐ Excellent!"}
                          {rating === 4 && "😊 Very Good"}
                          {rating === 3 && "👍 Good"}
                          {rating === 2 && "😐 Fair"}
                          {rating === 1 && "😞 Poor"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Share your experience <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {comment.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Review Button */}
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={rating === 0 || isSubmitting}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Review Submitted!</h4>
                  <p className="text-sm text-muted-foreground">
                    Thank you for rating your ride experience. Your feedback helps us improve our service.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact our support team anytime.
        </p>
      </div>

    </div>
  );
};

export default PaymentSuccessPage;
