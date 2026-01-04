import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Home, Shield, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/explore");
    }
  };

  const featuredProperties = [
    {
      id: 1,
      title: "The Glass Pavilion",
      location: "Bandra, Mumbai",
      price: "₹85,000 / mo",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Zen Garden Suites",
      location: "Indiranagar, Bangalore",
      price: "₹62,000 / mo",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Urban Loft 402",
      location: "Whitefield, Bangalore",
      price: "₹45,000 / mo",
      img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      
      {/* 1. HERO SECTION (Maintained original structure, refined text size) */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
            CURATED RENTAL RESIDENCES
          </h1>
          <h2 className="text-white mt-3 text-sm md:text-xl font-light tracking-[0.2em] uppercase opacity-90">
            FOR SHORT-TERM AND EXTENDED STAYS
          </h2>
          
          <button
            onClick={handleExploreClick}
            className="mt-10 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all flex items-center gap-2 group"
          >
            Explore Spaces <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. THE RENTORA EXPERIENCE */}
      <div className="container mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-yellow-600 font-bold uppercase tracking-widest text-[10px]">Excellence in Living</span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 leading-tight">
              A new standard in luxury leasing.
            </h3>
            <p className="text-slate-500 mt-5 leading-relaxed text-sm">
              Rentora isn't just a platform; it's a gateway to hand-selected residences that blend 
              architectural brilliance with the comforts of home. Whether you're relocating for 
              work or seeking a sanctuary, we curate every detail.
            </p>
            <p className="text-slate-400 mt-4 italic text-sm border-l-2 border-yellow-600 pl-4">
              "Every property undergoes a 50-point inspection for perfection."
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000" 
              className="rounded-2xl shadow-xl z-10 relative h-[300px] w-full object-cover" 
              alt="Interior"
            />
            <div className="absolute -bottom-4 -left-4 bg-yellow-600 text-white px-6 py-4 rounded-xl shadow-lg hidden md:block">
              <p className="text-xl font-bold">12k+</p>
              <p className="text-[10px] font-medium uppercase tracking-tighter opacity-80">Happy Stays</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FEATURED PROPERTIES */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="text-xl font-bold text-slate-800 tracking-tight">Featured Collections</h4>
              <p className="text-slate-400 text-xs mt-1">Our most requested residences this month.</p>
            </div>
            <button onClick={handleExploreClick} className="text-yellow-600 text-xs font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={14}/>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProperties.map((item) => (
              <div key={item.id} className="group bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden rounded-xl h-[240px]">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={item.title}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-bold">4.9</span>
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <MapPin size={10} /> {item.location}
                  </div>
                  <h5 className="text-base font-bold text-slate-800 mt-1">{item.title}</h5>
                  <p className="text-yellow-700 text-sm font-semibold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. THE RENTORA DISTINCTION */}
      <div className="container mx-auto py-16 px-6 text-center">
        <h4 className="text-xl font-bold text-slate-800 mb-12 tracking-tight">The Rentora Distinction</h4>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h6 className="text-sm font-bold mb-2">Verified Listings</h6>
            <p className="text-slate-400 text-xs px-4">Strict vetting for your security and peace of mind.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h6 className="text-sm font-bold mb-2">Instant Booking</h6>
            <p className="text-slate-400 text-xs px-4">Seamless confirmation for your next stay.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <Home size={24} />
            </div>
            <h6 className="text-sm font-bold mb-2">Full Concierge</h6>
            <p className="text-slate-400 text-xs px-4">24/7 support for cleaning and maintenance.</p>
          </div>
        </div>
      </div>

      {/* 5. CALL TO ACTION */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to find your next home?</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Join professionals who trust Rentora for their premium housing needs.
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="bg-white text-slate-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 hover:text-white transition-all shadow-lg"
          >
            Join the Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;