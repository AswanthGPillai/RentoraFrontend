import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Settings, Briefcase, LayoutDashboard, Bell, LogOut, ChevronRight, Shield } from "lucide-react";

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/admin/rent", icon: Briefcase, label: "Rentals" },
    { path: "/admin/users", icon: Users, label: "Clients" },
    { path: "/admin/rooms", icon: Home, label: "Properties" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path, exact = false) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#F9F8F6]"> {/* Warm White/Silk Background */}
      
      {/* SIDEBAR */}
      <aside
        className={`${
          open ? "w-72" : "w-24"
        } bg-white transition-all duration-500 relative flex flex-col z-50 shadow-[10px_0_30px_rgba(0,0,0,0.02)] border-r border-[#E8E1D5]`}
      >
        {/* Sidebar Toggle - Gold Border */}
        <button
          className="absolute -right-3 top-10 bg-white text-[#C5A059] p-1.5 rounded-full shadow-md border border-[#E8E1D5] hover:scale-110 transition-transform duration-200 z-50"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
        </button>

        {/* Logo Section */}
        <div className="p-8 pb-12 flex justify-center">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="min-w-[42px] h-10 bg-[#C5A059] rounded-lg flex items-center justify-center shadow-lg">
              <Shield size={22} className="text-white" />
            </div>
            {open && (
              <h1 className="text-2xl font-bold tracking-tighter text-[#1A1A1A] animate-in fade-in duration-500">
                RENT<span className="text-[#C5A059] font-light">ORA</span>
              </h1>
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-5">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                      active
                        ? "bg-[#FDF9F0] text-[#B48A30] shadow-sm border border-[#F3E6D0]"
                        : "text-gray-500 hover:text-[#C5A059] hover:bg-[#F9F8F6]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    {open && (
                      <span className="text-xs font-black uppercase tracking-[0.15em] flex-1">
                        {item.label}
                      </span>
                    )}
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#F2EDE4]">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
            {open && <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header - Glassmorphism White */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-[#F2EDE4] px-10 flex items-center justify-between z-40">
          <div>
            <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em]">Administration</h2>
            <p className="text-lg font-bold text-[#2D2D2D] leading-none mt-1">Management Portal</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-[#F2EDE4]"></div>
            
            {/* User Profile Capsule */}
            <div className="flex items-center gap-3 bg-[#FDF9F0] border border-[#F3E6D0] p-1.5 pr-4 rounded-full">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-black text-xs shadow-inner">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-black text-[#B48A30] uppercase leading-none mb-1">Super User</p>
                <p className="text-xs font-bold text-[#2D2D2D] leading-none">Admin_01</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-[#FDFCFB]">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#F2EDE4] p-10 min-h-full relative overflow-hidden">
              {/* Subtle Gold Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDF9F0] rounded-bl-[5rem] -mr-16 -mt-16 border-b border-l border-[#F3E6D0]"></div>
              
              <div className="relative z-10">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;