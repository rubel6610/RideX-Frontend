import React from "react";
import { MapPin, Car, CheckCircle } from "lucide-react";

const Belal = () => {
  const steps = [
    {
      id: "01",
      title: "Set Your Destination",
      desc: "Enter your pickup and drop-off locations in our easy-to-use app. We'll show you the best route and fare estimate.",
      icon: <MapPin className="w-10 h-10 " />,
    },
    {
      id: "02",
      title: "Match with a Driver",
      desc: "Our smart algorithm instantly connects you with the nearest verified driver. Track their arrival in real-time.",
      icon: <Car className="w-10 h-10 " />,
    },
    {
      id: "03",
      title: "Enjoy Your Ride",
      desc: "Hop in and relax! Pay seamlessly through the app and rate your experience. It’s that simple.",
      icon: <CheckCircle className="w-10 h-10 " />,
    },
  ];

  return (
    <section className="section-feature px-6 py-12 text-center">
      {/* Top Tag */}
      <div className="inline-flex w-40 items-center justify-center gap-2 bg-[#90fc47]/14 text-sm font-semibold px-3 py-1 rounded mb-4">
        <Car />
        <span>Simple Process</span>
      </div>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-3">How RideX Works</h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
        Getting around has never been easier. Follow these simple steps and
        you'll be on your way in minutes.
      </p>

      {/* Steps */}
      <div className="grid grid-cols-1  md:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col p-6 border border-[#90fc47]/20 items-center">
            {/* Icon + Number */}
            <div className="relative mb-4">
              <div className="bg-[#90fc47] rounded-full w-20 h-20 flex items-center justify-center">
                {step.icon }
              </div>
              <span className="absolute -top-3 -right-3 bg-[#90fc47] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                {step.id}
              </span>
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="dark:text-gray-300 text-sm max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>

      
    </section>
  );
};

export default Belal;
