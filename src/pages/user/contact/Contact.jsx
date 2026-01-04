import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Send, CheckCircle, MessageSquare, Info, Facebook, Instagram, Twitter, Award } from 'lucide-react';

const serverURL = "http://localhost:4000/api";

const Contact = () => {
  const token = sessionStorage.getItem("token");
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to submit a suggestion");
      return;
    }

    setStatus({ loading: true, success: false });
    try {
      await axios.post(
        `${serverURL}/suggestions`,
        { title: formData.title, message: formData.message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus({ loading: false, success: true });
      setFormData({ title: "", message: "" });
      
      setTimeout(() => setStatus({ loading: false, success: false }), 4000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false });
      alert(err.response?.data || "Failed to send suggestion");
    }
  };

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen">
      
      {/* 1. HERO SECTION (PRESERVED STRUCTURE) */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        <img
          src="https://t4.ftcdn.net/jpg/03/05/52/49/360_F_305524956_W1DhjoDgFOPsq59yDPwDUHcrtxU02jrO.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Contact Background"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.4em] mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Concierge Services
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            Contact <span className="text-[#D4AF37]">Rentora</span>
          </h1>
          <p className="text-gray-300 mt-6 max-w-lg mx-auto font-light text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 italic">
            "Your journey to an elevated lifestyle begins with a single conversation."
          </p>
        </div>
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="container mx-auto py-24 px-6 -mt-32 relative z-30">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT COLUMN: CONTACT DETAILS (GOLDEN CARDS) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4 border-gray-50">Private Channels</h2>
              
              <div className="space-y-8">
                <a href="tel:+919756567890" className="flex items-center gap-5 group">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500 shadow-sm">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Priority Call</p>
                    <p className="font-bold text-gray-800 text-lg">+91 97565 67890</p>
                  </div>
                </a>

                <a href="mailto:info@rentora.com" className="flex items-center gap-5 group">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500 shadow-sm">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Direct Mail</p>
                    <p className="font-bold text-gray-800 text-lg">rentora@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500 shadow-sm">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Location</p>
                    <p className="font-bold text-gray-800 text-lg">Ernakulam, Kerala</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 mt-12 pt-8 border-t border-gray-50">
                {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                  <a key={idx} href="#" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-black hover:bg-[#D4AF37] transition-all duration-300">
                    <Icon size={18}/>
                  </a>
                ))}
              </div>
            </div>

            {/* LUXURY STATUS CARD */}
            <div className="bg-[#111] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-gray-400/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Award size={120} />
               </div>
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                   <MessageSquare className="text-[#D4AF37]" size={32} />
                   <span className="border border-[#D4AF37] text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">VIP Elite</span>
                 </div>
                 <h3 className="text-xl font-bold mb-2">Member Support</h3>
                 <p className="text-gray-400 text-sm mb-8 font-medium">Access our dedicated lifestyle managers for bespoke property requests.</p>
                 <button className="w-full py-4 bg-[#D4AF37] text-black rounded-2xl font-black transition-all text-xs uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95">
                   Request Concierge
                 </button>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUGGESTION FORM CARD (GOLDEN ACCENTS) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-gray-200 border border-white relative overflow-hidden">
              
              {/* Decorative Subtle Gold Gradients */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Curation Desk</span>
                </div>
                <h3 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">Help Us Evolve</h3>
                <p className="text-gray-500 mb-12 font-medium max-w-md leading-relaxed">Submit your suggestions to help us refine the Rentora standard of living.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-[0.15em] mb-3 block">Perspective Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.8rem] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 outline-none transition-all font-semibold text-gray-800 shadow-sm placeholder:text-gray-300"
                      placeholder="What is your suggestion regarding?"
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-[0.15em] mb-3 block">Elaborate Your Vision</label>
                    <textarea
                      rows="6"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.8rem] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 outline-none transition-all font-semibold text-gray-800 shadow-sm resize-none placeholder:text-gray-300"
                      placeholder="Share the finer details with our team..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status.loading || status.success}
                    className={`w-full py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-3 shadow-xl ${
                      status.success 
                      ? 'bg-black text-[#D4AF37] shadow-gray-300' 
                      : 'bg-[#111] text-white hover:bg-black hover:-translate-y-1 shadow-gray-300 active:translate-y-0'
                    }`}
                  >
                    {status.success ? (
                      <><CheckCircle size={20} className="text-[#D4AF37]" /> Vision Received. Thank You.</>
                    ) : (
                      <><Send size={18} className={status.loading ? "animate-pulse" : ""} /> {status.loading ? "Processing..." : "Submit to Curators"}</>
                    )}
                  </button>

                  {!token && (
                    <div className="mt-6 flex items-center justify-center gap-3 p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <Info size={18} className="text-orange-600" />
                      <p className="text-orange-800 text-xs font-bold uppercase tracking-tighter">
                        Authenticated access required for curated submissions.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;