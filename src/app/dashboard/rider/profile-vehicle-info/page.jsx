"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/AuthProvider";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function RiderVehicleInfo() {
  const { user } = useAuth();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const defaultImages = {
    bike: "https://i.ibb.co.com/spRKtMx7/bike.jpg",
    cng: "https://i.ibb.co.com/W4XSxDSg/cng.jpg",
    car: "https://i.ibb.co.com/m5H1Rx67/car.jpg",
  };

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
            image: matchedRider.frontFace || "",
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
          <img
            className="w-30 h-30 rounded-[50%]"
            src={
              defaultImages[rider.vehicleType?.toLowerCase()] ||
              defaultImages.car
            }
            alt="Rider"
          />
          <CardTitle className="text-xl font-semibold mt-3">
            Vehicle Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-gray-700">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              {/*  <Input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                placeholder="Upload Image"
              /> */}
              <Input
              className='text-black dark:text-white'
                type="text"
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                placeholder="Vehicle Type"
              />
              <Input
                  className='text-black dark:text-white'
                type="text"
                value={formData.vehicleModel}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleModel: e.target.value })
                }
                placeholder="Vehicle Model"
              />
              <Input
                   className='text-black dark:text-white'
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
              <Button type="submit" className="w-full mt-2">
                Save Changes
              </Button>
            </form>
          ) : (
            <>
              <div className="flex justify-between text-black dark:text-white">
                <span className="font-medium">Vehicle Type:</span>
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
              <div className="flex justify-between items-center mt-4 space-x-2">
                {/* View Full Info Button (Left) */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="primary" className="w-1/2">
                      View Full Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md border-2 border-primary">
                    <DialogHeader>
                      <DialogTitle>Rider Full Information</DialogTitle>
                      <DialogClose asChild>
                        <button className="absolute top-3 right-3">
                          <X size={24} />
                        </button>
                      </DialogClose>
                    </DialogHeader>

                    {rider.frontFace && (
                      <div className="flex flex-col items-center mb-3">
                        <img
                          src={rider.frontFace}
                          alt="Rider Front Face"
                          className="w-32 h-32 rounded-xl object-cover shadow-md"
                        />
                        <p className="mt-2 text-lg font-semibold text-center text-black dark:text-white">
                          verification Face
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 text-gray-700 dark:text-white">
                      <div className="font-bold text-xl">
                        <strong>Full Name: </strong>  
                        <span className="font-bold text-2xl"> {rider.fullName}</span>
                      </div>
                      <div>
                        <strong>Date of Birth:</strong>
                        {rider.dateOfBirth}
                      </div>
                      <div>
                        <strong>Email:</strong> {rider.email}
                      </div>
                      <div>
                        <strong>Emergency Contact:</strong>{" "}
                        {rider.emergency_contact}
                      </div>
                      <div>
                        <strong>Address:</strong>{" "}
                        {`${rider.present_address.village}, ${rider.present_address.post}, ${rider.present_address.upazila}, ${rider.present_address.district}`}
                      </div>
                      <div>
                        <strong>Vehicle Type:</strong> {rider.vehicleType}
                      </div>
                      <div>
                        <strong>Model:</strong> {rider.vehicleModel}
                      </div>
                      <div>
                        <strong>Register No:</strong>{" "}
                        {rider.vehicleRegisterNumber}
                      </div>
                      <div>
                        <strong>Driving License:</strong> {rider.drivingLicense}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit Info Button (Right) */}
                <Button onClick={() => setEditing(true)} className="w-1/2">
                  Edit Info
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}