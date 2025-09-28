'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, ArrowUpDown, Filter } from 'lucide-react';

export default function DisputesAndComplaints() {
  // Sample complaint data
  const [data, setData] = useState([
    {
      id: '#C1234',
      type: 'Driver Misbehavior',
      from: 'Rider (R-1001)',
      against: 'Driver (D-2003)',
      rideId: 'RIDE-567',
      status: 'Pending',
      date: '2024-01-15',
      priority: 'High',
    },
    {
      id: '#C1235',
      type: 'Fare Dispute',
      from: 'Driver (D-2001)',
      against: 'Rider (R-1005)',
      rideId: 'RIDE-568',
      status: 'In Review',
      date: '2024-01-14',
      priority: 'Medium',
    },
    {
      id: '#C1236',
      type: 'Lost Item',
      from: 'Rider (R-1009)',
      against: 'Driver (D-2002)',
      rideId: 'RIDE-570',
      status: 'Resolved',
      date: '2024-01-13',
      priority: 'Low',
    },
    {
      id: '#C1237',
      type: 'Vehicle Condition',
      from: 'Rider (R-1012)',
      against: 'Driver (D-2004)',
      rideId: 'RIDE-572',
      status: 'Pending',
      date: '2024-01-12',
      priority: 'High',
    },
    {
      id: '#C1238',
      type: 'Route Issue',
      from: 'Rider (R-1015)',
      against: 'Driver (D-2003)',
      rideId: 'RIDE-575',
      status: 'In Review',
      date: '2024-01-11',
      priority: 'Medium',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sorting, setSorting] = useState([]);

  // Define table columns
  const columns = [
    {
      accessorKey: 'id',
      header: 'Complaint ID',
      cell: ({ row }) => (
        <span className="font-mono font-medium text-primary">{row.getValue('id')}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type');
        let variant = "secondary";
        
        if (type.includes('Misbehavior')) variant = 'destructive';
        if (type.includes('Fare Dispute')) variant = 'default';
        if (type.includes('Lost Item')) variant = 'outline';
        if (type.includes('Vehicle')) variant = 'secondary';
        if (type.includes('Route')) variant = 'warning';

        return <Badge variant={variant}>{type}</Badge>;
      },
    },
    {
      accessorKey: 'from',
      header: 'From (Complainant)',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('from')}</div>
          <div className="text-xs text-foreground">{row.original.date}</div>
        </div>
      ),
    },
    {
      accessorKey: 'against',
      header: 'Against (User)',
    },
    {
      accessorKey: 'rideId',
      header: 'Ride ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm bg-accent/20 px-2 py-1 rounded">{row.getValue('rideId')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-0 hover:bg-transparent"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue('status');
        let variant = "secondary";
        
        if (status === 'Pending') variant = 'destructive';
        if (status === 'In Review') variant = 'warning';
        if (status === 'Resolved') variant = 'default';

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.getValue('priority');
        let color = "text-foreground";
        
        if (priority === 'High') color = 'text-destructive';
        if (priority === 'Medium') color = 'text-yellow-600';
        if (priority === 'Low') color = 'text-green-600';

        return <span className={`font-medium ${color}`}>{priority}</span>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const complaint = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(complaint)}>
                📋 View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(complaint)}>
                ✏️ Edit Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleContact(complaint)}>
                📞 Contact Parties
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResolve(complaint)}>
                ✅ Mark Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filter data based on search and filters
  const filteredData = data.filter((complaint) => {
    const matchesSearch = 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.against.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.rideId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleViewDetails = (complaint) => {
    alert(`Viewing details for: ${complaint.id}\nType: ${complaint.type}\nStatus: ${complaint.status}\nPriority: ${complaint.priority}`);
  };

  const handleEdit = (complaint) => {
    const newStatus = prompt(`Edit status for ${complaint.id}:`, complaint.status);
    if (newStatus && ['Pending', 'In Review', 'Resolved'].includes(newStatus)) {
      setData(data.map(item => 
        item.id === complaint.id ? { ...item, status: newStatus } : item
      ));
      alert(`Status updated to: ${newStatus}`);
    }
  };

  const handleContact = (complaint) => {
    alert(`Contacting parties for: ${complaint.id}\nComplainant: ${complaint.from}\nAccused: ${complaint.against}`);
  };

  const handleResolve = (complaint) => {
    if (confirm(`Mark complaint ${complaint.id} as resolved?`)) {
      setData(data.map(item => 
        item.id === complaint.id ? { ...item, status: 'Resolved' } : item
      ));
      alert('Complaint marked as resolved!');
    }
  };

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
    alert('New complaint added!');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Complaint Management</h1>
          <p className="text-foreground/50 mt-1">Manage and resolve customer complaints efficiently</p>
        </div>
        <Button variant="primary" onClick={handleAddComplaint} >
          + Add New Complaint
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-background rounded-lg border border-accent p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full lg:w-48">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full lg:w-48">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Driver Misbehavior">Driver Misbehavior</SelectItem>
                <SelectItem value="Fare Dispute">Fare Dispute</SelectItem>
                <SelectItem value="Lost Item">Lost Item</SelectItem>
                <SelectItem value="Vehicle Condition">Vehicle Condition</SelectItem>
                <SelectItem value="Route Issue">Route Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-foreground">{data.length}</div>
          <div className="text-sm text-foreground/50 ">Total Complaints</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-destructive">
            {data.filter(item => item.status === 'Pending').length}
          </div>
          <div className="text-sm text-foreground/50">Pending</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-primary">
            {data.filter(item => item.status === 'In Review').length}
          </div>
          <div className="text-sm text-foreground/50">In Review</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-green-600">
            {data.filter(item => item.status === 'Resolved').length}
          </div>
          <div className="text-sm text-foreground/50">Resolved</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background rounded-lg border border-accent shadow-sm">
        <div className="p-4 border border-accent">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Complaints</h2>
            <div className="text-sm text-forground/50">
              Showing {filteredData.length} of {data.length} complaints
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-accent/20"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="text-forground/50">No complaints found.</div>
                    <div className="text-sm text-forground/50 mt-1">
                      Try adjusting your search or filters
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}