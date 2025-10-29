"use client";
import { Button } from "@/components/ui/button";

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
    <div className="border border-accent mt-10 rounded-xl">
      {/* Scroll indicator for mobile */}
      <div className="text-center py-1.5 bg-accent/20 lg:hidden">
        <p className="text-[10px] sm:text-xs text-muted-foreground">← Swipe to scroll →</p>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full text-xs sm:text-sm min-w-[900px]">
          <thead className="bg-accent text-left sticky top-0 z-10">
            <tr>
              <th className="px-2 sm:px-4 py-2">Complaint ID</th>
              <th className="px-2 sm:px-4 py-2">Type</th>
              <th className="px-2 sm:px-4 py-2">From</th>
              <th className="px-2 sm:px-4 py-2">Against</th>
              <th className="px-2 sm:px-4 py-2">Ride ID</th>
              <th className="px-2 sm:px-4 py-2">Status</th>
              <th className="px-2 sm:px-4 py-2">Date</th>
              <th className="px-2 sm:px-4 py-2">Priority</th>
              <th className="px-2 sm:px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((complaint) => (
                <tr key={complaint.id} className="border-t">
                  <td className="px-2 sm:px-4 py-2 font-medium">{complaint.id}</td>
                  <td className="px-2 sm:px-4 py-2">{complaint.type}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs">{complaint.from}</td>
                  <td className="px-2 sm:px-4 py-2 text-xs">{complaint.against}</td>
                  <td className="px-2 sm:px-4 py-2">{complaint.rideId}</td>
                  <td className="px-2 sm:px-4 py-2">{complaint.status}</td>
                  <td className="px-2 sm:px-4 py-2">{complaint.date}</td>
                  <td className="px-2 sm:px-4 py-2">{complaint.priority}</td>
                  <td className="px-2 sm:px-4 py-2">
                    <div className="flex justify-end flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(complaint, "view")}
                        className="text-xs px-2 h-7"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(complaint, "edit")}
                        className="text-xs px-2 h-7"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(complaint, "contact")}
                        className="text-xs px-2 h-7"
                      >
                        Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openModal(complaint, "resolve")}
                        className="text-xs px-2 h-7"
                      >
                        Resolve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-muted-foreground">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}