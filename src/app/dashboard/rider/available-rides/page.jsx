"use client";

import React, { useState } from "react";
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const PassengerDummyData = [
  {
    "_id": 1,
    "passengerName": "John Doe",
    "from": "Banani, Dhaka",
    "to": "Gulshan, Dhaka",
    "distance": "8 km",
    "fare": "$5"
  },
  {
    "_id": 2,
    "passengerName": "Sara Khan",
    "from": "Dhanmondi, Dhaka",
    "to": "Motijheel, Dhaka",
    "distance": "12 km",
    "fare": "$8"
  },
  {
    "_id": 3,
    "passengerName": "Alex Smith",
    "from": "Uttara, Dhaka",
    "to": "Mirpur, Dhaka",
    "distance": "10 km",
    "fare": "$6"
  },
  {
    "_id": 4,
    "passengerName": "Nadia Rahman",
    "from": "Tejgaon, Dhaka",
    "to": "Jatrabari, Dhaka",
    "distance": "15 km",
    "fare": "$10"
  }
]

export default function AvailableRidesPage() {

  const [rides, setRides] = useState(PassengerDummyData || []);

  // Placeholder functions for buttons
  const handleConfirm = (rideId) => {
    console.log(`Confirm clicked for ride ${rideId}`);
    // এখানে তুমি API call বা state update করতে পারবে
  };

  const handleCancel = (rideId) => {
    console.log(`Cancel clicked for ride ${rideId}`);
    // এখানে তুমি API call বা state update করতে পারবে
  };

  return (
    <div className="space-y-4">
      {/* Heading + Spinner */}
      <h1 className="flex gap-2 text-3xl md:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100 uppercase">
        Available Rides
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {rides.map((ride) => (
          <div
            key={ride._id}
            className="shadow-md rounded-2xl hover:border-primary border border-border bg-accent/50"
          >
            {/* passenger info  */}
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> {ride.passengerName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>
                <strong>From:</strong> {ride.from}
              </p>
              <p>
                <strong>To:</strong> {ride.to}
              </p>
              <p>
                <strong>Distance:</strong> {ride.distance}
              </p>
              <p>
                <strong>Fare:</strong> {ride.fare}
              </p>
            </CardContent>

            {/* action button  */}
            <CardFooter className="flex gap-2">
              <Button
                variant="default"
                className="flex-1 cursor-pointer"
                onClick={() => handleConfirm(ride._id)}
              >
                Confirm
              </Button>
              <Button
                variant="destructive"
                className="flex-1 cursor-pointer"
                onClick={() => handleCancel(ride._id)}
              >
                Cancel
              </Button>
            </CardFooter>
          </div>
        ))}
      </div>

    </div>
  )
}

