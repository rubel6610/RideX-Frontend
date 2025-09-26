"use client";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Page Heading */}
      <section className="py-16 px-6 md:px-20 text-center">
        <h1 className="text-4xl md:text-5xl mt-6 font-bold mb-4">Get in Touch with RideX</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Have questions or feedback? Our team is here to help you 24/7.
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center gap-8">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Contact Information</h2>
          <div className="flex items-center gap-4">
            <MapPin className="w-6 h-6 text-primary" />
            <p>123 RideX Street, Dhaka, Bangladesh</p>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-6 h-6 text-primary" />
            <p>+880 123 456 789</p>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-primary" />
            <p>support@ridex.com</p>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-primary" />
            <p>Mon – Sun: 24/7 Support</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 mt-6">
            <a href="#" className="hover:text-primary"><Facebook className="w-6 h-6" /></a>
            <a href="#" className="hover:text-primary"><Twitter className="w-6 h-6" /></a>
            <a href="#" className="hover:text-primary"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-primary"><Linkedin className="w-6 h-6" /></a>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center md:text-left">
            <p className="font-semibold">Need immediate assistance?</p>
            <a href="tel:+880123456789" className="text-primary hover:underline font-semibold">
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* Map Section (Fixed Dhaka Location) */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Location</h2>
        <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={`https://maps.google.com/maps?q=23.8103,90.4125&z=15&output=embed`}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
