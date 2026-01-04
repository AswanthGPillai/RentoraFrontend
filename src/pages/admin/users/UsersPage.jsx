import React, { useEffect, useState } from "react";
import { Trash2, Search, User, Mail, ShieldAlert, Loader2 } from "lucide-react";
import { getAllUsersAPI, deleteUserAPI } from "@/services/allApis";
import { toast } from "react-toastify";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAPI();
      if (res?.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Server error", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Permanent Action: Are you sure you want to delete this user?")) return;

  const res = await deleteUserAPI(id);

  if (res?.status === 200) {
    toast.success("User removed from records");
    setUsers((prev) => prev.filter((u) => u._id !== id));
  } else {
    toast.error(res?.data?.message || "Unable to delete user");
  }
};


  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#FDFCFB] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">
            System Administration
          </h2>
          <h1 className="text-5xl font-bold text-[#1A1A1A] tracking-tighter">
            User Directory
          </h1>
        </div>

        {/* STYLISH SEARCH BAR */}
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search credentials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#F2EDE4] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4 text-[#C5A059]" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">Accessing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDF9F0]/50 border-b border-[#F2EDE4]">
                  <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Member Profile</th>
                  <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Contact Information</th>
                  <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F2EDE4]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-[#FDFCFB] transition-colors group">
                      {/* USER INFO */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl border border-[#F2EDE4] overflow-hidden bg-[#FDF9F0] flex items-center justify-center">
                              {user.profile ? (
                                <img
                                  src={`http://localhost:4000/uploads/${user.profile}`}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <User className="text-[#C5A059]/40" size={20} />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A] text-base">{user.username}</p>
                            <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-tighter">Verified Member</p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail size={14} className="text-[#C5A059]/60" />
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                      </td>

                      {/* STATUS TAG */}
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide">
                          Active
                        </span>
                      </td>

                      {/* DELETE ACTION */}
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                          title="Revoke Access"
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <ShieldAlert size={48} className="mb-4 text-[#C5A059]" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No matching records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="mt-8 flex justify-between items-center px-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Total Registered Users: <span className="text-[#C5A059]">{filteredUsers.length}</span>
        </p>
      </div>
    </div>
  );
};

export default UsersPage;