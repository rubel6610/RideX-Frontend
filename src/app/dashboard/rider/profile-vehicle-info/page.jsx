"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/AuthProvider";
import { X } from "lucide-react";

export default function RiderVehicleInfo() {
  const { user } = useAuth();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

 

  useEffect(() => {
    if (!user?.email) return;

    const fetchRiderData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/riders");
        const riders = res.data.riders;

        const matchedRider = riders.find(
          (r) => r.email.toLowerCase() === user.email.toLowerCase()
        );

        if (matchedRider) {
          setRider(matchedRider);
          setFormData({
            vehicleType: matchedRider.vehicleType,
            vehicleModel: matchedRider.vehicleModel,
            vehicleRegisterNumber: matchedRider.vehicleRegisterNumber,
            drivingLicense: matchedRider.drivingLicense,
            image: matchedRider.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching rider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiderData();
  }, [user?.email]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
  `http://localhost:5000/api/update-rider/${rider._id}`,
  {
    vehicleType: formData.vehicleType,
    vehicleModel: formData.vehicleModel,
    vehicleRegisterNumber: formData.vehicleRegisterNumber,
    drivingLicense: formData.drivingLicense,
  }
);


      setRider(res.data.updatedRider);
      setFormData({
        vehicleType: res.data.updatedRider.vehicleType,
        vehicleModel: res.data.updatedRider.vehicleModel,
        vehicleRegisterNumber: res.data.updatedRider.vehicleRegisterNumber,
        drivingLicense: res.data.updatedRider.drivingLicense,
      });

      setEditing(false);
      toast.success("Rider info updated successfully!");
    } catch (error) {
      toast.error("Failed to update rider info");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center">Loading vehicle info...</p>;
  if (!rider)
    return <p className="text-center text-red-500">No rider data found</p>;

  return (
    <div className="flex justify-center mt-8">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-primary relative">
        {/* Cross icon for cancel edit mode */}
        {editing && (
          <button
            type="button"
            className="absolute top-3 right-3"
            onClick={() => setEditing(false)}
          >
            <X size={24} />
          </button>
        )}

        <CardHeader className="flex flex-col items-center">
          <Image
            src={formData.image || defaultImage}
            alt="Rider"
            width={120}
            height={120}
            className="rounded-full border-2 border-gray-300 shadow-sm"
          />
          <CardTitle className="text-xl font-semibold mt-3">
            Vehicle Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-gray-700">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              {/*  <Input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Image URL"
              /> */}
              <Input
            
                type="text"
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                placeholder="Vehicle Type"
              />
              <Input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleModel: e.target.value })
                }
                placeholder="Vehicle Model"
              />
              <Input
                type="text"
                value={formData.vehicleRegisterNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleRegisterNumber: e.target.value,
                  })
                }
                placeholder="Register Number"
              />
              <Input
                type="text"
                value={formData.drivingLicense}
                onChange={(e) =>
                  setFormData({ ...formData, drivingLicense: e.target.value })
                }
                placeholder="Driving License"
              />
              <Button type="submit" className="w-full mt-2">
                Save Changes
              </Button>
            </form>
          ) : (
            <>
              <div className="flex justify-between text-black dark:text-white">
                <span className="font-medium ">Vehicle Type:</span>
                <span>{rider.vehicleType}</span>
              </div>
              <div className="flex justify-between text-black dark:text-white">
                <span className="font-medium">Model:</span>
                <span>{rider.vehicleModel}</span>
              </div>
              <div className="flex justify-between text-black dark:text-white">
                <span className="font-medium">Register No:</span>
                <span>{rider.vehicleRegisterNumber}</span>
              </div>
              <div className="flex justify-between text-black dark:text-white">
                <span className="font-medium">Driving License:</span>
                <span>{rider.drivingLicense}</span>
              </div>

              <div className="flex justify-center mt-4">
                <Button onClick={() => setEditing(true)}>Edit Info</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
