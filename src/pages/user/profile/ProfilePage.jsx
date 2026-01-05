import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Edit2, Trash2, X, MapPin, LogOut, 
  Mail, Info, Camera, Calendar, Send, CheckCircle, 
  Archive, User, LayoutDashboard, Settings
} from "lucide-react";

// ✅ Re-integrated your specific services
import commonApi from "@/services/commonApi";
import { serverURL, BASE_URL } from "@/services/serverURL";

/* =========================
   IMAGE HELPER
========================= */
const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/800x400?text=No+Image";
  if (image.startsWith("http")) return image;
  // ✅ Matches the first snippet's regex logic
  return `${BASE_URL}/uploads/${image.replace(/^uploads\//, "")}`;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  /* =========================
      STATE MANAGEMENT
  ========================= */
  const [editOpen, setEditOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({ _id: "", username: "", email: "", profile: "" });
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [newProfileImg, setNewProfileImg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Complaint logic: State PER booking ID
  const [complaintForms, setComplaintForms] = useState({});
  const [complaintStatus, setComplaintStatus] = useState({ 
    loading: false, 
    success: false, 
    activeId: null 
  });

  /* =========================
      INITIALIZATION
  ========================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = JSON.parse(sessionStorage.getItem("existingUser"));
    if (storedUser) setUser(storedUser);
    fetchBookings();
  }, [token, navigate]);

  /* =========================
      FETCH BOOKINGS (Logic from 1)
  ========================= */
  const fetchBookings = async () => {
    try {
      const res = await commonApi("get", `${serverURL}/bookings/user`);
      if (res.status === 200) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error("Fetch booking error:", err.message);
    }
  };

  const activeBookings = bookings.filter(b => b.status === "Active");
  const terminatedBookings = bookings.filter(b => b.status === "Cancelled");

  /* =========================
      PROFILE IMAGE
  ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /* =========================
      UPDATE PROFILE (Logic from 1)
  ========================= */
  const handleUpdateProfile = async () => {
    if (passwords.password && passwords.password !== passwords.confirmPassword) {
      return alert("Passwords do not match");
    }
    
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      if (passwords.password) formData.append("password", passwords.password);
      if (newProfileImg) formData.append("profile", newProfileImg);

      const res = await commonApi(
        "put",
        `${serverURL}/user-profile-update`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (res.status === 200) {
        sessionStorage.setItem("existingUser", JSON.stringify(res.data));
        setUser(res.data);
        setEditOpen(false);
        setPasswords({ password: "", confirmPassword: "" });
        setPreviewUrl(null);
        alert("Profile updated successfully");
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  /* =========================
      CANCEL BOOKING (Logic from 1)
  ========================= */
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to terminate this lease?")) return;
    try {
      const res = await commonApi("delete", `${serverURL}/bookings/${bookingId}`);
      if (res.status === 200 || res.status === 204) {
        fetchBookings();
      }
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  /* =========================
      COMPLAINT SUBMIT (Logic from 1)
  ========================= */
  const handleComplaintSubmit = async (e, booking) => {
    e.preventDefault();
    const form = complaintForms[booking._id];

    if (!form?.title || !form?.message) {
      return alert("Please enter both a subject and a message.");
    }

    setComplaintStatus({ loading: true, success: false, activeId: booking._id });

    try {
      const res = await commonApi("post", `${serverURL}/complaints`, { 
        bookingId: booking._id, 
        roomId: booking.roomId?._id,
        title: form.title, 
        message: form.message 
      });

      if (res.status === 200 || res.status === 201) {
        setComplaintStatus({ loading: false, success: true, activeId: booking._id });

        // Clear ONLY this card's form
        setComplaintForms(prev => {
          const copy = { ...prev };
          delete copy[booking._id];
          return copy;
        });

        // Reset success status after delay
        setTimeout(() => {
          setComplaintStatus({ loading: false, success: false, activeId: null });
        }, 3000);
      }
    } catch (err) {
      alert("Failed to send complaint.");
      setComplaintStatus({ loading: false, success: false, activeId: null });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-sans">
      
      {/* PREMIUM HEADER */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <span>RENT<span className="text-[#C5A059] font-light">ORA</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 border-l border-gray-100 pl-8">
              <Link to="/explore" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">Properties</Link>
              <Link to="/profile" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">Resident Dashboard</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Logout</h5>
            <button 
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all group"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C5A059]"></div>
              
              <div className="relative inline-block group mb-6">
                <div className="w-40 h-40 rounded-[3rem] overflow-hidden ring-8 ring-gray-50 shadow-inner mx-auto">
                  <img 
                    src={previewUrl || getImageUrl(user.profile)} 
                    className="w-full h-full object-cover" 
                    alt="User" 
                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                  />
                </div>
                <button onClick={() => setEditOpen(true)} className="absolute -bottom-2 -right-2 bg-black text-[#C5A059] p-3 rounded-2xl hover:scale-110 transition-transform shadow-xl">
                  <Edit2 size={18} />
                </button>
              </div>

              <h2 className="text-3xl font-black tracking-tighter text-gray-900">{user.username}</h2>
              <p className="text-gray-400 mt-1 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase">
                <Mail size={12} className="text-[#C5A059]"/> {user.email}
              </p>
              
              <div className="mt-10 pt-8 border-t border-gray-50 text-left">
                <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-4">Resident Status</p>
                <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                  "Manage your luxury residences and premium concierge requests from your private dashboard."
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* ACTIVE LEASES SECTION */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  Active Residences 
                </h3>
                <span className="bg-black text-[#C5A059] text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                  {activeBookings.length} Active
                </span>
              </div>

              {activeBookings.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                   <Info className="mx-auto text-gray-200 mb-4" size={48} />
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active leases</p>
                </div>
              ) : (
                activeBookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 mb-8 transition-all">
                    
                    {/* Property Preview */}
                    <div className="relative rounded-[3rem] overflow-hidden mb-10 h-80 group">
                      <img src={getImageUrl(booking.roomId?.imageUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Room" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-8 left-8">
                        <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-1">Elite Stay</p>
                        <h4 className="text-2xl font-bold text-white tracking-tight">
                          {booking.roomId?.propertyType} <span className="font-light opacity-70">#{booking.roomId?.houseNumber}</span>
                        </h4>
                      </div>
                    </div>

                    {/* Lease Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-[#C5A059]"><Calendar size={22} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lease Started</p>
                          <p className="text-sm font-black text-gray-800 mt-1">{new Date(booking.startDate).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-[#C5A059]"><MapPin size={22} /></div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                          <p className="text-sm font-black text-gray-800 mt-1 uppercase tracking-tighter">{booking.roomId?.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* COMPLAINT FORM */}
                    <div className="pt-10 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>
                        <h4 className="font-black text-sm uppercase tracking-[0.2em] text-gray-800">Support Request</h4>
                      </div>
                      
                      <form onSubmit={(e) => handleComplaintSubmit(e, booking)} className="space-y-4">
                        <input 
                          type="text"
                          placeholder="Subject (e.g. Maintenance, Electricity)"
                          className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm font-bold"
                          value={complaintForms[booking._id]?.title || ""}
                          onChange={(e) => setComplaintForms(prev => ({
                            ...prev,
                            [booking._id]: { ...prev[booking._id], title: e.target.value }
                          }))}
                        />
                        <textarea 
                          placeholder="Describe your issue in detail..."
                          rows="2"
                          className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all text-sm font-bold"
                          value={complaintForms[booking._id]?.message || ""}
                          onChange={(e) => setComplaintForms(prev => ({
                            ...prev,
                            [booking._id]: { ...prev[booking._id], message: e.target.value }
                          }))}
                        ></textarea>
                        
                        <button 
                          type="submit"
                          disabled={complaintStatus.loading && complaintStatus.activeId === booking._id}
                          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all ${
                            complaintStatus.success && complaintStatus.activeId === booking._id
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-black text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
                          }`}
                        >
                          {complaintStatus.success && complaintStatus.activeId === booking._id ? (
                            <><CheckCircle size={14} className="inline mr-2" /> Sent Successfully</>
                          ) : (
                            <><Send size={14} className="inline mr-2" /> {complaintStatus.loading && complaintStatus.activeId === booking._id ? "Processing..." : "Submit to Concierge"}</>
                          )}
                        </button>
                      </form>
                    </div>

                    <button 
                      onClick={() => handleCancelBooking(booking._id)} 
                      className="w-full mt-8 py-4 text-gray-300 font-bold hover:text-red-500 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Terminate Lease
                    </button>
                  </div>
                ))
              )}
            </section>

            {/* TERMINATED HISTORY SECTION */}
            {terminatedBookings.length > 0 && (
              <section className="pt-10">
                <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-8 text-gray-400">
                  <Archive size={20} /> Lease History
                </h3>
                <div className="space-y-4">
                  {terminatedBookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 flex items-center justify-between shadow-sm opacity-60 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                          <img src={getImageUrl(booking.roomId?.imageUrl)} className="w-full h-full object-cover grayscale" alt="Old Room" />
                        </div>
                        <div>
                          <h5 className="font-black text-gray-800">#{booking.roomId?.houseNumber} {booking.roomId?.propertyType}</h5>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Terminated: {new Date(booking.updatedAt || booking.endDate).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase px-3 py-1 bg-gray-50 text-gray-400 rounded-full">Archived</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setEditOpen(false)}></div>
          <div className="relative bg-white rounded-[4rem] w-full max-w-lg p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setEditOpen(false)} className="absolute right-10 top-10 text-gray-300 hover:text-black transition-colors"><X size={28} /></button>
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase italic">Update <span className="text-[#C5A059]">Identity</span></h2>
              
              <div className="relative mb-10 group cursor-pointer">
                <input type="file" id="modal-upload" hidden onChange={handleImageChange} />
                <label htmlFor="modal-upload" className="block relative">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-gray-50 shadow-2xl">
                    <img src={previewUrl || getImageUrl(user.profile)} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"><Camera className="text-white" /></div>
                </label>
              </div>

              <div className="w-full space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Username</label>
                  <input 
                    value={user.username} 
                    onChange={(e) => setUser({ ...user, username: e.target.value })} 
                    className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Security</label>
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} 
                    className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all font-bold"
                  />
                </div>
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                  className="w-full bg-gray-50 border-none p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all font-bold"
                />
                <button onClick={handleUpdateProfile} className="w-full bg-black text-[#C5A059] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-[#C5A059] hover:text-black transition-all mt-8">
                  Confirm Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;