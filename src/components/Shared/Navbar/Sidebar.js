'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Bike, Car, BusFront, X } from 'lucide-react';
import logo from '../../../Assets/ridex-logo.webp';

const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  rideByOpen,
  toggleRideBy,
  showNavbar,
}) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen w-full z-[997] transform transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-screen w-full flex justify-end">
        <aside className="w-[360px] h-screen bg-background text-foreground shadow-lg p-8 relative">
          {/* Close button */}
          <button
            className="absolute right-4 top-4 text-foreground"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X />
          </button>

          {/* Logo and intro */}
          <div className="mb-6">
            <Link
              href="/"
              onClick={toggleSidebar}
              className="inline-block mb-4"
            >
              <Image src={logo} alt="RideX Logo" width={140} height={56} />
            </Link>
            <p className="text-sm leading-relaxed">
              Mauris ut enim sit amet lacus ornare ullamcorper. Praesent
              placerat neque purus rhoncus tincidunt odio ultrices. Sed feugiat
              feugiat felis.
            </p>
          </div>

          <div className="flex flex-col font-medium">
            <Link
              href="/"
              className="py-3 font-semibold hover:text-sidebar-primary"
              onClick={toggleSidebar}
            >
              Home
            </Link>
            <button
              onClick={toggleRideBy}
              className="flex justify-between items-center w-full py-3 font-semibold hover:text-sidebar-primary"
            >
              <span>Ride By</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  rideByOpen ? '' : 'rotate-180'
                }`}
              />
            </button>
            {rideByOpen && (
              <div className="pl-4 flex flex-col">
                <Link
                  href="/ride-bike"
                  className="py-2 flex items-center gap-2 hover:text-sidebar-primary"
                  onClick={toggleSidebar}
                >
                  <Bike className="text-sidebar-primary" />
                  Bike
                </Link>
                <Link
                  href="/ride-cng"
                  className="py-2 flex items-center gap-2 hover:text-sidebar-primary"
                  onClick={toggleSidebar}
                >
                  <BusFront className="text-sidebar-primary" />
                  CNG
                </Link>
                <Link
                  href="/ride-car"
                  className="py-2 flex items-center gap-2 hover:text-sidebar-primary"
                  onClick={toggleSidebar}
                >
                  <Car className="text-sidebar-primary" />
                  Car
                </Link>
              </div>
            )}

            <Link
              href="/offers"
              className="py-3 font-semibold hover:text-sidebar-primary"
              onClick={toggleSidebar}
            >
              Offers
            </Link>
            <Link
              href="/contact"
              className="py-3 font-semibold hover:text-sidebar-primary"
              onClick={toggleSidebar}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="py-3 font-semibold hover:text-sidebar-primary"
              onClick={toggleSidebar}
            >
              About
            </Link>
            <Link
              href="/become-rider"
              className="py-3 font-semibold hover:text-sidebar-primary"
              onClick={toggleSidebar}
            >
              Become a Rider
            </Link>
          </div>

          <div className="mt-auto pt-6 border-t border-sidebar-border">
            <h4 className="font-semibold mb-2">Contact Info:</h4>
            <p className="text-sm mb-2">
              85 Ketch Harbour RoadBensalem, PA 19020
            </p>
            <p className="text-sm mb-2">needhelp@company.com</p>
            <p className="text-sm">099 695 695 35</p>
            <div className="flex gap-3 mt-4">
              <span className="w-8 h-8 bg-secondary rounded-full" />
              <span className="w-8 h-8 bg-secondary rounded-full" />
              <span className="w-8 h-8 bg-secondary rounded-full" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
