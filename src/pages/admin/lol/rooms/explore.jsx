import React, { useEffect, useState } from "react";
import { getAllRoomsAPI, createBookingAPI } from "@/services/allApis";
import {
  MapPin,
  Search,
  Calendar,
  X,
  User
} from "lucide-react";

const Explore = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState("");

  /* ======================
     FETCH ROOMS
  ====================== */
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await getAllRoomsAPI();
    if (res?.status === 200) {
      setRooms(res.data);
    }
  };

  /* ======================
     DYNAMIC FILTER DATA
  ====================== */
  const locations = [...new Set(rooms.map(r => r.location))];
  const propertyTypes = [...new Set(rooms.map(r => r.propertyType))];

  /* ======================
     FILTER LOGIC
  ====================== */
  const filteredRooms = rooms
    .filter(r =>
      search
        ? r.houseNumber?.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter(r => (location ? r.location === location : true))
    .filter(r => (type ? r.propertyType === type : true))
    .filter(r => {
      if (!price) return true;
      const [min, max] = price.split("-").map(Number);
      return r.price >= min && r.price <= max;
    })
    .filter(r => r.status === "Available");

  /* ======================
     BOOK ROOM
  ====================== */
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
      alert("Room booked successfully");
      setSelectedRoom(null);
      setBookingDate("");
      fetchRooms();
    } else {
      alert("Booking failed");
    }
  };

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen pb-20">

      {/* HERO */}
      <div className="relative w-full h-[100vh]">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/273425581.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 flex items-center justify-center h-full">
          <h1 className="text-white text-6xl font-bold">Explore Rooms</h1>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="container mx-auto px-6 -mt-16 relative z-30">
        <div className="bg-white p-6 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search house number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-50 rounded-xl outline-none text-sm"
            />
          </div>

          {/* LOCATION */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm"
          >
            <option value="">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>

          {/* PRICE */}
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm"
          >
            <option value="">Any Price</option>
            <option value="5000-10000">₹5k - ₹10k</option>
            <option value="10000-20000">₹10k - ₹20k</option>
            <option value="20000-50000">₹20k+</option>
          </select>

          {/* TYPE */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl outline-none text-sm"
          >
            <option value="">All Types</option>
            {propertyTypes.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRooms.map(room => (
            <div
              key={room._id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all"
            >
              <img
                src={room.imageUrl}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-lg">{room.houseNumber}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin size={14} /> {room.location}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-lg">₹{room.price}</p>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="bg-black text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    ENQUIRE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedRoom.houseNumber}</h2>
            <p className="text-gray-400 mb-4">{selectedRoom.location}</p>

            <label className="block text-sm font-bold mb-2">
              Select Start Date
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl mb-4"
            />

            <button
              onClick={handleBookRoom}
              className="w-full bg-black text-yellow-400 py-3 rounded-xl font-bold"
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
