import React, { useEffect, useState, useMemo } from "react";
import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
import { MapPin, Search, Calendar, X, IndianRupee, Sparkles } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

/* =========================
    ENV CONFIG
========================= */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_URL = `${BASE_URL}/uploads`;

/* =========================
    IMAGE HELPER
========================= */
const getImageSrc = (img) => {
  if (!img) return "https://via.placeholder.com/400x300?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${UPLOADS_URL}/${img.replace(/^uploads\//, "")}`;
};

const Explore = () => {
  const navigate = useNavigate();

  /* =========================
      STATE
  ========================= */
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
      FETCH ROOMS
  ========================= */
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getAllRoomsAPI();
      if (res?.status === 200) {
        setRooms(res.data || []);
      }
    } catch (err) {
      console.error("Fetch rooms failed", err);
    }
  };

  /* =========================
      FILTER HELPERS
  ========================= */
  const locations = useMemo(
    () => [...new Set(rooms.map((r) => r.location).filter(Boolean))],
    [rooms]
  );

  const propertyTypes = useMemo(
    () => [...new Set(rooms.map((r) => r.propertyType).filter(Boolean))],
    [rooms]
  );

  const filteredRooms = rooms.filter((room) => {
    if (room.status !== "Available") return false;
    if (search && !room.houseNumber?.toLowerCase().includes(search.toLowerCase())) return false;
    if (location && room.location !== location) return false;
    if (type && room.propertyType !== type) return false;
    if (maxPrice && Number(room.price) > Number(maxPrice)) return false;
    return true;
  });

  /* =========================
      MODAL HANDLERS
  ========================= */
  const openEnquiry = (room) => {
    setSelectedRoom(room);
    setActiveImage(getImageSrc(room.imageUrl));
    setBookingDate("");
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setActiveImage("");
    setBookingDate("");
    setLoading(false);
  };

  /* =========================
      BOOKING LOGIC (ALERTS ONLY)
  ========================= */
  const handleBookRoom = async () => {
    if (loading) return;

    const user = JSON.parse(sessionStorage.getItem("existingUser"));
    const token = sessionStorage.getItem("token");

    if (!user || !token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    if (!bookingDate) {
      alert("Please select a date");
      return;
    }

    setLoading(true);

    try {
      const res = await createBookingAPI({ 
        roomId: selectedRoom._id, 
        startDate: bookingDate 
      });

      if (res?.status === 201 || res?.status === 200) {
        closeModal();
        fetchRooms(); // Refresh the list to reflect "Unavailable" status if needed
      } else {
        alert(res?.data?.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20 font-sans text-gray-900">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/273425581.jpg?k=a6d2047f5441875a00f177b8784fe31fded7b366ce70f413eb0ca586f682cf57&o="
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Estate"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Curated <span className="text-[#D4AF37]">Stays</span>
          </h1>
          <p className="text-white/80 mt-4 font-medium tracking-widest text-xs uppercase">Experience luxury living in prime locations</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="container mx-auto px-6 -mt-14 relative z-20">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Property Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
          />
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm">
            <option value="">All Locations</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm">
            <option value="">All Types</option>
            {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            placeholder="Max Budget"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm"
          />
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRooms.map((room) => (
            <div key={room._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative h-56 overflow-hidden">
                <img src={getImageSrc(room.imageUrl)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={room.houseNumber} />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[8px] font-black uppercase">{room.propertyType}</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-800">{room.houseNumber}</h3>
                <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin size={12} /> {room.location}</p>
                <div className="mt-6 flex justify-between items-center">
                  <p className="font-black text-lg">₹{room.price}</p>
                  <button onClick={() => openEnquiry(room)} className="bg-black text-[#D4AF37] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Enquire</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ENQUIRE MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
              
              {/* LEFT: COMPACT GALLERY */}
              <div className="md:w-1/2 bg-gray-50 flex flex-col p-4 gap-4">
                <div className="relative h-64 md:h-full rounded-[1.5rem] overflow-hidden bg-black shadow-lg">
                  <img src={activeImage} className="w-full h-full object-cover" alt="Main" />
                  <button onClick={closeModal} className="absolute top-4 left-4 bg-white/20 p-2 rounded-full md:hidden"><X size={18}/></button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <img 
                    onClick={() => setActiveImage(getImageSrc(selectedRoom.imageUrl))}
                    src={getImageSrc(selectedRoom.imageUrl)} 
                    className={`w-16 h-12 rounded-lg object-cover cursor-pointer border-2 ${activeImage === getImageSrc(selectedRoom.imageUrl) ? 'border-[#D4AF37]' : 'border-transparent opacity-60'}`} 
                  />
                  {selectedRoom.uploadedImg?.map((img, idx) => (
                    <img 
                      key={idx} 
                      onClick={() => setActiveImage(getImageSrc(img))}
                      src={getImageSrc(img)} 
                      className={`w-16 h-12 rounded-lg object-cover cursor-pointer border-2 ${activeImage === getImageSrc(img) ? 'border-[#D4AF37]' : 'border-transparent opacity-60'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT: COMPACT DETAILS */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center relative">
                <button onClick={closeModal} className="absolute top-6 right-6 text-gray-300 hover:text-black hidden md:block"><X size={20} /></button>
                
                <div className="mb-4">
                  <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest">{selectedRoom.propertyType}</span>
                  <h2 className="text-2xl font-black text-gray-900 mt-1 tracking-tight">{selectedRoom.houseNumber}</h2>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin size={14} className="text-[#D4AF37]" /> {selectedRoom.location}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[9px] uppercase text-gray-400 font-bold mb-1">Address</p>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{selectedRoom.address || "Location details available on request."}</p>
                  </div>

                  <div className="flex justify-between items-center bg-[#fdfaf0] p-4 rounded-2xl border border-[#D4AF37]/10">
                    <p className="text-xl font-black text-gray-900">₹{selectedRoom.price} <span className="text-[10px] text-gray-400">/night</span></p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{selectedRoom.status}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase text-gray-400 font-black tracking-widest ml-1">Arrival Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm font-bold border-none"
                  />
                  <Link to="/payment">
                    <button
                      onClick={handleBookRoom}
                      disabled={loading}
                      className="w-full bg-black text-[#D4AF37] py-4 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 shadow-xl"
                    >
                      {loading ? "Processing..." : "Confirm Booking"}
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;