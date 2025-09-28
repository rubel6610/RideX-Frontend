// src/app/dashboard/admin/promotions-discounts/page.jsx
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Plus, Search } from "lucide-react";

const PromotionsDiscounts = () => {
  const [promotions, setPromotions] = useState([
    { 
      id: 1, 
      title: "Summer Offer", 
      discount: 20, 
      status: "Active",
      code: "SUMMER20",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      usage: 245
    },
    { 
      id: 2, 
      title: "New Year Discount", 
      discount: 15, 
      status: "Inactive",
      code: "NEWYEAR15",
      startDate: "2023-12-20",
      endDate: "2024-01-10",
      usage: 189
    },
    { 
      id: 3, 
      title: "Welcome Bonus", 
      discount: 10, 
      status: "Active",
      code: "WELCOME10",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usage: 567
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    code: '',
    status: 'Active',
    startDate: '',
    endDate: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (editingPromo) {
      setFormData({
        title: editingPromo.title,
        discount: editingPromo.discount,
        code: editingPromo.code,
        status: editingPromo.status,
        startDate: editingPromo.startDate,
        endDate: editingPromo.endDate
      });
    } else {
      setFormData({
        title: '',
        discount: '',
        code: '',
        status: 'Active',
        startDate: '',
        endDate: ''
      });
    }
  }, [editingPromo, isModalOpen]);

  // Add Promotion
  const handleAddPromotion = (data) => {
    const newPromo = {
      id: Date.now(),
      ...data,
      usage: 0,
      discount: parseInt(data.discount)
    };
    setPromotions((prev) => [...prev, newPromo]);
    setIsModalOpen(false);
  };

  // Edit Promotion
  const handleEditPromotion = (data) => {
    setPromotions((prev) => 
      prev.map(promo => 
        promo.id === editingPromo.id 
          ? { ...promo, ...data, discount: parseInt(data.discount) }
          : promo
      )
    );
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  // Delete Promotion
  const handleDeletePromotion = (id) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions((prev) => prev.filter(promo => promo.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingPromo) {
      handleEditPromotion(formData);
    } else {
      handleAddPromotion(formData);
    }
  };

  // Filter promotions based on search and status
  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = 
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Generate random promotion code
  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({...formData, code});
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Promotions & Discounts</h1>
          <p className="text-foreground/50 mt-1">Manage promotional offers and discount codes</p>
        </div>
        <Button 
          onClick={() => {
            setEditingPromo(null);
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Promotion
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-foreground">{promotions.length}</div>
          <div className="text-sm text-foreground/50">Total Promotions</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-green-600">
            {promotions.filter(item => item.status === 'Active').length}
          </div>
          <div className="text-sm text-foreground/50">Active</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-gray-600">
            {promotions.filter(item => item.status === 'Inactive').length}
          </div>
          <div className="text-sm text-foreground/50">Inactive</div>
        </div>
        <div className="bg-accent/20 hover:bg-accent/30 rounded-lg border border-accent p-4">
          <div className="text-2xl font-bold text-blue-600">
            {promotions.reduce((total, promo) => total + promo.usage, 0)}
          </div>
          <div className="text-sm text-foreground/50">Total Usage</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-background rounded-lg border border-accent p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title or code..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background rounded-lg border border-accent shadow-sm">
        <div className="p-4 border-b border-accent">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Promotions</h2>
            <div className="text-sm text-foreground/50">
              Showing {filteredPromotions.length} of {promotions.length} promotions
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id} className="hover:bg-accent/20">
                  <TableCell>
                    <div>
                      <div className="font-medium">{promotion.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-accent/50 px-2 py-1 rounded text-sm font-mono">
                      {promotion.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">
                      {promotion.discount}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{promotion.startDate}</div>
                      <div className="text-foreground/50">to {promotion.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{promotion.usage} times</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={promotion.status === 'Active' ? 'default' : 'secondary'}
                      className={promotion.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {promotion.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPromo(promotion);
                          setIsModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePromotion(promotion.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-foreground/50">No promotions found.</div>
              <div className="text-sm text-foreground/50 mt-1">
                Try adjusting your search or filters
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Modal */}
      <Dialog open={isModalOpen} onOpenChange={() => {
        setIsModalOpen(false);
        setEditingPromo(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Promotion Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter promotion title"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Discount %</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  placeholder="10"
                  min="1"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Promo Code</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generatePromoCode}
                >
                  Generate
                </Button>
              </div>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="SUMMER20"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPromo(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingPromo ? 'Update' : 'Create'} Promotion
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsDiscounts;