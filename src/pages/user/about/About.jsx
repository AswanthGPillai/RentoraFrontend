import React from "react";
import { Award, ShieldCheck, Gem, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full bg-[#fcfcfc]">

      {/* HERO SECTION (PRESERVED) */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* Background Image */}
        <img
          src="https://wallpapers.com/images/hd/mumbai-2560-x-1600-background-tamrf8fvq3vad3b2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="About Background"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Title */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            About Rentora
          </h1>
        </div>
      </div>

      {/* 1. INTRODUCTION SECTION */}
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] font-black text-sm uppercase tracking-[0.3em] mb-4 block">The Gold Standard</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Redefining Modern Living</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 italic">"Where elegance meets the comfort of home."</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Rentora curates luxurious rental residences designed for both short-term 
              escapes and extended stays. Our properties blend comfort, elegance, and 
              modern amenities — offering you an experience that feels like home while 
              delivering hotel-like sophistication.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We focus on premium service, beautifully crafted spaces, and the perfect 
              balance between privacy and hospitality. Whether you're exploring a new city 
              or planning a relaxing getaway, Rentora ensures your stay is exceptional.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 border-2 border-[#D4AF37] rounded-2xl group-hover:inset-0 transition-all duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80"
              className="relative rounded-xl shadow-2xl object-cover w-full h-[400px]"
              alt="Luxury Residence"
            />
          </div>
        </div>
      </div>

      {/* 2. STATS SECTION (GOLDEN BAR) */}
      <div className="bg-[#111] py-16">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Premium Properties", val: "500+" },
            { label: "Happy Guests", val: "12k+" },
            { label: "Cities Covered", val: "25+" },
            { label: "Awards Won", val: "14" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-[#D4AF37] text-4xl font-black">{stat.val}</h4>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CORE VALUES SECTION */}
      <div className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Card 1 */}
          <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all border-t-4 border-t-[#D4AF37]">
            <Gem className="text-[#D4AF37] mb-6" size={40} />
            <h4 className="text-xl font-bold mb-4">Unrivaled Luxury</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              We hand-pick every residence based on strict aesthetic and functional standards. 
              Only the top 1% of properties make it into the Rentora collection.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-10 bg-[#111] rounded-3xl shadow-2xl transform md:-translate-y-8">
            <ShieldCheck className="text-[#D4AF37] mb-6" size={40} />
            <h4 className="text-xl font-bold mb-4 text-white">Trust & Security</h4>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your safety is our priority. With 24/7 concierge support and encrypted 
              booking systems, we ensure a seamless and secure living experience.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-10 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all border-t-4 border-t-[#D4AF37]">
            <Users className="text-[#D4AF37] mb-6" size={40} />
            <h4 className="text-xl font-bold mb-4">Personalized Care</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              From pre-arrival requests to customized city guides, our team is dedicated 
              to tailoring your stay to your specific lifestyle needs.
            </p>
          </div>

        </div>
      </div>

      {/* 4. CLOSING VISION */}
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl border-t border-gray-100">
        <Award className="text-[#D4AF37] mx-auto mb-6" size={48} />
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h3>
        <p className="text-xl text-gray-500 font-light leading-relaxed italic">
          "To transform the way the world travels by creating spaces that inspire, 
          comfort, and elevate the human experience, one stay at a time."
        </p>
      </div>

    </div>
  );
};

export default About;