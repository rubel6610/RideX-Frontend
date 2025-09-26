'use client';
import Link from 'next/link';
import {
  ChevronDown,
  Bike,
  Car,
  BusFront,
} from 'lucide-react';

const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  rideByOpen,
  toggleRideBy,
  showNavbar,
}) => {
  return (
    <div
      className={`fixed top-[76px] right-0 h-full w-full bg-background shadow-lg z-[997] transform transition-all duration-300 
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        ${showNavbar ? 'translate-y-0' : `-translate-y-[calc(100vh+76px)]`}
      `}
    >
      <div className="flex flex-col font-medium bg-background">
        <Link
          href="/"
          className="px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          onClick={toggleSidebar}
        >
          Home
        </Link>

        {/* Ride By (Collapsible) */}
        <div>
          <button
            onClick={toggleRideBy}
            className="flex justify-between items-center w-full px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          >
            <span>Ride By</span>
            <ChevronDown
              className={`transition-transform duration-300 ${
                rideByOpen ? ' ' : 'rotate-180'
              }`}
            />
          </button>
          {rideByOpen && (
            <div className="flex flex-col divide-y divide-border">
              <Link
                href="/ride-bike"
                className="flex items-center gap-2 px-12 py-3 font-semibold hover:text-primary border-b border-accent"
                onClick={toggleSidebar}
              >
                <Bike className="text-primary text-xl border p-0.5 rounded" />
                Bike
              </Link>
              <Link
                href="/ride-cng"
                className="flex items-center gap-2 px-12 py-3 font-semibold hover:text-primary border-b border-accent"
                onClick={toggleSidebar}
              >
                <BusFront className="text-primary text-xl border p-0.5 rounded" />
                <span>CNG</span>
              </Link>
              <Link
                href="/ride-car"
                className="flex items-center gap-2 px-12 py-3 font-semibold hover:text-primary border-b border-accent"
                onClick={toggleSidebar}
              >
                <Car className="text-primary text-xl border p-0.5 rounded" />
                <span>Car</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/offers"
          className="px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          onClick={toggleSidebar}
        >
          Offers
        </Link>
        <Link
          href="/contact"
          className="px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          onClick={toggleSidebar}
        >
          Contact
        </Link>
        <Link
          href="/about"
          className="px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          onClick={toggleSidebar}
        >
          About
        </Link>
        <Link
          href="/become-rider"
          className="px-8 py-4 font-semibold hover:text-primary border-b border-accent"
          onClick={toggleSidebar}
        >
          Become a Rider
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
