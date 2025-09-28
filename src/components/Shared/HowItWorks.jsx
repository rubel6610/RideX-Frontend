import React from "react";
import { MapPin, Car, CheckCircle } from "lucide-react";
import SectionHeader from "../../components/ui/sectionHeader";

const HowItWorks = () => {
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
  <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <SectionHeader
        icon={Car}
        title="Simple Process"
        subtitle="How "
        highlight="RideX Works"
        description="Getting around has never been easier. Follow these simple steps and you'll be on your way in minutes."
      />

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center p-8 rounded-2xl shadow-lg bg-white/60 dark:bg-accent/60 backdrop-blur-md border border-primary/20">
            {/* Icon + Number */}
            <div className="relative mb-4">
              <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center border-2 border-primary">
                {step.icon}
              </div>
              <span className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
                {step.id}
              </span>
            </div>
            {/* Text */}
            <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
            <p className="text-muted-foreground text-base max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>

      
    </section>
  );
};

export default HowItWorks;
