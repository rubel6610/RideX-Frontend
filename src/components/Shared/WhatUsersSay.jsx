
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import PassengerCar from "@/Assets/rider-image.jpg";
import SectionHeader from "../ui/sectionHeader";

const reting = [
  {
    rating: 5,
    text: "RideX is my go-to for city rides. The app is intuitive and the drivers are always on time.",
    name: "John Doe",
    role: "Software Engineer",
    location: "Dhaka"
  },
  {
    rating: 4,
    text: "Affordable and reliable. I recommend RideX to all my friends.",
    name: "Jane Smith",
    role: "Teacher",
    location: "Chittagong"
  },
  {
    rating: 5,
    text: "Great service and friendly drivers. Booking a ride is super easy!",
    name: "Ali Khan",
    role: "Student",
    location: "Sylhet"
  }
];

function WhatUsersSay() {
  return (
    <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        icon={Star}
        title="Customer Stories"
        subtitle="What Our "
        highlight="Riders Say"
        description="Don't just take our word for it. Here's what real RideX riders have to say about their experiences."
      />
      <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
        <Image
          src={PassengerCar}
          alt="Riders"
          className="rounded-2xl w-full object-cover shadow-lg"
        />
        <div className="p-6 rounded-2xl shadow bg-background">
          <p className="text-muted-foreground italic">
            "I've been using RideX for over a year now, and it's consistently
            exceeded my expectations. From airport runs to grocery trips, the
            service is reliable, the drivers are friendly, and the app makes
            everything so easy. It's become an essential part of my daily life."
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Sarah Thompson
              </h3>
              <h1 className="flex mt-2 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Marketing Director</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {reting.map((t, i) => (
          <div
            key={i}
            className="relative flex flex-col items-center p-8 rounded-3xl border border-border shadow-lg bg-background/70 backdrop-blur-lg transition hover:scale-[1.03] hover:shadow-xl"
          >
            {/* Avatar */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-accent flex items-center justify-center border-2 border-primary shadow-md">
              <span className="text-2xl font-bold text-primary">{t.name[0]}</span>
            </div>
            {/* Stars */}
            <div className="flex items-center justify-center mt-8 mb-2">
              <div className="flex text-primary gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={18} />
                ))}
              </div>
            </div>
            {/* Quote */}
            <div className="flex flex-col items-center gap-2">
              <Quote size={32} className="text-accent mb-2" />
              <p className="text-base text-foreground text-center italic leading-relaxed">{t.text}</p>
            </div>
            <div className="w-full border-t border-border my-4" />
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-bold text-foreground mt-1">{t.name}</h4>
              <p className="text-sm text-muted-foreground">{t.role}, {t.location}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 bg-accent/60 rounded-2xl p-4 gap-6 text-center">
        <div className="text-center">
          <h3 className="flex items-center justify-center gap-2 text-3xl font-extrabold text-primary">
            <Star className="text-primary" size={28} />
            4.9
          </h3>
          <p className="text-base text-forground font-medium mt-2">
            Average Rating <br />
            <span className="text-xs">From 50,000+ reviews</span>
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-extrabold text-primary">98%</h3>
          <p className="text-base text-muted-foreground font-medium mt-2">
            Customer Satisfaction <br />
            <span className="text-xs">Would recommend RideX</span>
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-extrabold text-primary">24/7</h3>
          <p className="text-base text-muted-foreground font-medium mt-2">
            Customer Support <br />
            <span className="text-xs">Always here to help</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhatUsersSay;
