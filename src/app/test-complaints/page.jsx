"use client";
import { useEffect, useState } from "react";

export default function TestComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        console.log("API Base URL:", process.env.NEXT_PUBLIC_SERVER_BASE_URL);
        const url = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/complaints`;
        console.log("Fetching from URL:", url);
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Test Complaints</h1>
      <p>API Base URL: {process.env.NEXT_PUBLIC_SERVER_BASE_URL}</p>
      <p>Found {complaints.length} complaints</p>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>
            <strong>{complaint.subject}</strong> - {complaint.status}
          </li>
        ))}
      </ul>
    </div>
  );
}