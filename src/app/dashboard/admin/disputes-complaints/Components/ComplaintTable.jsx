"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ComplaintTable({
  data,
  allData,
  setData,
  setModalType,
  setIsModalOpen,
  setSelectedComplaint,
}) {
  // Modal open handler
  const openModal = (complaint, type) => {
    setSelectedComplaint(complaint);
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-background rounded-lg border border-accent overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Against</TableHead>
            <TableHead>Ride ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.type}</TableCell>
                <TableCell>{complaint.from}</TableCell>
                <TableCell>{complaint.against}</TableCell>
                <TableCell>{complaint.rideId}</TableCell>
                <TableCell>{complaint.status}</TableCell>
                <TableCell>{complaint.date}</TableCell>
                <TableCell>{complaint.priority}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(complaint, "view")}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(complaint, "edit")}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(complaint, "contact")}
                  >
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openModal(complaint, "resolve")}
                  >
                    Resolve
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                No complaints found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
