'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ComplaintFilters from './Components/ComplaintFilters';
import ComplaintStats from './Components/ComplaintStats';
import ComplaintTable from './Components/ComplaintTable';
import ComplaintModal from './Components/ComplaintModal';

export default function DisputesAndComplaints() {
  // initial complaints data
  const initialComplaints = useMemo(() => ([
    { id: '#C1234', type: 'Driver Misbehavior', from: 'Rider (R-1001)', against: 'Driver (D-2003)', rideId: 'RIDE-567', status: 'Pending', date: '2024-01-15', priority: 'High' },
    { id: '#C1235', type: 'Fare Dispute', from: 'Driver (D-2001)', against: 'Rider (R-1005)', rideId: 'RIDE-568', status: 'In Review', date: '2024-01-14', priority: 'Medium' },
    { id: '#C1236', type: 'Lost Item', from: 'Rider (R-1009)', against: 'Driver (D-2002)', rideId: 'RIDE-570', status: 'Resolved', date: '2024-01-13', priority: 'Low' },
    { id: '#C1237', type: 'Vehicle Condition', from: 'Rider (R-1012)', against: 'Driver (D-2004)', rideId: 'RIDE-572', status: 'Pending', date: '2024-01-12', priority: 'High' },
    { id: '#C1238', type: 'Route Issue', from: 'Rider (R-1015)', against: 'Driver (D-2003)', rideId: 'RIDE-575', status: 'In Review', date: '2024-01-11', priority: 'Medium' },
  ]), []);

  const [data, setData] = useState(initialComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // filtering optimize with useMemo
  const filteredData = useMemo(() => {
    return data.filter((complaint) => {
      const matchesSearch = [complaint.id, complaint.from, complaint.against, complaint.rideId, complaint.type]
        .some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [data, searchTerm, statusFilter, typeFilter]);

  // stats calculate
  const stats = useMemo(() => {
    let pending = 0, inReview = 0, resolved = 0;
    data.forEach((c) => {
      if (c.status === 'Pending') pending++;
      if (c.status === 'In Review') inReview++;
      if (c.status === 'Resolved') resolved++;
    });
    return { total: data.length, pending, inReview, resolved };
  }, [data]);

  // add new complaint
  const handleAddComplaint = () => {
    const newComplaint = {
      id: `#C${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'New Complaint',
      from: 'Rider (R-XXXX)',
      against: 'Driver (D-XXXX)',
      rideId: `RIDE-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      priority: 'Medium',
    };
    setData([newComplaint, ...data]);
  };

  return (
    <div className="p-4 space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Complaint Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage and resolve customer complaints efficiently</p>
        </div>
        <Button onClick={handleAddComplaint} className="w-full sm:w-auto">+ Add New Complaint</Button>
      </div>

      {/* Filters */}
      <ComplaintFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Stats */}
      <ComplaintStats stats={stats} />

      {/* Table */}
      <ComplaintTable 
        data={filteredData} 
        allData={data}
        setData={setData}
        setModalType={setModalType}
        setIsModalOpen={setIsModalOpen}
        setSelectedComplaint={setSelectedComplaint}
      />

      {/* Modal */}
      {isModalOpen && (
        <ComplaintModal 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalType={modalType}
          selectedComplaint={selectedComplaint}
          data={data}
          setData={setData}
        />
      )}
    </div>
  );
}
