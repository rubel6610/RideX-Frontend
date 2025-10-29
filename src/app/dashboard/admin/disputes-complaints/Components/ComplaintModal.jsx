"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ComplaintModal({
  isModalOpen,
  setIsModalOpen,
  selectedComplaint,
  onResolve,
}) {
  if (!selectedComplaint) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complaint Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>ID:</strong> {selectedComplaint._id}</p>
          <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
          <p><strong>Name:</strong> {selectedComplaint.name}</p>
          <p><strong>Email:</strong> {selectedComplaint.email}</p>
          <p><strong>Status:</strong> {selectedComplaint.status}</p>
          <p><strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
          <p><strong>Message:</strong> {selectedComplaint.message}</p>
          {selectedComplaint.rideId && (
            <p><strong>Ride ID:</strong> {selectedComplaint.rideId}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          {selectedComplaint.status !== "Resolved" && (
            <Button variant="default" onClick={() => onResolve(selectedComplaint._id)}>
              Mark as Resolved
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}