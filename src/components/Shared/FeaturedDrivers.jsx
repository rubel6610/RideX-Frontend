import { Star, Award, Clock, Car } from 'lucide-react';
import SectionHeader from '../../components/ui/sectionHeader';
import driverImage from "../../Assets/driver-featured.jpg"
import Image from 'next/image';
import { Button } from '../ui/button';

const FeaturedDrivers = () => {
  const drivers = [
    {
      name: "Michael Johnson",
      rating: 4.9,
      rides: 2847,
      experience: "5 years",
      car: "Tesla Model 3",
      specialties: ["Airport rides", "Business trips"]
    },
    {
      name: "Sarah Chen",
      rating: 4.8,
      rides: 1956,
      experience: "3 years",
      car: "Honda Accord",
      specialties: ["City tours", "Long distance"]
    },
    {
      name: "David Rodriguez",
      rating: 5.0,
      rides: 3245,
      experience: "7 years",
      car: "BMW 5 Series",
      specialties: ["Executive rides", "Events"]
    }
  ];

  return (
    <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          icon={Award}
          title="Top Rated Riders"
          subtitle="Meet Our "
          highlight="Featured Drivers"
          description="Experience excellence with our carefully selected, highly-rated drivers who go above and beyond for every ride."
        />
        {/* Drivers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drivers.map((driver, index) => (
            <div key={index} className="card p-6 space-y-4 shadow-md bg-accent/15 rounded-2xl border border-accent transition-all hover:-translate-y-1 duration-300 hover:border-primary hover:bg-accent/50">
              <div className="flex items-start space-x-4">
                <Image
                  src={driverImage}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{driver.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-medium">{driver.rating}</span>
                    <span className="text-muted-foreground">({driver.rides} rides)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.experience} experience</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{driver.car}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {driver.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-accent/50 text-primary text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="primary" className="w-full">
                Request {driver.name.split(' ')[0]}
              </Button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 ">
          <Button variant="primary" size="lg">
            <Award className="h-4 w-10 " />
            Become a Featured Driver
          </Button>
        </div>
    </section>
  );
};

export default FeaturedDrivers;