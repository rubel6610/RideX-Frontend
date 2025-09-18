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
      className={`fixed top-20 right-0 h-full w-full bg-sidebar shadow-lg z-[997] transform transition-all duration-300 
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        ${showNavbar ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="flex flex-col divide-y divide-border font-medium">
        <Link
          href="/"
          className="px-8 py-4 hover:text-primary"
          onClick={toggleSidebar}
        >
          Home
        </Link>

        {/* Ride By (Collapsible) */}
        <div>
          <button
            onClick={toggleRideBy}
            className="flex justify-between items-center w-full px-8 py-4 hover:text-primary"
          >
            <span>Ride By</span>
            <ChevronDown
              className={`transition-transform duration-300 ${
                rideByOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {rideByOpen && (
            <div className="flex flex-col divide-y divide-border">
              <Link
                href="/ride-bike"
                className="flex items-center gap-2 px-12 py-3 hover:text-primary"
                onClick={toggleSidebar}
              >
                <Bike className="text-blue-500 text-xl border p-0.5 rounded" />
                Bike
              </Link>
              <Link
                href="/ride-cng"
                className="flex items-center gap-2 px-12 py-3 hover:text-primary"
                onClick={toggleSidebar}
              >
                <BusFront className="text-green-600 text-xl border p-0.5 rounded" />
                <span>CNG</span>
              </Link>
              <Link
                href="/ride-car"
                className="flex items-center gap-2 px-12 py-3 hover:text-primary"
                onClick={toggleSidebar}
              >
                <Car className="text-red-500 text-xl border p-0.5 rounded" />
                <span>Car</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/offers"
          className="px-8 py-4 hover:text-primary"
          onClick={toggleSidebar}
        >
          Offers
        </Link>
        <Link
          href="/contact"
          className="px-8 py-4 hover:text-primary"
          onClick={toggleSidebar}
        >
          Contact
        </Link>
        <Link
          href="/about"
          className="px-8 py-4 hover:text-primary"
          onClick={toggleSidebar}
        >
          About
        </Link>
        <Link
          href="/become-rider"
          className="px-8 py-4 hover:text-primary"
          onClick={toggleSidebar}
        >
          Become a Rider
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
