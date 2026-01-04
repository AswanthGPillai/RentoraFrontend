import React, { useEffect, useState } from "react";
import { Search, Calendar, MapPin, User, ChevronLeft, ChevronRight, Hash, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getAllBookingsAPI } from "@/services/allApis";

const RentPage = () => {
  const token = sessionStorage.getItem("token");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
      SEARCH + FILTERS + PAGINATION
  ====================== */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Active" | "Cancelled"
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookingsAPI({
        Authorization: `Bearer ${token}`,
      });
      if (res.status === 200) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      FILTER & SORT LOGIC
  ====================== */
  const filteredBookings = bookings
    .filter((b) => {
      // 1. Improved Search Logic
      const searchTerm = search.toLowerCase();
      const matchesSearch =
        (b.roomId?.houseNumber?.toLowerCase() || "").includes(searchTerm) ||
        (b.userId?.username?.toLowerCase() || "").includes(searchTerm) ||
        (b.status?.toLowerCase() || "").includes(searchTerm);

      // 2. Status Logic
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && b.status !== "Cancelled") ||
        (statusFilter === "Cancelled" && b.status === "Cancelled");

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Logic: Move "Cancelled" to the bottom when "All" is viewed
      // We check if status is 'Cancelled' to determine priority
      const aIsCancelled = a.status === "Cancelled";
      const bIsCancelled = b.status === "Cancelled";

      if (!aIsCancelled && bIsCancelled) return -1; // a (Active) comes before b (Cancelled)
      if (aIsCancelled && !bIsCancelled) return 1;  // a (Cancelled) comes after b (Active)
      
      // Secondary Sort: If both have the same status, sort by date (Newest first)
      return new Date(b.startDate) - new Date(a.startDate);
    });

  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginated = filteredBookings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-[#FDFCFB]">
      <Loader2 className="animate-spin text-[#C5A059]" size={48} />
      <p className="text-[#C5A059] font-medium tracking-widest text-xs uppercase">Accessing Ledger...</p>
    </div>
  );

  return (
    <div className="p-8 bg-[#FDFCFB] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">Rental Inventory</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* STATUS TOGGLE FILTER */}
          <div className="flex bg-white border border-[#F2EDE4] p-1 rounded-2xl shadow-sm w-full md:w-auto">
            {["All", "Active", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? "bg-black text-[#C5A059] shadow-md" 
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {status === "Cancelled" ? "Terminated" : status}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by resident or room..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#F2EDE4] rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#C5A059]/10 focus:border-[#C5A059] transition-all text-sm placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDF9F0] border-b border-[#F2EDE4]">
                <th className="p-6 text-[10px] font-black text-[#B48A30] uppercase tracking-widest">Resident</th>
                <th className="p-6 text-[10px] font-black text-[#B48A30] uppercase tracking-widest">Property</th>
                <th className="p-6 text-[10px] font-black text-[#B48A30] uppercase tracking-widest">Lease Period</th>
                <th className="p-6 text-[10px] font-black text-[#B48A30] uppercase tracking-widest text-center">Current Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginated.length > 0 ? (
                paginated.map((b) => (
                  <tr key={b._id} className={`group hover:bg-[#FDFCFB] transition-colors ${b.status === 'Cancelled' ? 'bg-gray-50/50' : ''}`}>
                    
                    {/* USER COLUMN */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${b.status === 'Cancelled' ? 'bg-gray-100 border-gray-200' : 'bg-gradient-to-tr from-[#E8E1D5] to-[#FDF9F0] border-[#F2EDE4]'}`}>
                          <User size={18} className={b.status === 'Cancelled' ? 'text-gray-400' : 'text-[#B48A30]'} />
                        </div>
                        <div>
                          <p className={`font-bold transition-colors ${b.status === 'Cancelled' ? 'text-gray-400' : 'text-[#1A1A1A] group-hover:text-[#C5A059]'}`}>
                            {b.userId?.username || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-400 font-medium italic">
                            {b.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROOM COLUMN */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-2 font-bold ${b.status === 'Cancelled' ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
                          <Hash size={14} className={b.status === 'Cancelled' ? 'text-gray-300' : 'text-[#C5A059]'} />
                          <span>{b.roomId?.houseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MapPin size={12} />
                          <span>{b.roomId?.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* DATE COLUMN */}
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <Calendar size={12} className="text-[#C5A059] opacity-70" />
                          <span>{new Date(b.startDate).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-gray-200 ml-1.5"></div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <Calendar size={12} className="text-[#C5A059] opacity-70" />
                          <span>{new Date(b.endDate).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                    </td>

                    {/* STATUS COLUMN */}
                    <td className="p-6 text-center">
                      {b.status === "Cancelled" ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-red-50 text-red-600 border border-red-100">
                          <AlertCircle size={10} /> Terminated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 size={10} /> Active Lease
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Search size={48} className="mb-4 text-gray-300" />
                      <p className="text-sm font-medium tracking-widest uppercase">No matching records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="bg-[#FDFCFB] border-t border-[#F2EDE4] p-6 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Audit Trail: <span className="text-[#1A1A1A]">{filteredBookings.length}</span> Total Entries
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white border border-[#F2EDE4] rounded-xl disabled:opacity-30 hover:border-[#C5A059] transition-all shadow-sm"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded-lg">
                Page {page}
              </span>
              <span className="text-xs font-bold text-gray-300">/</span>
              <span className="text-xs font-bold text-gray-400">{totalPages || 1}</span>
            </div>

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white border border-[#F2EDE4] rounded-xl disabled:opacity-30 hover:border-[#C5A059] transition-all shadow-sm"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;