import React, { useState, useEffect } from "react";
import { X, CheckCircle, Trash2, Eye, Loader2, MessageSquare, AlertCircle, User, Calendar } from "lucide-react";
import {
  getAllComplaintsAPI,
  getAllSuggestionsAPI,
  deleteComplaintAPI,
  deleteSuggestionAPI,
} from "@/services/allApis";
import { toast } from "react-toastify";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("complaints");
  const [modalData, setModalData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
      FETCH DATA
  ====================== */
  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    setLoading(true);
    try {
      const complaintRes = await getAllComplaintsAPI();
      const suggestionRes = await getAllSuggestionsAPI();

      if (complaintRes?.status === 200) setComplaints(complaintRes.data);
      if (suggestionRes?.status === 200) setSuggestions(suggestionRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to sync with server");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
      RESOLVE COMPLAINT
  ====================== */
  const handleResolveComplaint = async (id) => {
    if (!window.confirm("Mark this grievance as resolved?")) return;
    try {
      const res = await deleteComplaintAPI(id);
      if (res?.status === 200) {
        toast.success("Case resolved successfully");
        setComplaints((prev) => prev.filter((c) => c._id !== id));
        setModalData(null);
      }
    } catch (err) {
      toast.error("Protocol failure: Could not resolve");
    }
  };

  /* ======================
      DELETE SUGGESTION
  ====================== */
  const handleDeleteSuggestion = async (id) => {
    if (!window.confirm("Archive this suggestion permanently?")) return;
    try {
      const res = await deleteSuggestionAPI(id);
      if (res?.status === 200) {
        toast.success("Suggestion archived");
        setSuggestions((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      toast.error("Protocol failure: Could not archive");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#FDFCFB]">
        <Loader2 className="animate-spin text-[#C5A059]" size={48} />
        <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.5em]">Accessing Records...</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#FDFCFB] min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-12">
        <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">Administrative Hub</h2>
        <h1 className="text-5xl font-bold text-[#1A1A1A] tracking-tighter">Notifications</h1>
      </div>

      {/* LUXURY TABS */}
      <div className="flex gap-12 border-b border-[#F2EDE4] mb-10">
        {[
          { id: "complaints", label: "Complaints", icon: AlertCircle, count: complaints.length },
          { id: "suggestions", label: "Suggestions", icon: MessageSquare, count: suggestions.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id ? "text-[#C5A059]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] ${activeTab === tab.id ? "bg-[#C5A059] text-white" : "bg-gray-100 text-gray-400"}`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A059] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FDF9F0]/50 border-b border-[#F2EDE4]">
              <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">User Identity</th>
              <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest">Issue / Title</th>
              <th className="p-6 text-[10px] font-black text-[#C5A059] uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EDE4]">
            {(activeTab === "complaints" ? complaints : suggestions).length > 0 ? (
              (activeTab === "complaints" ? complaints : suggestions).map((item) => (
                <tr key={item._id} className="hover:bg-[#FDFCFB] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FDF9F0] border border-[#F2EDE4] flex items-center justify-center text-[#C5A059]">
                        <User size={16} />
                      </div>
                      <span className="font-bold text-[#1A1A1A]">{item.userId?.username || "Guest User"}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium text-gray-600 truncate max-w-md">{item.title}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">ID: {item._id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setModalData({ type: activeTab, data: item })}
                        className="p-3 rounded-xl bg-[#FDF9F0] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all shadow-sm"
                        title="Review Details"
                      >
                        <Eye size={18} />
                      </button>
                      {activeTab === "complaints" ? (
                        <button
                          onClick={() => handleResolveComplaint(item._id)}
                          className="p-3 rounded-xl bg-white border border-[#F2EDE4] text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Resolve Issue"
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteSuggestion(item._id)}
                          className="p-3 rounded-xl bg-white border border-[#F2EDE4] text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete Suggestion"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                   <div className="flex flex-col items-center opacity-30">
                      <MessageSquare size={48} className="mb-4 text-[#C5A059]" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Active Records</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {modalData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-[#F2EDE4] animate-in zoom-in duration-300">
            <div className="bg-[#FDF9F0] p-8 flex justify-between items-center border-b border-[#F2EDE4]">
              <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">
                {modalData.type === "complaints" ? "Complaint Dossier" : "Suggestion Detail"}
              </h2>
              <button onClick={() => setModalData(null)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-10">
              <div className="mb-8">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Subject</label>
                <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight">{modalData.data.title}</h3>
              </div>
              <div className="mb-8">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Detailed Message</label>
                <div className="bg-[#FDFCFB] border border-[#F2EDE4] p-6 rounded-2xl">
                  <p className="text-gray-700 leading-relaxed text-sm">{modalData.data.message}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#C5A059]" />
                  <span className="text-[10px] font-bold uppercase text-gray-500">{modalData.data.userId?.username || "Guest User"}</span>
                </div>
                {modalData.type === "complaints" && (
                   <button 
                    onClick={() => handleResolveComplaint(modalData.data._id)}
                    className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black shadow-lg transition-all"
                   >
                     Resolve Case
                   </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;