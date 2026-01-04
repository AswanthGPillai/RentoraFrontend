import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI, registerAPI, googleLoginAPI } from "@/services/allApis";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Fingerprint } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

const Auth = ({ register }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ======================
      LOGIC HANDLERS (Your existing functions)
  ====================== */
  const handleRegister = async () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) return toast.info("Please fill all fields");
    const result = await registerAPI(formData);
    if (result?.status === 200 || result?.status === 201) {
      toast.success("Registration successful");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      toast.error(result?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    if (!email || !password) return toast.info("Please fill all fields");
    const result = await loginAPI({ email, password });
    if (result?.status === 200) {
      const { existingUser, token } = result.data;
      sessionStorage.setItem("existingUser", JSON.stringify(existingUser));
      sessionStorage.setItem("token", token);
      toast.success("Access granted");
      setTimeout(() => {
        existingUser.role === "admin" ? navigate("/admin") : navigate("/");
      }, 1000);
    } else {
      toast.error(result?.data?.message || "Invalid credentials");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const payload = { username: decoded.name, email: decoded.email, profile: decoded.picture };
      const result = await googleLoginAPI(payload);
      if (result?.status === 200) {
        const { existingUser, token } = result.data;
        sessionStorage.setItem("existingUser", JSON.stringify(existingUser));
        sessionStorage.setItem("token", token);
        toast.success("Google login successful");
        setTimeout(() => {
          existingUser.role === "admin" ? navigate("/admin") : navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Google authentication error");
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />

      {/* LEFT BRAND SECTION - Visual Powerhouse */}
      <div className="hidden lg:flex lg:w-3/5 relative group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070)" }}
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent p-20 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#C5A059] flex items-center justify-center rounded-br-3xl rotate-45 border-2 border-white/20">
              <span className="text-black font-black text-3xl -rotate-45">R</span>
            </div>
            <span className="text-4xl font-bold tracking-tighter uppercase text-white">
              Rent<span className="text-[#C5A059] font-light ">ora</span>
            </span>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex items-center gap-3 text-[#C5A059] mb-6">
              <div className="h-[1px] w-12 bg-[#C5A059]" />
              <p className="font-black uppercase tracking-[0.5em] text-[10px]">The Gold Standard</p>
            </div>
            <h1 className="text-7xl font-bold leading-[0.9] tracking-tighter text-white">
              {register ? "Begin Your" : "Return To"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#F5E6AD]">
                {register ? "Legacy" : "Luxury"}
              </span>.
            </h1>
          </div>
        </div>
      </div>

      {/* RIGHT AUTH FORM - Clean Luxury UI */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12 bg-[#FDFCFB] relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none rotate-12">
          <Fingerprint size={400} className="text-[#C5A059]" />
        </div>

        <div className="w-full max-w-[420px] relative z-10 animate-in fade-in slide-in-from-right-10 duration-700">
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-5xl font-black text-[#1A1A1A] tracking-tighter mb-2">
              {register ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 font-medium">Elevating your lifestyle, one key at a time.</p>
          </header>

          <div className="space-y-4">
            {register && (
              <div className="group relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  placeholder="Full Identity Name"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium placeholder:text-gray-300"
                />
              </div>
            )}

            <div className="group relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors">
                <Mail size={18} />
              </div>
              <input
                name="email"
                placeholder="Digital Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium placeholder:text-gray-300"
              />
            </div>

            <div className="group relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Security Key"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-14 pr-14 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#C5A059] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!register && (
              <div className="flex justify-end pr-2">
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:text-black transition-colors">
                  Forgot Password ?
                </button>
              </div>
            )}

            <button
              onClick={register ? handleRegister : handleLogin}
              className="group w-full py-5 bg-[#1A1A1A] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C5A059] transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-black/5"
            >
              {register ? "Initialize Profile" : "Authorize Access"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">or direct sync</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="flex justify-center transition-all hover:scale-[1.02]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                theme="outline"
                shape="pill"
                size="large"
              />
            </div>

            <p className="text-center text-sm mt-10 font-medium text-gray-400">
              {register ? "Already a member?" : "New to the estate?"}
              <Link
                to={register ? "/login" : "/signup"}
                className="ml-3 text-[#C5A059] font-black uppercase tracking-widest text-[11px] hover:underline underline-offset-8 transition-all"
              >
                {register ? "Portal Entry" : "Join the circle"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;