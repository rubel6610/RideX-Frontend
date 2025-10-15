"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Star, X, Send } from "lucide-react";
import { toast } from "sonner";

const RideReviewModal = ({ 
  open, 
  onClose, 
  rideId,
  riderId, 
  userId,
  riderName,
  riderVehicle 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit review
  const handleSubmit = async () => {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride-reviews`, {
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
      console.log("rideId: ", rideId);
      console.log("riderId: ", riderId);
      console.log("userId: ", userId);

      const data = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!", {
          description: "Thank you for your feedback!",
        });
        setRating(0);
        setComment("");
        onClose();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Network error: Please check your connection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden z-[9999]">
        {/* Header with Gradient */}
        <DialogHeader className="p-6 bg-gradient-to-r from-primary to-accent text-white">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-white text-primary font-bold text-2xl">
                {riderName?.charAt(0) || "R"}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-white text-2xl font-bold mb-1">
                Rate Your Ride
              </DialogTitle>
              <DialogDescription className="text-white/90 text-sm">
                How was your experience with {riderName}?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rider Info */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-card to-background border border-border">
            <p className="text-sm text-muted-foreground mb-1">Your Rider</p>
            <p className="text-lg font-bold text-foreground">{riderName || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{riderVehicle || "N/A"}</p>
          </div>

          {/* Rating Section */}
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Rate Your Experience
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tap a star to rate (1-5)
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center">
              <Rating 
                value={rating} 
                onValueChange={setRating} 
                size="xl" 
              />
            </div>

            {/* Rating Text */}
            {rating > 0 && (
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
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
            <label className="text-sm font-semibold text-foreground">
              Additional Comments <span className="text-muted-foreground">(Optional)</span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience..."
              className="min-h-[100px] resize-none border-border focus-visible:ring-primary"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-12 text-base font-semibold"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RideReviewModal;

