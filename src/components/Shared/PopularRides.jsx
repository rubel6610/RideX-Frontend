import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bikeImg from '../../Assets/bike.png';
import carImg from '../../Assets/car.png';
import cngImg from '../../Assets/cng.png';
import { ArrowRight } from 'lucide-react';

const PopularRides = () => {
    return (
        <section className="py-16 bg-primary/10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-accent-foreground/10 dark:bg-accent  text-primary rounded-full text-sm font-medium">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Popular Rides
                    </div>
                    <h2 className="text-3xl md:text-display font-bold">
                        Explore by <span className="text-gradient-accent">Popular Ride</span>
                    </h2>
                    <p className="text-lg text-accent-foreground max-w-2xl mx-auto">
                        Choose your preferred ride type and enjoy a seamless journey with RideX.
                    </p>
                </div>

                {/* Rides Grid */}
                
            </div>
        </section>
    );
};

export default PopularRides;