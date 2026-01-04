import React, { useEffect, useState } from "react";
import { Users, Home, CheckCircle, Clock, Calendar, MessageSquare, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getAllUsersAPI, getAllRoomsAPI, getAllBookingsAPI, getAllComplaintsAPI } from "@/services/allApis";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalRooms: 0, 
    bookedRooms: 0, 
    availableRooms: 0, 
    totalUsers: 0,
    complaints: 0 
  });
  const [occupancyData, setOccupancyData] = useState([]);
  const [residentList, setResidentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const GOLD_PALETTE = ["#C5A059", "#1A1A1A"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [u, r, b, c] = await Promise.all([
        getAllUsersAPI(), 
        getAllRoomsAPI(), 
        getAllBookingsAPI(),
        getAllComplaintsAPI()
      ]);

      const rooms = r?.data || [];
      const bookings = b?.data || [];
      
      const total = rooms.length;
      const booked = rooms.filter(room => room.status === "Occupied" || room.status === "Booked").length;
      const available = total - booked;

      setStats({
        totalRooms: total,
        bookedRooms: booked,
        availableRooms: available,
        totalUsers: u?.data?.length || 0,
        complaints: c?.data?.length || 0,
      });

      setOccupancyData([
        { name: "Occupied", value: booked },
        { name: "Available", value: available },
      ]);

      const activeResidents = bookings
        .filter(book => book.status === "Active" || book.status === "Confirmed")
        .slice(-5)
        .reverse()
        .map(book => ({
          id: book._id,
          name: book.userId?.username || "Unknown Resident",
          room: book.roomId?.houseNumber || "N/A",
          type: book.roomId?.propertyType || "Unit",
          date: new Date(book.createdAt).toLocaleDateString(),
          status: book.status
        }));
      
      setResidentList(activeResidents);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FDFCFB]">
      <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing Systems...</p>
    </div>
  );

  return (
    <div className="p-8 bg-[#FDFCFB] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">Operations</h2>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tighter">Dashboard</h1>
        </div>
        <div className="bg-white p-3 px-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Calendar size={18} className="text-[#C5A059]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
            {/* Updated Date Format to include day */}
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Total Rooms Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#C5A059] transition-all">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Inventory</p>
            <h3 className="text-3xl font-bold text-black">{stats.totalRooms} Rooms</h3>
            <Home className="absolute -right-2 -bottom-2 text-gray-50 group-hover:text-[#C5A059] group-hover:opacity-10 transition-all" size={80} />
        </div>

        {/* COMPACT OCCUPANCY GRID (Booked & Available) */}
        <div className="md:col-span-2 bg-black p-1 rounded-[2.5rem] shadow-xl flex gap-1">
            <div className="flex-1 bg-black p-7 rounded-l-[2.3rem] relative overflow-hidden">
                <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest mb-1">Booked</p>
                <h3 className="text-4xl font-bold text-white tracking-tighter">{stats.bookedRooms}</h3>
                <div className="mt-2 flex items-center gap-2 text-[#C5A059] text-[8px] font-black uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div> Occupied
                </div>
            </div>
            <div className="w-px bg-white/10 my-8"></div>
            <div className="flex-1 bg-black p-7 rounded-r-[2.3rem] relative overflow-hidden">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Available</p>
                <h3 className="text-4xl font-bold text-emerald-400 tracking-tighter">{stats.availableRooms}</h3>
                <CheckCircle className="absolute -right-2 -bottom-2 text-emerald-500/10" size={60} />
            </div>
        </div>

        {/* Right Side Stack: Users & Issues */}
        <div className="flex flex-col gap-4">
            <div className="flex-1 bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-[#C5A059]/20 transition-all">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                    <h4 className="text-xl font-bold">{stats.totalUsers}</h4>
                </div>
                <Users size={24} className="text-[#C5A059]" />
            </div>
            <div className="flex-1 bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-red-100 transition-colors">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Issues</p>
                    <h4 className="text-xl font-bold text-red-500">{stats.complaints}</h4>
                </div>
                <MessageSquare size={24} className="text-red-300 group-hover:text-red-500 transition-colors" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-black uppercase tracking-widest">Occupancy Ratio</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Live Inventory Distribution</p>
            </div>
            
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={occupancyData}
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={10}
                            dataKey="value"
                        >
                            {occupancyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={GOLD_PALETTE[index % GOLD_PALETTE.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-8 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C5A059]"></div>
                    <span className="text-[10px] font-black uppercase text-gray-400">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#1A1A1A]"></div>
                    <span className="text-[10px] font-black uppercase text-gray-400">Available</span>
                </div>
            </div>
        </div>

        {/* ACTIVE RESIDENT LIST SECTION */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-lg font-bold text-black uppercase tracking-widest">Active Residents</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Current confirmed bookings</p>
                </div>
                <div className="bg-[#FDF9F0] p-2 rounded-lg">
                    <ShieldCheck size={20} className="text-[#C5A059]" />
                </div>
            </div>

            <div className="space-y-4">
                {residentList.length > 0 ? residentList.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-[#FDFCFB] border border-gray-50 hover:border-[#C5A059]/30 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-[#C5A059] font-black text-sm">
                                {res.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black group-hover:text-[#C5A059] transition-colors">{res.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Room {res.room}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{res.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 mb-1">{res.date}</p>
                            <span className="text-[8px] font-black uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                                {res.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20">
                        <Clock className="mx-auto text-gray-200 mb-2" size={40} />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No active residents found</p>
                    </div>
                )}
            </div>

            <Link to="/admin/rent">
              <button className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-black hover:text-[#C5A059] transition-all">
                  View All Occupancy Records
              </button>
            </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;