"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Plus, Search } from "lucide-react";
import axios from "axios";
import { TableSkeleton } from "@/components/Shared/Skeleton/TableSkeleton";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`;

const PromotionsDiscounts = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    code: "",
    status: "Active",
    startDate: "",
    endDate: "",
  });

  // 🟡 Fetch all promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/promotions`);
      setPromotions(res.data);
    } catch (error) {
      console.error("❌ Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // 🟢 Add Promotion
  const handleAddPromotion = async (data) => {
    try {
      await axios.post(`${API_URL}/promotions`, data);
      await fetchPromotions();
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Error adding promotion:", error);
    }
  };

  // 🟠 Edit Promotion
  const handleEditPromotion = async (data) => {
    try {
      await axios.put(`${API_URL}/promotions/${editingPromo._id}`, data);
      await fetchPromotions();
      setIsModalOpen(false);
      setEditingPromo(null);
    } catch (error) {
      console.error("❌ Error editing promotion:", error);
    }
  };

  // 🔴 Delete Promotion
  const handleDeletePromotion = async (id) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await axios.delete(`${API_URL}/promotions/${id}`);
      await fetchPromotions();
    } catch (error) {
      console.error("❌ Error deleting promotion:", error);
    }
  };

  // 💾 Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    if (editingPromo) {
      handleEditPromotion(formData);
    } else {
      handleAddPromotion(formData);
    }
  };

  // 🔍 Filter promotions
  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 🔢 Generate random promo code
  const generatePromoCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  // ♻️ Reset form when editing/closing modal
  useEffect(() => {
    if (editingPromo) {
      setFormData({
        title: editingPromo.title,
        discount: editingPromo.discount,
        code: editingPromo.code,
        status: editingPromo.status,
        startDate: editingPromo.startDate,
        endDate: editingPromo.endDate,
      });
    } else {
      setFormData({
        title: "",
        discount: "",
        code: "",
        status: "Active",
        startDate: "",
        endDate: "",
      });
    }
  }, [editingPromo, isModalOpen]);

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Promotions & Discounts
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage promotional offers
          </p>
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

      {/* Filters */}
      <div className="bg-background rounded-lg border border-accent p-4 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-48">
            <label className="text-sm font-medium mb-1 block">Status</label>
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
              setSearchTerm("");
              setStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background rounded-lg border border-accent shadow-sm dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromotions.map((promotion) => (
              <TableRow key={promotion._id}>
                <TableCell>{promotion.title}</TableCell>
                <TableCell>
                  <code
                    className="px-2 py-1 rounded font-mono 
                               bg-gray-100 text-gray-800 
                               dark:bg-gray-800 dark:text-gray-100"
                  >
                    {promotion.code}
                  </code>
                </TableCell>
                <TableCell>{promotion.discount}%</TableCell>
                <TableCell>
                  {promotion.startDate} - {promotion.endDate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      promotion.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      promotion.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }
                  >
                    {promotion.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                      onClick={() => handleDeletePromotion(promotion._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/40"
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No promotions found.
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promotion" : "Create Promotion"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Promotion Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Discount (%)</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
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
              <Button type="submit">
                {editingPromo ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsDiscounts;
