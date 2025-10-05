"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample static data
const initialLocations = [
  {
    _id: "loc1",
    label: "Home",
    address: "House #12, Road #5, Dhanmondi, Dhaka",
    coordinates: [90.373, 23.75],
    type: "Home",
  },
  {
    _id: "loc2",
    label: "Office",
    address: "Banani 11, Dhaka",
    coordinates: [90.41, 23.79],
    type: "Work",
  },
  {
    _id: "loc3",
    label: "Favorite Café",
    address: "Gulshan 2 Circle, Dhaka",
    coordinates: [90.42, 23.8],
    type: "Favorite",
  },
];

export default function SavedLocationsPage() {
  const [locations] = useState(initialLocations);
  const [search, setSearch] = useState("");

  // Filter locations by search
  const filtered = locations.filter(
    (loc) =>
      loc.label.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Saved Locations</h2>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add New
          </Button>
        </div>
      </div>

      {/* Show Count */}
      <div className="text-sm text-gray-600">
        Showing {filtered.length} of {locations.length}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No saved locations found.</p>
          <p className="text-sm text-gray-400">Try adding a new one!</p>
        </div>
      ) : (
        /* Locations Grid */
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((loc) => (
            <Card
              key={loc._id}
              className="shadow-sm hover:shadow-md transition border border-gray-200"
            >
              <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex items-center gap-2">
                  <MapPin className="text-blue-600 h-5 w-5" />
                  <CardTitle className="text-lg">{loc.label}</CardTitle>
                  <Badge variant="secondary">{loc.type}</Badge>
                </div>
                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => console.log("Edit", loc)}>
                      ✏️ Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => console.log("Delete", loc)}
                    >
                      🗑 Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-700">{loc.address}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {loc.coordinates[1]} | Lng: {loc.coordinates[0]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
