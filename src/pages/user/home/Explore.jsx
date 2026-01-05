import React, { useEffect, useState, useMemo } from "react";
import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
import {
  MapPin,
  Search,
  Calendar,
  X,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================
   ENV CONFIG
========================= */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_URL = `${BASE_URL}/uploads`;

/* =========================
   IMAGE HELPER
========================= */
const getImageSrc = (img) => {
  if (!img) {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }

  if (img.startsWith("http")) return img;

  return `${UPLOADS_URL}/${img.replace(/^uploads\//, "")}`;
};

const Explore = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [activeImage, setActiveImage] = useState("");

  /* =========================
      FETCH ROOMS
  ========================= */
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await getAllRoomsAPI();
    if (res?.status === 200) {
      setRooms(res.data || []);
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
      OPEN MODAL
  ========================= */
  const openEnquiry = (room) => {
    setSelectedRoom(room);
    setActiveImage(getImageSrc(room.imageUrl));
  };

  /* =========================
      BOOK ROOM
  ========================= */
  const handleBookRoom = async () => {
    const user = JSON.parse(sessionStorage.getItem("existingUser"));

    if (!user) {
      alert("Please login to continue");
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
      navigate("/payment"); // ✅ navigate ONLY on success
    } else {
      alert(res?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">

      {/* HERO */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/273425581.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-white text-6xl font-black uppercase">
            Curated <span className="text-[#D4AF37]">Stays</span>
          </h1>
        </div>
      </div>

      {/* FILTERS */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-6 rounded-[2rem] shadow-lg grid md:grid-cols-4 gap-4">
          <input
            placeholder="Search house"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-4 bg-gray-50 rounded-2xl"
          />

          <select value={location} onChange={(e) => setLocation(e.target.value)} className="p-4 bg-gray-50 rounded-2xl">
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} className="p-4 bg-gray-50 rounded-2xl">
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max Budget"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-4 bg-gray-50 rounded-2xl"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-6 mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredRooms.map((room) => (
          <div key={room._id} className="bg-white rounded-3xl overflow-hidden shadow-md">
            <img src={getImageSrc(room.imageUrl)} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-black">{room.houseNumber}</h3>
              <p className="text-gray-400 flex items-center gap-1">
                <MapPin size={14} /> {room.location}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <p className="font-black text-lg">₹{room.price}</p>
                <button
                  onClick={() => openEnquiry(room)}
                  className="bg-black text-[#D4AF37] px-4 py-2 rounded-xl text-xs uppercase font-black"
                >
                  Enquire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-8 relative">
            <button onClick={() => setSelectedRoom(null)} className="absolute top-6 right-6">
              <X />
            </button>

            <img src={activeImage} className="w-full h-80 object-cover rounded-2xl mb-6" />

            <h2 className="text-3xl font-black">{selectedRoom.houseNumber}</h2>

            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full mt-6 p-4 bg-gray-50 rounded-2xl"
            />

            <button
              onClick={handleBookRoom}
              className="w-full mt-6 bg-black text-[#D4AF37] py-4 rounded-2xl uppercase font-black"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
