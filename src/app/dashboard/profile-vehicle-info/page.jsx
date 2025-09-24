"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";


const dummyRiders = [
  {
    _id: "66f2c60056b78c1234abcd66",
    fullName: "Rahima Banu",
    dateOfBirth: "2006-03-14",
    email: "rahima06@email.com",
    contact: "+8801711111111",
    present_address: {
      village: "Uttara",
      post: "Dhaka",
      upazila: "Airport",
      district: "Dhaka",
    },
    vehicleType: "Car",
    vehicleModel: "Toyota Axio",
    vehicleRegisterNumber: "DHAKA-CA-445566",
    drivingLicense: "DL-987654321",
    status: "pending",
  },
  {
    _id: "66f2c61256b78c1234abcd77",
    fullName: "Tanvir Hasan",
    dateOfBirth: "2004-09-21",
    email: "tanvir04@email.com",
    contact: "+8801712345680",
    present_address: {
      village: "Dhanmondi",
      post: "Dhaka",
      upazila: "New Market",
      district: "Dhaka",
    },
    vehicleType: "Bike",
    vehicleModel: "Honda CB Hornet",
    vehicleRegisterNumber: "DHAKA-BA-112233",
    drivingLicense: "DL-123456789",
    status: "pending",
  },
];

export default function ProfileVehicleInfoPage() {
  const [riders] = useState(dummyRiders);

  // Set currentUserId for testing UI
  const currentUserId = "66f2c60056b78c1234abcd66";

  // Find the current rider by _id
  const currentRider = riders.find((rider) => rider._id === currentUserId);

  if (!currentRider) {
    return <p className="text-center mt-10 text-red-500">No profile data found.</p>;
  }
  
  return (
    <Card className="max-w-2xl mx-auto shadow-lg rounded-2xl mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {currentRider.fullName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{currentRider.email}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rider Info */}
        <div>
          <p>
            <span className="font-medium">Contact:</span> {currentRider.contact}
          </p>
          <p>
            <span className="font-medium">DOB:</span> {currentRider.dateOfBirth}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {`${currentRider.present_address.village}, ${currentRider.present_address.upazila}, ${currentRider.present_address.district}`}
          </p>
        </div>

        {/* Vehicle Info */}
        <div className="border-t pt-3">
          <p>
            <span className="font-medium">Vehicle Type:</span>{" "}
            {currentRider.vehicleType}
          </p>
          <p>
            <span className="font-medium">Model:</span> {currentRider.vehicleModel}
          </p>
          <p>
            <span className="font-medium">Registration No:</span>{" "}
            {currentRider.vehicleRegisterNumber}
          </p>
          <p>
            <span className="font-medium">Driving License:</span>{" "}
            {currentRider.drivingLicense}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 text-xs rounded-md ${currentRider.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
                }`}
            >
              {currentRider.status}
            </span>
          </p>
        </div>

        {/* Future Document Upload */}
        <div className="border-t pt-3 space-y-3">
          <p className="font-medium">Documents:</p>
          {["License", "NID", "Vehicle Registration", "Insurance"].map(
            (doc) => (
              <div
                key={doc}
                className="flex items-center justify-between gap-3"
              >
                <Input type="file" className="hidden" id={doc} />
                <label
                  htmlFor={doc}
                  className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline"
                >
                  Upload {doc}
                </label>
              </div>
            )
          )}
        </div>

        <Button className="w-full mt-2">Update Profile</Button>
      </CardContent>
    </Card>
  )
}
