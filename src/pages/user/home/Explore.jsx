import React, { useEffect, useState, useMemo } from "react";
import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
import { MapPin, Search, Calendar, X, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";

// Base URL for local uploads
const UPLOADS_URL = "http://localhost:4000/uploads";

/* =========================
   IMAGE HELPER (INTEGRATED)
========================= */
const getImageSrc = (img) => {
  if (!img) {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }

  const cleanImg = img.trim();

  if (cleanImg.startsWith("http")) {
    return cleanImg;
  }

  return `${UPLOADS_URL}/${cleanImg.replace(/^uploads\//, "")}`;
};


const Explore = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  
  // New state for modal gallery
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await getAllRoomsAPI();
    if (res?.status === 200) {
      setRooms(res.data || []);
    }
  };

  // Helper to open modal and set initial image with path resolution
  const openEnquiry = (room) => {
    setSelectedRoom(room);
    setActiveImage(getImageSrc(room.imageUrl)); // Set initial view to thumbnail
  };

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

  const handleBookRoom = async () => {
    const user = JSON.parse(sessionStorage.getItem("existingUser"));
    if (!user) {
      alert("Please login to book a room");
      return;
    }
    if (!bookingDate) {
      alert("Please select a start date");
      return;
    }

    const res = await createBookingAPI({
      roomId: selectedRoom._id,
      startDate: bookingDate,
    });

    if (res?.status === 200 || res?.status === 201) {
      setSelectedRoom(null);
      setBookingDate("");
      fetchRooms();
    } else {
      alert("Booking failed");
    }
  };

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
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
          <p className="text-white/80 mt-4 font-medium tracking-widest text-xs md:text-sm uppercase">Experience luxury living in prime locations</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="container mx-auto px-6 -mt-12 relative z-30">
        <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text" placeholder="Search house..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>

          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium border-none cursor-pointer">
            <option value="">All Locations</option>
            {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium border-none cursor-pointer">
            <option value="">All Types</option>
            {propertyTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>

          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
            <input
              type="number" placeholder="Max Budget" value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ROOM GRID */}
      <div className="container mx-auto px-6 mt-20">
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredRooms.map((room) => (
              <div key={room._id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  {/* Thumbnail Image Logic */}
                  <img src={getImageSrc(room.imageUrl)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.houseNumber} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                    {room.propertyType}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-800 tracking-tight">{room.houseNumber}</h3>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-1 font-medium italic">
                    <MapPin size={12} className="text-[#D4AF37]"/> {room.location}
                  </p>
                  <div className="mt-6 flex justify-between items-center pt-5 border-t border-gray-50">
                     <p className="text-xl font-black text-gray-900 tracking-tighter">₹{room.price}<span className="text-[10px] text-gray-400 font-medium">/mo</span></p>
                     <button onClick={() => openEnquiry(room)} className="bg-black text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-black/5 uppercase">
                       Enquire
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">No properties match your selection</p>
          </div>
        )}
      </div>

      {/* ENQUIRE MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
              
              {/* LEFT: IMAGE GALLERY SECTION */}
              <div className="md:w-3/5 bg-gray-100 flex flex-col p-4 gap-4">
                {/* Main Large Image */}
                <div className="relative flex-1 rounded-[2rem] overflow-hidden bg-black flex items-center justify-center min-h-[300px] md:min-h-0">
                  <img 
                    src={activeImage} 
                    className="w-full h-full object-cover transition-all duration-500" 
                    alt="Property View" 
                  />
                  <button onClick={() => setSelectedRoom(null)} className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full md:hidden">
                    <X size={20} />
                  </button>
                </div>

                {/* Thumbnails Row (Pagination logic) */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                  {/* Thumbnail 1: Main Photo */}
                  <div 
                    onClick={() => setActiveImage(getImageSrc(selectedRoom.imageUrl))}
                    className={`relative w-24 h-20 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === getImageSrc(selectedRoom.imageUrl) ? 'border-[#D4AF37] scale-95 shadow-lg' : 'border-transparent opacity-60'}`}
                  >
                    <img src={getImageSrc(selectedRoom.imageUrl)} className="w-full h-full object-cover" alt="Main Thumb" />
                  </div>

                  {/* Other Uploaded Images Logic */}
                  {selectedRoom.uploadedImg?.length > 0 && selectedRoom.uploadedImg.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveImage(getImageSrc(img))}
                      className={`relative w-24 h-20 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImage === getImageSrc(img) ? 'border-[#D4AF37] scale-95 shadow-lg' : 'border-transparent opacity-60'}`}
                    >
                      <img src={getImageSrc(img)} className="w-full h-full object-cover" alt={`Uploaded Thumb ${idx}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: DETAILS SECTION */}
              <div className="md:w-2/5 p-8 relative">
                <button onClick={() => setSelectedRoom(null)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors hidden md:block">
                  <X size={24} />
                </button>

                <div className="mb-6">
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/20">
                    {selectedRoom.propertyType}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mt-4 tracking-tighter">{selectedRoom.houseNumber}</h2>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-2 font-medium">
                    <MapPin size={16} className="text-[#D4AF37]" /> {selectedRoom.location}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">Location Address</p>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{selectedRoom.address}</p>
                  </div>

                  <div className="flex justify-between items-center bg-[#fdfaf0] p-5 rounded-3xl border border-[#D4AF37]/10">
                    <div>
                      <p className="text-[10px] uppercase text-[#D4AF37] font-black tracking-widest">Monthly Investment</p>
                      <p className="text-xl font-black text-gray-900 tracking-tighter">₹{selectedRoom.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest">Status</p>
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">{selectedRoom.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase text-gray-400 font-black tracking-widest ml-1">Proposed Commencement</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm font-bold border-none"
                    />
                  </div>
                  
                  <Link to="/payment" className="block">
                    <button
                      onClick={handleBookRoom}
                      className="w-full bg-black text-[#D4AF37] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 hover:bg-[#D4AF37] hover:text-black transition-all mt-2"
                    >
                      Confirm Booking
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