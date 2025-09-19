import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import bikeImg from '../../Assets/bike.png';
import carImg from '../../Assets/car.png';
import cngImg from '../../Assets/cng.png';
import { ArrowRight } from 'lucide-react';

const PopularRides = () => {
    return (
        <section className="py-16 bg-[#6CC832]/10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-[#6CC832]/20  text-primary rounded-full text-sm font-medium">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link href="/rides/bike" className="group">
                        <div className="card-elevated p-6 space-y-4 hover-lift shadow-md bg-[#6CC832]/5 rounded-2xl flex flex-col items-center transition-all duration-200 group-hover:bg-[#6CC832]/10 cursor-pointer border border-[#6CC832]/10">
                            <h3 className="font-semibold text-xl text-primary mb-2 flex items-center w-full justify-between">
                                Ride by bike
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </h3>
                            <Image
                                src={bikeImg}
                                alt="Ride by bike"
                                className="w-80 h-60 object-contain mx-auto"
                                priority
                            />
                        </div>
                    </Link>
                    <Link href="/rides/cng" className="group">
                        <div className="card-elevated p-6 space-y-4 hover-lift shadow-md bg-[#6CC832]/5 rounded-2xl flex flex-col items-center transition-all duration-200 group-hover:bg-[#6CC832]/10  cursor-pointer border border-[#6CC832]/10">
                            <h3 className="font-semibold text-xl text-primary mb-2 flex items-center w-full justify-between">
                                Ride by Cng
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </h3>
                            <Image
                                src={cngImg}
                                alt="Ride by Cng"
                                className="w-80 h-60 object-contain mx-auto"
                                priority
                            />
                        </div>
                    </Link>
                    <Link href="/rides/car" className="group">
                        <div className="card-elevated p-6 space-y-4 hover-lift shadow-md bg-[#6CC832]/5 rounded-2xl flex flex-col items-center transition-all duration-200 group-hover:bg-[#6CC832]/10  cursor-pointer border border-[#6CC832]/10">
                            <h3 className="font-semibold text-xl text-primary mb-2 flex items-center w-full justify-between">
                                Ride by Car
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </h3>
                            <Image
                                src={carImg}
                                alt="Ride by Car"
                                className="w-80 h-60 object-contain mx-auto"
                                priority
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularRides;