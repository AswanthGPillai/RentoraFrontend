import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      
      {/* LEFT SECTION - IMAGE OVERLAY */}
      <div
        className="hidden md:flex w-3/5 bg-cover bg-center relative group"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop)",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-all duration-700 group-hover:bg-black/30 p-16 text-white flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C5A059] flex items-center justify-center rounded-br-2xl rotate-45 transform hover:rotate-0 transition-transform duration-500">
              <span className="text-black font-black text-2xl -rotate-45 transform hover:rotate-0 transition-transform">R</span>
            </div>
            <span className="text-3xl font-bold tracking-tighter">RENT<span className="text-[#C5A059] font-light">ORA</span></span>
          </Link>

          <div>
            <p className="text-[#C5A059] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Elite Real Estate</p>
            <h1 className="text-6xl font-bold leading-tight tracking-tighter">
              The keys to <br /> 
              <span className="text-[#C5A059]">unrivaled</span> luxury.
            </h1>
            <p className="mt-6 text-white/60 max-w-md font-medium leading-relaxed">
              Step back into your curated world of high-end residences and personalized concierge services.
            </p>
          </div>

          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">© 2025 Rentora Luxury Group</p>
        </div>
      </div>

      {/* RIGHT SECTION - LOGIN FORM */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-[#FDFCFB]">
        <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Welcome Back</h2>
            <p className="text-gray-400 mt-2 text-sm font-medium">Please enter your credentials to proceed.</p>
          </div>

          <form className="space-y-5">
            {/* EMAIL */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-[#1A1A1A]"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-14 pr-14 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-[#1A1A1A]"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end px-1">
              <Link to="/forgot-password" size="sm" className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#1A1A1A] transition-colors">
                Forgot Security Key?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:shadow-xl hover:shadow-[#C5A059]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              Authorize Access <ArrowRight size={16} />
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
              <span className="bg-[#FDFCFB] px-4">Or continue with</span>
            </div>
          </div>

          {/* GOOGLE SIGNUP */}
          <button className="w-full py-4 bg-white border border-gray-100 text-[#1A1A1A] rounded-2xl font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98]">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>

          {/* SIGN UP LINK */}
          <p className="text-center text-sm mt-10 font-medium text-gray-400">
            New to the estate? 
            <Link to="/signup" className="text-[#C5A059] font-black uppercase tracking-widest text-[11px] ml-2 hover:underline">
              Join the club
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;