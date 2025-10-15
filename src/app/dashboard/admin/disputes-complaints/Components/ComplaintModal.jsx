"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ComplaintModal({
  isModalOpen,
  setIsModalOpen,
  modalType,
  selectedComplaint,
  data,
  setData,
}) {
  if (!selectedComplaint) return null;

  // Update Complaint (edit)
  const handleSave = () => {
    const updatedData = data.map((c) =>
      c.id === selectedComplaint.id ? selectedComplaint : c
    );
    setData(updatedData);
    setIsModalOpen(false);
  };

  // Resolve Complaint
  const handleResolve = () => {
    const updatedData = data.map((c) =>
      c.id === selectedComplaint.id ? { ...c, status: "Resolved" } : c
    );
    setData(updatedData);
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modalType === "view" && "View Complaint"}
            {modalType === "edit" && "Edit Complaint"}
            {modalType === "contact" && "Contact User"}
            {modalType === "resolve" && "Resolve Complaint"}
          </DialogTitle>
        </DialogHeader>

        {/* VIEW */}
        {modalType === "view" && (
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedComplaint.id}</p>
            <p><strong>Type:</strong> {selectedComplaint.type}</p>
            <p><strong>From:</strong> {selectedComplaint.from}</p>
            <p><strong>Against:</strong> {selectedComplaint.against}</p>
            <p><strong>Status:</strong> {selectedComplaint.status}</p>
            <p><strong>Date:</strong> {selectedComplaint.date}</p>
            <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
          </div>
        )}

        {/* EDIT */}
        {modalType === "edit" && (
          <div className="space-y-4">
            <Input
              label="Type"
              value={selectedComplaint.type}
              onChange={(e) =>
                (selectedComplaint.type = e.target.value) && setData([...data])
              }
            />
            <Input
              label="Status"
              value={selectedComplaint.status}
              onChange={(e) =>
                (selectedComplaint.status = e.target.value) && setData([...data])
              }
            />
            <Input
              label="Priority"
              value={selectedComplaint.priority}
              onChange={(e) =>
                (selectedComplaint.priority = e.target.value) && setData([...data])
              }
            />
          </div>
        )}

        {/* CONTACT */}
        {modalType === "contact" && (
          <div className="space-y-4">
            <Textarea placeholder="Write your message..." />
            <Button>Send Message</Button>
          </div>
        )}

        {/* RESOLVE */}
        {modalType === "resolve" && (
          <div>
            <p>Do you want to mark this complaint as resolved?</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          {modalType === "edit" && <Button onClick={handleSave}>Save</Button>}
          {modalType === "resolve" && (
            <Button variant="default" onClick={handleResolve}>
              Resolve
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
