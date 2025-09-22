
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import  heroImage  from '@/Assets/hero-ridex.jpg';
import { Input } from '../ui/input';
const Banner = () => {
  return (
    <section className="pt-10 pb-16 ">
      <div className="max-w-12/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gray-200 dark:text-black rounded-full text-sm font-medium">
                <Star className="h-4 w-4 mr-2" />
                #1 Rated Ride-Sharing Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Ride, Your Way<br className='hidden md:block'/>  with  {" "}
                <span className="text-primary">RideX</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience seamless transportation with trusted drivers, affordable prices, 
                and rides that arrive when you need them most.
              </p>
            </div>

            {/* Quick Booking Form */}
            <div className=" p-6 space-y-4">
              <h3 className="text-lg font-semibold">Book Your Ride Now</h3>
              <div className="space-y-3">
                <Input 
                  placeholder="Pickup location" 
                  className="bg-background border-border shadow-xs w-full"
                />
                <Input 
                  placeholder="Where to?" 
                  className="border-border shadow-xs w-full"
                />
                <Button variant="primary" size="lg">
                  Find Ride
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              <Image src={heroImage} alt='hero image' className='rounded-2xl scale-100 hover:scale-105 transition-transform ease-out delay-100'/>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-lg animate-bounce-in bg-[#90fc47]/50 dark:bg-[#1A3A05]/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg ">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">2 min</p>
                    <p className="text-sm text-muted-foreground">Avg pickup time</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-lg animate-bounce-in delay-300 bg-[#90fc47]/50 dark:bg-[#1A3A05]/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">50K+</p>
                    <p className="text-sm text-muted-foreground">Happy riders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;