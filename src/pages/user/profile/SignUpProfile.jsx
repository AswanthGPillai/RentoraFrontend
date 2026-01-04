// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { 
//   Edit2, User, Trash2, X, MapPin, Home, LogOut, 
//   Mail, Info, Camera, Calendar, AlertCircle, Send, CheckCircle 
// } from "lucide-react";
// import axios from "axios";

// const serverURL = "http://localhost:4000/api";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem("token");

//   // State
//   const [editOpen, setEditOpen] = useState(false);
//   const [booking, setBooking] = useState(null);
//   const [complaintStatus, setComplaintStatus] = useState({ loading: false, success: false });
//   const [complaintForm, setComplaintForm] = useState({ title: "", message: "" });

//   const [user, setUser] = useState({
//     _id: "",
//     username: "",
//     email: "",
//     profile: "",
//     bio: "",
//   });

//   const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
//   const [newProfileImg, setNewProfileImg] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     const storedUser = JSON.parse(sessionStorage.getItem("existingUser"));
//     if (storedUser) setUser(storedUser);
//     fetchBooking();
//   }, []);

//   const fetchBooking = async () => {
//     try {
//       const res = await axios.get(`${serverURL}/bookings/user`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBooking(res.data?.[0] || null);
//     } catch (err) {
//       console.error("Fetch booking error:", err.message);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     if (passwords.password && passwords.password !== passwords.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("username", user.username);
//       formData.append("bio", user.bio);
//       if (passwords.password) formData.append("password", passwords.password);
//       if (newProfileImg) formData.append("profile", newProfileImg);

//       const res = await axios.put(`${serverURL}/user-profile-update`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       sessionStorage.setItem("existingUser", JSON.stringify(res.data));
//       setUser(res.data);
//       setEditOpen(false);
//       setPasswords({ password: "", confirmPassword: "" });
//       setNewProfileImg(null);
//       setPreviewUrl(null);
//     } catch (err) {
//       console.error("Update error:", err.message);
//     }
//   };

//   const handleCancelBooking = async () => {
//     if (!booking) return;
//     if (!window.confirm("Cancel this booking?")) return;
//     await axios.delete(`${serverURL}/bookings/${booking._id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setBooking(null);
//   };

//   const handleComplaintSubmit = async (e) => {
//     e.preventDefault();
//     if (!complaintForm.title || !complaintForm.message) return;

//     setComplaintStatus({ loading: true, success: false });
//     try {
//       await axios.post(`${serverURL}/complaints`, {
//         roomId: booking.roomId._id,
//         title: complaintForm.title,
//         message: complaintForm.message
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setComplaintStatus({ loading: false, success: true });
//       setComplaintForm({ title: "", message: "" });
//       setTimeout(() => setComplaintStatus({ loading: false, success: false }), 3000);
//     } catch (err) {
//       setComplaintStatus({ loading: false, success: false });
//       alert("Failed to send complaint");
//     }
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewProfileImg(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
//       {/* HEADER */}
//       <header className="fixed top-0 left-0 w-full z-40 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
//             Rent<span className="text-indigo-600">ora</span>
//           </Link>
//           <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-500 font-medium transition-all">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </header>

//       <main className="pt-28 pb-20 max-w-6xl mx-auto px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* PROFILE CARD */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-white text-center">
//               <div className="relative inline-block group">
//                 {user.profile ? (
//                   <img src={`http://localhost:4000/uploads/${user.profile}`} className="w-32 h-32 rounded-[2.2rem] object-cover ring-4 ring-slate-50 shadow-md" alt="User" />
//                 ) : (
//                   <div className="w-32 h-32 rounded-[2.2rem] bg-slate-100 flex items-center justify-center text-slate-400"><User size={48} /></div>
//                 )}
//                 <button onClick={() => setEditOpen(true)} className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-xl hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
//                   <Edit2 size={16} />
//                 </button>
//               </div>
//               <h2 className="mt-5 text-2xl font-bold">{user.username}</h2>
//               <p className="text-slate-500 mb-6 flex items-center justify-center gap-1 text-sm"><Mail size={14}/> {user.email}</p>
//               <div className="text-left bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
//                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Welcome 👋</p>
//                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Manage your rental experience, track your current stays, and report issues directly to the administration.</p>
//               </div>
//             </div>
//           </div>

//           {/* BOOKING & COMPLAINT SECTION */}
//           <div className="lg:col-span-2 space-y-8">
//             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-white">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-xl font-bold">Current Reservation</h3>
//                 {booking && <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">Confirmed</span>}
//               </div>

//               {booking ? (
//                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                   <div className="relative rounded-3xl overflow-hidden mb-8 h-72 shadow-lg">
//                     <img src={booking.roomId.imageUrl} className="w-full h-full object-cover" alt="Room" />
//                     <div className="absolute top-5 left-5 bg-white/95 backdrop-blur px-5 py-2.5 rounded-2xl text-indigo-600 font-black shadow-xl">
//                       ₹{booking.roomId.price}<span className="text-[10px] text-slate-400 font-medium">/mo</span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div className="flex items-center gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
//                       <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Calendar size={20} /></div>
//                       <div>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stay Duration</p>
//                         <p className="text-sm font-bold text-slate-700">
//                           {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
//                       <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><Home size={20} /></div>
//                       <div>
//                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property</p>
//                         <p className="text-sm font-bold text-slate-700">{booking.roomId.propertyType} #{booking.roomId.houseNumber}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8 flex items-start gap-4">
//                     <div className="mt-1 text-indigo-600"><MapPin size={22} /></div>
//                     <div>
//                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Address</p>
//                       <p className="text-sm font-semibold text-slate-700 leading-snug">
//                         {booking.roomId.address}, <span className="text-indigo-600">{booking.roomId.location}</span>
//                       </p>
//                     </div>
//                   </div>

//                   {/* COMPLAINT FORM (Only if booked) */}
//                   <div className="border-t border-slate-100 pt-8 mt-4">
//                     <div className="flex items-center gap-2 mb-6">
//                       <AlertCircle size={20} className="text-orange-500" />
//                       <h4 className="font-bold text-slate-800">Report an Issue</h4>
//                     </div>
                    
//                     <form onSubmit={handleComplaintSubmit} className="space-y-4">
//                       <input 
//                         type="text"
//                         placeholder="Subject (e.g., Plumbing, Electricity)"
//                         value={complaintForm.title}
//                         onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-medium"
//                       />
//                       <textarea 
//                         placeholder="Describe your concern..."
//                         rows="3"
//                         value={complaintForm.message}
//                         onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
//                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm font-medium"
//                       ></textarea>
//                       <button 
//                         type="submit"
//                         disabled={complaintStatus.loading}
//                         className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
//                           complaintStatus.success 
//                           ? 'bg-emerald-100 text-emerald-600' 
//                           : 'bg-slate-900 text-white hover:bg-slate-800'
//                         }`}
//                       >
//                         {complaintStatus.success ? (
//                           <><CheckCircle size={18} /> Complaint Sent Successfully</>
//                         ) : (
//                           <><Send size={18} /> {complaintStatus.loading ? "Sending..." : "Submit Complaint"}</>
//                         )}
//                       </button>
//                     </form>
//                   </div>

//                   <button onClick={handleCancelBooking} className="w-full mt-6 py-4 text-red-500 font-bold hover:underline transition-all flex items-center justify-center gap-2 text-sm">
//                     <Trash2 size={16} /> Cancel My Reservation
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center py-16">
//                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
//                     <Info className="text-slate-300" size={32} />
//                   </div>
//                   <p className="text-slate-400 font-medium">You have no active bookings at the moment.</p>
//                   <Link to="/" className="mt-4 inline-block text-indigo-600 font-bold text-sm hover:underline">Explore Properties →</Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* EDIT MODAL (GLASGOW DESIGN) */}
//       {editOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-md" onClick={() => setEditOpen(false)}></div>
//           <div className="relative bg-white/70 backdrop-blur-3xl border border-white/40 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300 ring-1 ring-white/50">
//             <button onClick={() => setEditOpen(false)} className="absolute right-8 top-8 text-slate-400 hover:text-slate-800"><X size={24} /></button>
//             <div className="flex flex-col items-center">
//               <h2 className="text-2xl font-black mb-8 text-slate-800">Update Profile</h2>
//               <div className="relative mb-8 group cursor-pointer">
//                 <input type="file" id="modal-upload" hidden onChange={handleImageChange} />
//                 <label htmlFor="modal-upload" className="block relative">
//                   <div className="w-28 h-28 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-2xl">
//                     <img src={previewUrl || (user.profile ? `http://localhost:4000/uploads/${user.profile}` : "https://via.placeholder.com/150")} className="w-full h-full object-cover" alt="Preview" />
//                   </div>
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"><Camera className="text-white" /></div>
//                 </label>
//               </div>
//               <div className="w-full space-y-4">
//                 <input 
//                   value={user.username} 
//                   onChange={(e) => setUser({ ...user, username: e.target.value })} 
//                   placeholder="Username"
//                   className="w-full bg-white/50 border border-white p-4 rounded-2xl focus:bg-white outline-none transition-all shadow-sm"
//                 />
//                 <input 
//                   type="password" 
//                   placeholder="New Password" 
//                   onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} 
//                   className="w-full bg-white/50 border border-white p-4 rounded-2xl focus:bg-white outline-none transition-all shadow-sm"
//                 />
//                 <input 
//                   type="password" 
//                   placeholder="Confirm Password" 
//                   onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
//                   className="w-full bg-white/50 border border-white p-4 rounded-2xl focus:bg-white outline-none transition-all shadow-sm"
//                 />
//                 <button onClick={handleUpdateProfile} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all mt-6">
//                   Confirm Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;



// import React, { useEffect, useState } from "react";
// import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
// import { MapPin, Search, Calendar, X, Home, IndianRupee, Info, Camera } from 'lucide-react';
// import { Link } from "react-router-dom";

// const Explore = () => {
//   const [location, setLocation] = useState("");
//   const [price, setPrice] = useState("");
//   const [type, setType] = useState("");
//   const [search, setSearch] = useState("");
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [bookingDate, setBookingDate] = useState("");

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     const res = await getAllRoomsAPI();
//     if (res?.status === 200) {
//       setRooms(res.data);
//     }
//   };

//   const filteredRooms = rooms
//     .filter((r) => search ? r.houseNumber?.toLowerCase().includes(search.toLowerCase()) : true)
//     .filter((r) => (location ? r.location === location : true))
//     .filter((r) => (type ? r.propertyType === type : true))
//     .filter((r) => r.status === "Available");

//   const handleBookRoom = async () => {
//     const user = JSON.parse(sessionStorage.getItem("existingUser"));
//     if (!user) { alert("Please login to book a room"); return; }
//     if (!bookingDate) { alert("Please select a start date"); return; }

//     const res = await createBookingAPI({
//       roomId: selectedRoom._id,
//       startDate: bookingDate,
//     });

//     if (res?.status === 200 || res?.status === 201) {
//       setSelectedRoom(null);
//       setBookingDate("");
//       fetchRooms();
//     } else {
//       alert("Booking failed");
//     }
//   };

//   return (
//     <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">
      
//       {/* HERO SECTION (PRESERVED) */}
//       <div className="relative w-full h-[100vh] overflow-hidden">
//         <img
//           src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/273425581.jpg?k=a6d2047f5441875a00f177b8784fe31fded7b366ce70f413eb0ca586f682cf57&o="
//           className="absolute inset-0 w-full h-full object-cover"
//           alt="Explore"
//         />
//         <div className="absolute inset-0 bg-black/50" />
//         <div className="relative z-20 flex items-center justify-center h-full">
//           <h1 className="text-white text-5xl md:text-6xl font-bold">Explore the Best</h1>
//         </div>
//       </div>

//       {/* FILTER BAR */}
//       <div className="container mx-auto px-6 -mt-16 relative z-30">
//         <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-[#D4AF37] grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text" placeholder="Search..." value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-xl outline-none text-sm"
//             />
//           </div>
//           <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm">
//             <option value="">All Locations</option>
//             <option>Kochi</option><option>Bangalore</option><option>Chennai</option>
//           </select>
//           <select value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm">
//             <option value="">Any Price</option>
//             <option value="5000-10000">₹5k - ₹10k</option>
//           </select>
//           <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm">
//             <option value="">All Types</option>
//             <option>Villa</option><option>Flat</option>
//           </select>
//         </div>
//       </div>

//       {/* ROOM GRID */}
//       <div className="container mx-auto px-6 mt-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {filteredRooms.map((room) => (
//             <div key={room._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
//               <div className="relative h-48">
//                 <img src={room.imageUrl} className="w-full h-full object-cover" alt="" />
//                 <div className="absolute top-3 left-3 bg-black/70 text-[#D4AF37] px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">
//                   {room.propertyType}
//                 </div>
//               </div>
//               <div className="p-5">
//                 <h3 className="text-lg font-bold text-gray-800">{room.houseNumber}</h3>
//                 <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin size={12} className="text-[#D4AF37]"/> {room.location}</p>
//                 <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-50">
//                    <p className="text-lg font-bold text-gray-900">₹{room.price}</p>
//                    <button onClick={() => setSelectedRoom(room)} className="bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-4 py-2 rounded-lg text-xs font-bold transition-all">
//                      ENQUIRE
//                    </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ======================
//           EXPANDED ENQUIRE MODAL
//       ====================== */}
//       {selectedRoom && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            
//             <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              
//               {/* LEFT: IMAGE GALLERY SECTION */}
//               <div className="md:w-1/2 bg-gray-100 relative">
//                 <img src={selectedRoom.imageUrl} className="w-full h-64 md:h-full object-cover" alt="Main" />
                
//                 {/* Thumbnail Strip for uploadedImg */}
//                 <div className="absolute bottom-4 left-0 right-0 px-4">
//                     <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                         {selectedRoom.uploadedImg && selectedRoom.uploadedImg.map((img, index) => (
//                             <img key={index} src={img} className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-lg flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" alt="gallery" />
//                         ))}
//                     </div>
//                 </div>

//                 <button onClick={() => setSelectedRoom(null)} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full md:hidden">
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* RIGHT: DETAILS SECTION */}
//               <div className="md:w-1/2 p-8 relative">
//                 <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hidden md:block">
//                   <X size={24} />
//                 </button>

//                 <div className="mb-6">
//                   <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
//                     {selectedRoom.propertyType}
//                   </span>
//                   <h2 className="text-3xl font-bold text-gray-800 mt-3">{selectedRoom.houseNumber}</h2>
//                   <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
//                     <MapPin size={14} className="text-[#D4AF37]" /> {selectedRoom.location}
//                   </p>
//                 </div>

//                 <div className="space-y-4 mb-8">
//                   <div className="bg-gray-50 p-4 rounded-2xl">
//                     <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Full Address</p>
//                     <p className="text-xs text-gray-600 leading-relaxed">{selectedRoom.address}</p>
//                   </div>

//                   <div className="flex justify-between items-center bg-[#fdfaf0] p-4 rounded-2xl border border-[#D4AF37]/20">
//                     <div>
//                       <p className="text-[10px] uppercase text-[#D4AF37] font-bold">Monthly Rent</p>
//                       <p className="text-xl font-black text-gray-900">₹{selectedRoom.price}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] uppercase text-gray-400 font-bold">Status</p>
//                       <p className="text-xs font-bold text-green-600">{selectedRoom.status}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <label className="text-[10px] uppercase text-gray-400 font-bold ml-1">Proposed Start Date</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="date"
//                       value={bookingDate}
//                       onChange={(e) => setBookingDate(e.target.value)}
//                       className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm font-bold"
//                     />
//                   </div>
                  
//                   <Link to="/payment">
//                     <button
//                       onClick={handleBookRoom}
//                       className="w-full bg-black text-[#D4AF37] py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-[#D4AF37] hover:text-black transition-all mt-4"
//                     >
//                       Confirm Booking
//                     </button>
//                   </Link>
//                   <p className="text-[10px] text-center text-gray-400 mt-4">By clicking confirm, you agree to the luxury rental terms.</p>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Explore;





// import React, { useEffect, useState } from "react";
// import { Trash2, Search, User, Mail, ShieldAlert, Loader2 } from "lucide-react";
// import { getAllUsersAPI, deleteUserAPI } from "@/services/allApis";
// import { toast } from "react-toastify";

// const UsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllUsersAPI();
//       if (res?.status === 200) {
//         setUsers(res.data);
//       }
//     } catch (err) {
//       console.error("Server error", err);
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Permanent Action: Are you sure you want to delete this user?")) return;

//     try {
//       const res = await deleteUserAPI(id);
//       if (res?.status === 200) {
//         toast.success("User removed from records");
//         setUsers((prev) => prev.filter((u) => u._id !== id));
//       }
//     } catch (err) {
//       toast.error("System error during deletion");
//     }
//   };

//   const filteredUsers = users.filter(
//     (u) =>
//       u.username?.toLowerCase().includes(search.toLowerCase()) ||
//       u.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="p-10 bg-[#FDFCFB] min-h-screen">
//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//         <div>
//           <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">
//             System Administration
//           </h2>
//           <h1 className="text-5xl font-bold text-[#1A1A1A] tracking-tighter">
//             User Directory
//           </h1>
//         </div>

//         {/* STYLISH SEARCH BAR */}
//         <div className="relative group w-full md:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={18} />
//           <input
//             type="text"
//             placeholder="Search credentials..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-white border border-[#F2EDE4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all shadow-sm"
//           />
//         </div>
//       </div>

//       {/* DATA TABLE */}
//       <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="p-20 flex flex-col items-center justify-center text-gray-400">
//             <Loader2 className="animate-spin mb-4 text-[#C5A059]" size={32} />
//             <p className="text-[10px] font-black uppercase tracking-widest">Accessing Database...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-[#FDF9F0]/50 border-b border-[#F2EDE4]">
//                   <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Member Profile</th>
//                   <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Contact Information</th>
//                   <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-center">Status</th>
//                   <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-[#F2EDE4]">
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <tr key={user._id} className="hover:bg-[#FDFCFB] transition-colors group">
//                       {/* USER INFO */}
//                       <td className="p-6">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div className="w-12 h-12 rounded-2xl border border-[#F2EDE4] overflow-hidden bg-[#FDF9F0] flex items-center justify-center">
//                               {user.profile ? (
//                                 <img
//                                   src={`http://localhost:4000/uploads/${user.profile}`}
//                                   className="w-full h-full object-cover"
//                                   alt=""
//                                 />
//                               ) : (
//                                 <User className="text-[#C5A059]/40" size={20} />
//                               )}
//                             </div>
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//                           </div>
//                           <div>
//                             <p className="font-bold text-[#1A1A1A] text-base">{user.username}</p>
//                             <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-tighter">Verified Member</p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* EMAIL */}
//                       <td className="p-6">
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <Mail size={14} className="text-[#C5A059]/60" />
//                           <span className="text-sm font-medium">{user.email}</span>
//                         </div>
//                       </td>

//                       {/* STATUS TAG */}
//                       <td className="p-6 text-center">
//                         <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide">
//                           Active
//                         </span>
//                       </td>

//                       {/* DELETE ACTION */}
//                       <td className="p-6 text-right">
//                         <button
//                           onClick={() => handleDelete(user._id)}
//                           className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
//                           title="Revoke Access"
//                         >
//                           <Trash2 size={18} strokeWidth={2} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="p-20 text-center">
//                       <div className="flex flex-col items-center opacity-40">
//                         <ShieldAlert size={48} className="mb-4 text-[#C5A059]" />
//                         <p className="text-[10px] font-black uppercase tracking-widest">No matching records found</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* FOOTER STATS */}
//       <div className="mt-8 flex justify-between items-center px-4">
//         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//           Total Registered Users: <span className="text-[#C5A059]">{filteredUsers.length}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;


// import React, { useEffect, useState, useMemo } from "react";
// import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
// import { MapPin, Search, Calendar, X, IndianRupee } from 'lucide-react';
// import { Link } from "react-router-dom";

// const Explore = () => {
//   // State from code 1 & 2
//   const [rooms, setRooms] = useState([]);
//   const [search, setSearch] = useState("");
//   const [location, setLocation] = useState("");
//   const [type, setType] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [bookingDate, setBookingDate] = useState("");

//   /* =========================
//       FETCH DATA
//   ========================= */
//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     const res = await getAllRoomsAPI();
//     if (res?.status === 200) {
//       setRooms(res.data);
//     }
//   };

//   /* =========================
//       DYNAMIC FILTER OPTIONS
//   ========================= */
//   const locations = useMemo(
//     () => [...new Set(rooms.map((r) => r.location).filter(Boolean))],
//     [rooms]
//   );

//   const propertyTypes = useMemo(
//     () => [...new Set(rooms.map((r) => r.propertyType).filter(Boolean))],
//     [rooms]
//   );

//   /* =========================
//       FILTER LOGIC (Combined)
//   ========================= */
//   const filteredRooms = rooms.filter((room) => {
//     if (room.status !== "Available") return false;

//     if (search && !room.houseNumber?.toLowerCase().includes(search.toLowerCase()))
//       return false;

//     if (location && room.location !== location) return false;

//     if (type && room.propertyType !== type) return false;

//     if (maxPrice && Number(room.price) > Number(maxPrice)) return false;

//     return true;
//   });

//   /* =========================
//       BOOKING LOGIC
//   ========================= */
//   const handleBookRoom = async () => {
//     const user = JSON.parse(sessionStorage.getItem("existingUser"));
//     if (!user) {
//       alert("Please login to book a room");
//       return;
//     }

//     if (!bookingDate) {
//       alert("Please select a start date");
//       return;
//     }

//     const res = await createBookingAPI({
//       roomId: selectedRoom._id,
//       startDate: bookingDate,
//     });

//     if (res?.status === 200 || res?.status === 201) {
//       setSelectedRoom(null);
//       setBookingDate("");
//       fetchRooms();
//     } else {
//       alert("Booking failed");
//     }
//   };

//   return (
//     <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">
      
//       {/* HERO SECTION */}
//       <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
//         <img
//           src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/273425581.jpg?k=a6d2047f5441875a00f177b8784fe31fded7b366ce70f413eb0ca586f682cf57&o="
//           className="absolute inset-0 w-full h-full object-cover"
//           alt="Luxury Estate"
//         />
//         <div className="absolute inset-0 bg-black/40" />
//         <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
//           <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase">
//             Curated <span className="text-[#D4AF37]">Stays</span>
//           </h1>
//           <p className="text-white/80 mt-4 font-medium tracking-widest text-xs md:text-sm uppercase">Experience luxury living in prime locations</p>
//         </div>
//       </div>

//       {/* FILTER BAR */}
//       <div className="container mx-auto px-6 -mt-12 relative z-30">
//         <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text" placeholder="Search house..." value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
//             />
//           </div>

//           <select 
//             value={location} 
//             onChange={(e) => setLocation(e.target.value)} 
//             className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium border-none cursor-pointer"
//           >
//             <option value="">All Locations</option>
//             {locations.map((loc) => (
//               <option key={loc} value={loc}>{loc}</option>
//             ))}
//           </select>

//           <select 
//             value={type} 
//             onChange={(e) => setType(e.target.value)} 
//             className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium border-none cursor-pointer"
//           >
//             <option value="">All Types</option>
//             {propertyTypes.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>

//           <div className="relative">
//             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
//             <input
//               type="number" placeholder="Max Budget" value={maxPrice}
//               onChange={(e) => setMaxPrice(e.target.value)}
//               className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ROOM GRID */}
//       <div className="container mx-auto px-6 mt-20">
//         {filteredRooms.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {filteredRooms.map((room) => (
//               <div key={room._id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
//                 <div className="relative h-56 overflow-hidden">
//                   <img 
//                     src={room.imageUrl} 
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//                     alt={room.houseNumber} 
//                   />
//                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
//                     {room.propertyType}
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-black text-gray-800 tracking-tight">{room.houseNumber}</h3>
//                   <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 font-medium italic">
//                     <MapPin size={12} className="text-[#D4AF37]"/> {room.location}
//                   </p>
//                   <div className="mt-6 flex justify-between items-center pt-5 border-t border-gray-50">
//                      <p className="text-xl font-black text-gray-900 tracking-tighter">₹{room.price}<span className="text-[10px] text-gray-400 font-medium">/mo</span></p>
//                      <button 
//                        onClick={() => setSelectedRoom(room)} 
//                        className="bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-black/5 uppercase"
//                      >
//                        Enquire
//                      </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-20">
//             <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">No properties match your selection</p>
//           </div>
//         )}
//       </div>

//       {/* ENQUIRE MODAL */}
//       {selectedRoom && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
//             <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              
//               {/* LEFT: IMAGE SECTION */}
//               <div className="md:w-1/2 bg-gray-100 relative">
//                 <img src={selectedRoom.imageUrl} className="w-full h-64 md:h-full object-cover" alt="Main" />
//                 <button onClick={() => setSelectedRoom(null)} className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full md:hidden">
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* RIGHT: DETAILS SECTION */}
//               <div className="md:w-1/2 p-10 relative">
//                 <button onClick={() => setSelectedRoom(null)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors hidden md:block">
//                   <X size={24} />
//                 </button>

//                 <div className="mb-8">
//                   <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20">
//                     {selectedRoom.propertyType}
//                   </span>
//                   <h2 className="text-4xl font-black text-gray-900 mt-4 tracking-tighter">{selectedRoom.houseNumber}</h2>
//                   <p className="text-gray-400 text-sm flex items-center gap-2 mt-2 font-medium">
//                     <MapPin size={16} className="text-[#D4AF37]" /> {selectedRoom.location}
//                   </p>
//                 </div>

//                 <div className="space-y-6 mb-10">
//                   <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
//                     <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-2">Location Address</p>
//                     <p className="text-sm text-gray-600 leading-relaxed font-medium">{selectedRoom.address}</p>
//                   </div>

//                   <div className="flex justify-between items-center bg-[#fdfaf0] p-6 rounded-3xl border border-[#D4AF37]/10">
//                     <div>
//                       <p className="text-[10px] uppercase text-[#D4AF37] font-black tracking-widest">Monthly Investment</p>
//                       <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{selectedRoom.price}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">Status</p>
//                       <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">{selectedRoom.status}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <label className="text-[10px] uppercase text-gray-400 font-black tracking-widest ml-1">Proposed Commencement</label>
//                   <div className="relative">
//                     <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                       type="date"
//                       value={bookingDate}
//                       onChange={(e) => setBookingDate(e.target.value)}
//                       className="w-full pl-14 pr-5 py-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm font-bold border-none"
//                     />
//                   </div>
                  
//                   <Link to="/payment" className="block">
//                     <button
//                       onClick={handleBookRoom}
//                       className="w-full bg-black text-[#D4AF37] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 hover:bg-[#D4AF37] hover:text-black transition-all mt-4"
//                     >
//                       Confirm Booking
//                     </button>
//                   </Link>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Explore;