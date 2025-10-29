"use client";
import { useEffect, useState, useMemo } from "react";
import ComplaintFilters from "./Components/ComplaintFilters";
import ComplaintTable from "./Components/ComplaintTable";
import ComplaintModal from "./Components/ComplaintModal";
import ComplaintTabs from "./Components/ComplaintTabs";

export default function DisputesAndComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/complaints`);
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };
    fetchComplaints();
  }, []);

  // Filter complaints
  const filteredData = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch = [c.subject, c.name, c.message]
        .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTab =
        currentTab === "all" || 
        (currentTab === "pending" && c.status === "Pending") ||
        (currentTab === "resolved" && c.status === "Resolved");
      return matchesSearch && matchesTab;
    });
  }, [complaints, searchTerm, currentTab]);

  // View Complaint
  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  // Resolve Complaint
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/complaints/${id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: "Resolved" } : c
          )
        );
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error resolving complaint:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Complaint Management</h1>
        <p className="text-foreground/50 mt-1">
          Manage and resolve customer complaints efficiently.
        </p>
      </div>

      <ComplaintFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ComplaintTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <ComplaintTable data={filteredData} onView={handleView} />

      {isModalOpen && (
        <ComplaintModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedComplaint={selectedComplaint}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}