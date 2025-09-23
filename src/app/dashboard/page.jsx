"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bike, Car, Users, Settings, LogOut, User, Star, DollarSign, ClipboardList, MapPin, Menu, Search, Bell, TrendingUp, LucideLogOut, PanelRightOpen, PanelRightClose } from "lucide-react";
import logo from "../../Assets/ridex-logo.webp";
import Image from "next/image";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
  <aside className={`bg-accent/30 border-r border-border flex flex-col justify-between py-8 px-6 text-foreground transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden p-0 border-none'}`}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Link href="/">
              <Image src={logo} alt="RideX Logo" className="w-30 h-8 object-contain" />
            </Link>
          </div>
          <nav className="flex flex-col gap-1 mb-8">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base bg-primary/90 text-background">Dashboard</Link>
            <Link href="/dashboard/active-rides" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base text-foreground hover:bg-primary/10 hover:text-primary">Active Rides</Link>
            <Link href="/dashboard/earnings" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base text-foreground hover:bg-primary/10 hover:text-primary">Earnings</Link>
            <Link href="/dashboard/passengers" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base text-foreground hover:bg-primary/10 hover:text-primary">Passengers</Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base text-foreground hover:bg-primary/10 hover:text-primary">Analytics</Link>
            <Link href="/dashboard/map" className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base text-foreground hover:bg-primary/10 hover:text-primary">Map View</Link>
          </nav>
          <div className="mt-8 flex items-center gap-3 p-3 rounded-lg bg-accent border border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">JD</div>
            <div>
              <div className="font-semibold text-foreground">John Driver</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                4.9 <Star className="w-3 h-3 text-primary" /> Rating
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="flex items-center justify-center gap-2 mt-8">
          <LucideLogOut className="w-5 h-5" /> Logout
        </Button>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/80">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button type="button" onClick={() => setSidebarOpen(true)} className="focus:outline-none">
                <PanelRightOpen className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
            {sidebarOpen && (
              <button type="button" onClick={() => setSidebarOpen(false)} className="focus:outline-none">
                <PanelRightClose className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
            <div className="relative">
              <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none" />
              <Search className="absolute left-2 top-2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-muted-foreground" />
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent border border-border text-foreground font-semibold hover:bg-primary/10 transition">
              <User className="w-5 h-5 text-primary" />
              <span className="hidden md:inline">Profile</span>
            </button>
          </div>
        </header>
        {/* Dashboard Content */}
        <main className="flex-1 px-10 py-8">
          {/* Welcome Header & Stat Cards */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your rides today</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="rounded-2xl bg-accent/10 border border-border shadow-sm p-6 flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">Today's Earnings</div>
                <div className="text-2xl font-bold text-primary">$127.50</div>
                <div className="text-xs text-muted-foreground">from 8 rides</div>
                <div className="text-green-600 text-xs font-semibold mt-1">+12%</div>
              </div>
              <div className="rounded-2xl bg-accent/10 border border-border shadow-sm p-6 flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Rides</div>
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-xs text-muted-foreground">this month</div>
                <div className="text-green-600 text-xs font-semibold mt-1">+8%</div>
              </div>
              <div className="rounded-2xl bg-accent/10 border border-border shadow-sm p-6 flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">Rating</div>
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-xs text-muted-foreground">out of 5 stars</div>
              </div>
              <div className="rounded-2xl bg-accent/10 border border-border shadow-sm p-6 flex flex-col gap-2">
                <div className="text-sm font-medium text-muted-foreground mb-1">Hours Online</div>
                <div className="text-2xl font-bold text-primary">6.5h</div>
                <div className="text-xs text-muted-foreground">today</div>
              </div>
            </div>
          </div>
          {/* Summary Chart & Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-background border border-border shadow-sm p-6 mb-6">
                <div className="font-semibold text-lg mb-2 text-foreground">Summary</div>
                {/* Chart placeholder */}
                <div className="h-40 flex items-center justify-center text-muted-foreground bg-accent/10 rounded-xl">[Chart]</div>
              </div>
              <div className="rounded-2xl bg-background border border-border shadow-sm p-6">
                <div className="font-semibold text-lg mb-2 text-foreground">Recent Rides</div>
                {/* Recent rides placeholder */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10">
                    <div>
                      <div className="font-semibold text-foreground">Sarah Johnson</div>
                      <div className="text-xs text-muted-foreground">Downtown Mall → Airport Terminal</div>
                      <div className="text-xs text-muted-foreground">Today at 2:30 PM</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">$24.50</div>
                      <div className="text-xs text-green-600">completed</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-accent/10">
                    <div>
                      <div className="font-semibold text-foreground">Mike Chen</div>
                      <div className="text-xs text-muted-foreground">Central Park → Business District</div>
                      <div className="text-xs text-muted-foreground">Today at 1:15 PM</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">$18.75</div>
                      <div className="text-xs text-green-600">completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Top Customers/Quick Actions */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-background border border-border shadow-sm p-6">
                <div className="font-semibold text-lg mb-2 text-foreground">Quick Actions</div>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/90 text-background font-semibold hover:bg-primary transition"><MapPin className="w-4 h-4" /> View Active Requests</button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-accent border border-border text-foreground font-semibold hover:bg-primary/10 transition"><Users className="w-4 h-4 text-primary" /> Passenger History</button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-foreground font-semibold hover:bg-accent/40 transition"><DollarSign className="w-4 h-4 text-primary" /> Weekly Earnings</button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-foreground font-semibold hover:bg-accent/40 transition"><Star className="w-4 h-4 text-primary" /> Feedback & Ratings</button>
                </div>
              </div>
              <div className="rounded-2xl bg-background border border-border shadow-sm p-6">
                <div className="font-semibold text-lg mb-2 text-foreground">This Week</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Earnings</span>
                    <span className="font-semibold">$523.75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rides Completed</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-semibold">4.9 ★</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hours Online</span>
                    <span className="font-semibold">32.5h</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">75% of weekly goal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
