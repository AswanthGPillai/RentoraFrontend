import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Compass,
  Phone,
  Info,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/services/serverURL"; // ✅ Logic from snippet 1

/* =========================
   IMAGE HELPER
   - Handles external URLs and local uploads
========================= */
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  // ✅ Robust replacement logic from snippet 1
  return `${BASE_URL}/uploads/${image.replace(/^uploads\//, "")}`;
};

const UserLayout = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get user from session storage
  const user = JSON.parse(sessionStorage.getItem("existingUser"));

  // ✅ Computed Profile Data
  const profileImage = getImageUrl(user?.profile);
  const userInitial = user?.username?.charAt(0)?.toUpperCase() || "U";

  /* =========================
     SIDE EFFECTS
  ========================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileRedirect = () => {
    setOpenProfile(false);
    user?.role === "admin" ? navigate("/admin") : navigate("/profile");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl py-4 shadow-2xl"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-8 flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-[#C5A059] flex items-center justify-center rounded-br-2xl rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <span className="text-black font-black text-xl -rotate-45 group-hover:rotate-0 transition-transform">
                R
              </span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white ml-2">
              RENT<span className="text-[#C5A059] font-light">ORA</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-12">
            {[
              { name: "Home", path: "/", icon: Compass },
              { name: "About", path: "/about", icon: Info },
              { name: "Contact", path: "/contact", icon: Phone },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex flex-col items-center text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                  location.pathname === item.path
                    ? "text-[#C5A059]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.name}
                <span
                  className={`h-[1px] bg-[#C5A059] transition-all duration-300 ${
                    location.pathname === item.path
                      ? "w-full mt-1"
                      : "w-0 group-hover:w-full mt-1"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* PROFILE / AUTH SECTION */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {!user ? (
              <div className="flex items-center gap-8">
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-[#C5A059] transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <button className="bg-[#C5A059] text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">
                    Join Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md p-1.5 pr-5 rounded-full border border-white/10 transition-all active:scale-95"
                >
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border border-[#C5A059]/40"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#C5A059] flex items-center justify-center font-black text-black text-xs">
                        {userInitial}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {user.username?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-[#C5A059] transition-transform duration-300 ${
                      openProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN MENU */}
                {openProfile && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setOpenProfile(false)}
                    />
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-[#C5A059]/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                      <div className="bg-[#FAF7F0] px-6 py-6 border-b border-[#C5A059]/10">
                        <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em] mb-1">
                          Authenticated Resident
                        </p>
                        <p className="text-sm font-bold text-black truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-3">
                        <button
                          onClick={handleProfileRedirect}
                          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-[#C5A059] hover:text-white text-[10px] font-black uppercase tracking-widest transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059] group-hover:bg-white/20 group-hover:text-white transition-colors">
                            {user.role === "admin" ? (
                              <LayoutDashboard size={16} />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          {user.role === "admin" ? "Admin Panel" : "My Profile"}
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full mt-1 flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
                            <LogOut size={16} />
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="hover:bg-white/5">
                  <Menu className="h-8 w-8 text-[#C5A059]" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 bg-[#0a0a0a] border-l border-white/10 text-white p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-white/5">
                    <SheetTitle className="text-[#C5A059] text-3xl font-black tracking-tighter">
                      RENTORA
                    </SheetTitle>
                  </div>

                  <nav className="flex-1 px-6 py-10 space-y-2">
                    {user && (
                      <div className="flex items-center gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10 mb-8">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#C5A059] flex items-center justify-center font-black text-black text-xl">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              className="w-full h-full object-cover"
                              alt="mobile-profile"
                            />
                          ) : (
                            userInitial
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{user.username}</p>
                          <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest">
                            Premium Resident
                          </p>
                        </div>
                      </div>
                    )}

                    {["Home", "About", "Contact"].map((item) => (
                      <Link
                        key={item}
                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="block px-6 py-4 text-xl font-bold hover:text-[#C5A059] transition-colors"
                      >
                        {item}
                      </Link>
                    ))}

                    <div className="pt-10 space-y-4">
                      {user ? (
                        <>
                          <button
                            onClick={handleProfileRedirect}
                            className="w-full text-left px-6 py-4 bg-white/5 rounded-2xl font-bold flex items-center justify-between"
                          >
                            Access Dashboard
                            <ChevronDown
                              size={18}
                              className="-rotate-90 text-[#C5A059]"
                            />
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-4 text-red-500 font-bold uppercase tracking-widest text-xs"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          className="block px-6 py-4 bg-[#C5A059] text-black text-center rounded-2xl font-black uppercase tracking-widest"
                        >
                          Get Started
                        </Link>
                      )}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <h3 className="text-[#C5A059] text-2xl font-black tracking-tighter mb-2">
                RENTORA
              </h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                Curated Luxury Living
              </p>
            </div>

            <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>

            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
              © 2026 Rentora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;