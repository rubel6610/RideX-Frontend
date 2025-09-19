import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import PassengerCar from "@/Assets/passengerServices.jpg";

const PassengerSay = () => {
  const reting = [
    {
      name: "Jessica Miller",
      role: "Business Executive",
      location: "New York, NY",
      rating: 5,
      text: `"RideX has transformed my daily commute. The drivers are professional, the app is intuitive, and I never worry about being late to meetings. Highly recommended!"`,
    },
    {
      name: "Carlos Rodriguez",
      role: "College Student",
      location: "Austin, TX",
      rating: 5,
      text: `"As a student, I need affordable and reliable transportation. RideX delivers on both. The pricing is transparent and the service is consistently excellent."`,
    },
    {
      name: "Emily Chen",
      role: "Healthcare Worker",
      location: "San Francisco, CA",
      rating: 5,
      text: `"Working night shifts, I depend on RideX for safe rides home. The 24/7 availability and vetted drivers give me peace of mind. Thank you, RideX!"`,
    },
  ];

  return (
    <section className="section-feature py-16 px-6 md:px-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#90fc47]/16 dark:bg-gray-800">
          <Star className="text-[#90fc47]" />
          <span className="text-sm text-primary dark:text-primary font-semibold">
            Customer Stories
          </span>
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mt-2">
          What Our{" "}
          <span className="bg-gradient-to-r from-[#a8ff70] via-[#90fc47] to-[#6dbd2f] bg-clip-text text-transparent">
            Riders Say
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Don't just take our word for it. Here's what real RideX riders have to
          say about their experiences.
        </p>
      </div>

      {/* Featured Testimonial */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
        <Image
          src={PassengerCar}
          alt="Riders"
          className="rounded-2xl w-full object-cover shadow-lg"
        />
        <div className=" p-6 rounded-2xl shadow">
          <p className="text-gray-600 dark:text-gray-300 italic">
            "I've been using RideX for over a year now, and it's consistently
            exceeded my expectations. From airport runs to grocery trips, the
            service is reliable, the drivers are friendly, and the app makes
            everything so easy. It's become an essential part of my daily life."
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Sarah Thompson
              </h3>
              <h1 className="flex mt-2 text-[#90fc47]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </h1>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300">Marketing Director</p>
          </div>
        </div>
      </div>

      {/* Other Testimonials */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {reting.map((t, i) => (
          <div key={i} className=" p-6 rounded-2xl shadow">
            <div className="flex items-center mb-2">
              <div className="flex text-[#90fc47] mr-2">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t.text}</p>
            <hr className="my-3 border-t border-gray-300" />

            <h4 className="text-black dark:text-white font-bold mt-3">{t.name}</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t.role}, {t.location}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 bg-[#90fc47]/10 dark:bg-[#90fc47]/1 p-4 gap-6 text-center">
        <div className="text-center">
          <h3 className="flex items-center justify-center gap-2 text-2xl font-bold text-black dark:text-white">
            <Star className="text-[#90fc47]" />
            4.9
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Average Rating <br /> From 50,000+ reviews
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#90fc47]">98%</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Customer Satisfaction <br /> Would recommend RideX
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#90fc47]">24/7</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Customer Support <br /> Always here to help
          </p>
        </div>
      </div>
    </section>
  );
};

export default PassengerSay;
