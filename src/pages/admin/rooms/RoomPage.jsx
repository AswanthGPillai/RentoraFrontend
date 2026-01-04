import React, { useEffect, useState } from "react";
import { MoreVertical, Pencil, Trash2, Plus, Search, MapPin, IndianRupee, Home, Filter, Loader2, X, Image as ImageIcon, Briefcase, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllRoomsAPI, deleteRoomAPI, updateRoomAPI } from "@/services/allApis";

const RoomPage = () => {
  const token = sessionStorage.getItem("token");

  const [rooms, setRooms] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ====================== FILTER STATES ====================== */
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const result = await getAllRoomsAPI();
      if (result.status === 200) setRooms(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (room.status === "Booked") {
      alert("Booked room cannot be deleted");
      return;
    }
    if (!confirm("Are you sure you want to delete this room?")) return;
    const res = await deleteRoomAPI(room._id, { Authorization: `Bearer ${token}` });
    if (res.status === 200) fetchRooms();
  };

  const handleUpdateRoom = async () => {
    const res = await updateRoomAPI(editingRoom._id, editingRoom, { Authorization: `Bearer ${token}` });
    if (res.status === 200) {
      fetchRooms();
      setEditingRoom(null);
    }
  };

  const locations = ["All", ...new Set(rooms.map((r) => r.location))];

  const filteredRooms = rooms.filter((r) =>
    `${r.houseNumber} ${r.location} ${r.address}`.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter === "All" || r.location === locationFilter) &&
    (availabilityFilter === "All" || r.status === availabilityFilter) &&
    (maxPrice ? r.price <= Number(maxPrice) : true)
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-[#FDFCFB]">
      <Loader2 className="animate-spin text-[#C5A059]" size={48} />
      <p className="text-[#C5A059] font-black tracking-[0.4em] text-[10px] uppercase">Refining Collection...</p>
    </div>
  );

  return (
    <div className="p-8 bg-[#FDFCFB] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">Portfolio Management</h2>
          <h1 className="text-5xl font-bold text-[#1A1A1A] tracking-tighter">Property Inventory</h1>
        </div>

        <Link to="/admin/addrooms">
          <button className="bg-[#1A1A1A] hover:bg-black text-white px-10 py-5 rounded-[2rem] flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-gray-300 group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
            List New Estate
          </button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* REFINED FILTER SUITE */}
        <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] p-8 shadow-sm flex flex-wrap lg:flex-nowrap gap-6 items-center">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors" size={18} />
            <input
              placeholder="Search by ID or Street..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-[#FDFCFB] border border-[#F2EDE4] rounded-2xl text-sm focus:outline-none focus:border-[#C5A059] transition-all"
            />
          </div>

          <div className="h-10 w-[1px] bg-[#F2EDE4] hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-[2]">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" size={16} />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-b border-[#F2EDE4] text-xs font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-[#C5A059]"
              >
                {locations.map((loc, i) => <option key={i} value={loc}>{loc === "All" ? "Everywhere" : loc}</option>)}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" size={16} />
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-b border-[#F2EDE4] text-xs font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-[#C5A059]"
              >
                <option value="All">Status: Any</option>
                <option value="Available">Available</option>
                <option value="Booked">Reserved</option>
              </select>
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" size={16} />
              <input
                type="number"
                placeholder="Max Budget"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-b border-[#F2EDE4] text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>

        {/* PROPERTY TABLE */}
        <div className="bg-white rounded-[3rem] border border-[#F2EDE4] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FDF9F0] border-b border-[#F2EDE4]">
                  <th className="p-8 text-[9px] font-black text-[#B48A30] uppercase tracking-[0.3em]">Listing Details</th>
                  <th className="p-8 text-[9px] font-black text-[#B48A30] uppercase tracking-[0.3em]">Address & Location</th>
                  <th className="p-8 text-[9px] font-black text-[#B48A30] uppercase tracking-[0.3em] text-center">Valuation</th>
                  <th className="p-8 text-[9px] font-black text-[#B48A30] uppercase tracking-[0.3em] text-center">Status</th>
                  <th className="p-8 text-[9px] font-black text-[#B48A30] uppercase tracking-[0.3em] text-center">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F6F1]">
                {filteredRooms.map((room) => (
                  <tr key={room._id} className="group hover:bg-[#FDFCFB] transition-all duration-300">
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="relative h-20 w-28 overflow-hidden rounded-2xl border border-[#F2EDE4] shadow-sm">
                           <img src={room.imageUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-[#1A1A1A] mb-1">Room {room.houseNumber}</p>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">
                            {room.propertyType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-800">{room.location}</p>
                        <p className="text-[11px] text-gray-400 font-medium max-w-[220px] leading-relaxed">{room.address}</p>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <p className="text-lg font-bold text-[#1A1A1A]">
                        <span className="text-[#C5A059] text-sm mr-1">₹</span>
                        {room.price.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Per Month</p>
                    </td>
                    <td className="p-8 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                        room.status === "Available" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-orange-50 text-orange-600 border border-orange-100"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${room.status === "Available" ? "bg-emerald-500" : "bg-orange-500"}`} />
                        {room.status}
                      </div>
                    </td>
                    <td className="p-8 text-center relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === room._id ? null : room._id)}
                        className="w-10 h-10 flex items-center justify-center mx-auto hover:bg-white rounded-full transition-all text-gray-400 border border-transparent hover:border-[#F2EDE4] hover:shadow-sm"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdown === room._id && (
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white border border-[#F2EDE4] shadow-2xl rounded-[1.5rem] w-48 z-20 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                          <button
                            disabled={room.status === "Booked"}
                            onClick={() => { setEditingRoom({ ...room }); setOpenDropdown(null); }}
                            className={`w-full px-6 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                              room.status === "Booked" ? "text-gray-200 cursor-not-allowed" : "text-gray-700 hover:bg-[#FDF9F0] hover:text-[#C5A059]"
                            }`}
                          >
                            <Pencil size={14} /> Update
                          </button>
                          <button
                            disabled={room.status === "Booked"}
                            onClick={() => { handleDeleteRoom(room); setOpenDropdown(null); }}
                            className={`w-full px-6 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-t border-[#F9F6F1] transition-colors ${
                              room.status === "Booked" ? "text-gray-200" : "text-red-400 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL (AS PROVIDED PREVIOUSLY) */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden border border-[#F2EDE4] animate-in zoom-in duration-300">
            
            {/* MODAL HEADER */}
            <div className="bg-[#FDF9F0] p-8 flex justify-between items-center border-b border-[#F2EDE4]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-[#C5A059]">
                  <Home size={24} />
                </div>
                <div>
                  <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-1">Property Management</h2>
                  <p className="text-2xl font-bold text-gray-800">Editing Room {editingRoom.houseNumber}</p>
                </div>
              </div>
              <button onClick={() => setEditingRoom(null)} className="p-3 hover:bg-white rounded-full text-gray-400 transition-all border border-transparent hover:border-[#F2EDE4]">
                <X size={24} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="grid grid-cols-1 lg:grid-cols-5 divide-x divide-gray-100">
              <div className="lg:col-span-3 p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Room Name</label>
                    <input
                      value={editingRoom.houseNumber}
                      onChange={(e) => setEditingRoom({ ...editingRoom, houseNumber: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</label>
                    <input
                      value={editingRoom.location}
                      onChange={(e) => setEditingRoom({ ...editingRoom, location: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl p-4 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</label>
                    <select
                      value={editingRoom.propertyType}
                      onChange={(e) => setEditingRoom({ ...editingRoom, propertyType: e.target.value })}
                      className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl p-4 text-sm focus:outline-none"
                    >
                      <option>Villa</option>
                      <option>Flat</option>
                      <option>Studio</option>
                      <option>Single House</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Rent</label>
                    <input
                      type="number"
                      value={editingRoom.price}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) })}
                      className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl p-4 text-sm font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Address</label>
                  <textarea
                    rows="3"
                    value={editingRoom.address}
                    onChange={(e) => setEditingRoom({ ...editingRoom, address: e.target.value })}
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl p-4 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 p-10 bg-[#FDFCFB]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Listing Visual</p>
                <div className="aspect-video rounded-3xl overflow-hidden border-2 border-[#F2EDE4] mb-4">
                  <img src={editingRoom.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <input
                  placeholder="Update URL"
                  value={editingRoom.imageUrl}
                  onChange={(e) => setEditingRoom({ ...editingRoom, imageUrl: e.target.value })}
                  className="w-full bg-white border border-[#F2EDE4] rounded-xl p-3 text-[10px] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-8 bg-white border-t border-[#F2EDE4] flex justify-end gap-4">
              <button onClick={() => setEditingRoom(null)} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Cancel</button>
              <button onClick={handleUpdateRoom} className="bg-[#1A1A1A] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black">Save Updates</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;