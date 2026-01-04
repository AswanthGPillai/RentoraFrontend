import React, { useEffect, useState } from "react";
import { X, User, Lock, Mail, Camera, ShieldCheck, CheckCircle2 } from "lucide-react";
import { updateAdminProfileAPI } from "@/services/allApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(sessionStorage.getItem("existingUser"));

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  /* =========================
      LOAD ADMIN DATA
  ========================= */
  useEffect(() => {
    if (!admin) {
      navigate("/login");
      return;
    }

    setProfileData((prev) => ({
      ...prev,
      username: admin.username,
    }));

    if (admin.profile) {
      setPreview(`http://localhost:4000/uploads/${admin.profile}`);
    }
  }, []);

  /* =========================
      UPDATE PROFILE
  ========================= */
  const handleUpdateProfile = async () => {
    if (
      profileData.password &&
      profileData.password !== profileData.confirmPassword
    ) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", profileData.username);

      if (profileData.password) {
        formData.append("password", profileData.password);
      }

      if (profileImage) {
        formData.append("profile", profileImage);
      }

      const res = await updateAdminProfileAPI(formData);

      if (res?.status === 200) {
        toast.success("Profile updated successfully");

        sessionStorage.setItem("existingUser", JSON.stringify(res.data));

        setShowEditModal(false);
        setShowPasswordModal(false);

        setProfileData({
          username: res.data.username,
          password: "",
          confirmPassword: "",
        });

        if (res.data.profile) {
          setPreview(`http://localhost:4000/uploads/${res.data.profile}`);
        }
      }
    } catch (err) {
      toast.error("Profile update failed");
    }
  };

  return (
    <div className="p-10 bg-[#FDFCFB] min-h-screen">
      {/* HEADER */}
      <div className="mb-12">
        <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.5em] mb-2">
          Administrative Control
        </h2>
        <h1 className="text-5xl font-bold text-[#1A1A1A] tracking-tighter">
          Account Settings
        </h1>
      </div>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COL: MINI PROFILE CARD */}
        <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] p-8 flex flex-col items-center text-center shadow-sm">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 border-2 border-[#C5A059] mb-4 flex items-center justify-center bg-[#FDF9F0] overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full rounded-full object-cover shadow-inner transition-transform group-hover:scale-110 duration-500"
                  alt="Admin"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#C5A059]/40">
                  <User size={48} strokeWidth={1.5} />
                  <span className="text-[8px] font-black uppercase tracking-tighter mt-1">
                    No Image
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-6 right-0 bg-[#1A1A1A] text-white p-2 rounded-full border-2 border-white shadow-lg">
              <ShieldCheck size={14} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A]">{admin?.username}</h3>
          <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mt-1">
            Super Admin
          </p>

          <div className="w-full h-[1px] bg-[#F2EDE4] my-6" />

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              Edit Identity
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-white border border-[#F2EDE4] hover:border-[#C5A059] text-gray-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Security Keys
            </button>
          </div>
        </div>

        {/* RIGHT COL: CREDENTIAL DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] p-10 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-10">
              <CheckCircle2 className="text-[#C5A059]" size={20} />
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                Verified Credentials
              </h3>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="bg-[#FDF9F0] p-4 rounded-2xl text-[#C5A059]">
                  <User size={20} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Administrative Alias
                  </label>
                  <p className="text-lg font-bold text-[#1A1A1A]">
                    {admin?.username}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-[#FDF9F0] p-4 rounded-2xl text-[#C5A059]">
                  <Mail size={20} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    System Email Address
                  </label>
                  <p className="text-lg font-bold text-[#1A1A1A]">
                    {admin?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-[#FDF9F0] p-4 rounded-2xl text-[#C5A059]">
                  <Lock size={20} />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Access Protocol
                  </label>
                  <p className="text-lg font-bold text-[#1A1A1A]">••••••••••••</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: EDIT IDENTITY */}
      {showEditModal && (
        <Modal title="Refine Identity" onClose={() => setShowEditModal(false)}>
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-3xl border-2 border-dashed border-[#C5A059]/30 bg-[#FDFCFB] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#C5A059]">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-all"
                    />
                  ) : (
                    <User
                      size={32}
                      className="text-[#C5A059]/30 group-hover:text-[#C5A059]"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/10">
                    <Camera className="text-[#1A1A1A]" size={20} />
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setProfileImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
            </div>

            <Input
              label="Update Username"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
            />

            <button
              onClick={handleUpdateProfile}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 shadow-lg shadow-gray-200 hover:bg-black transition-all"
            >
              Confirm Changes
            </button>
          </div>
        </Modal>
      )}

      {/* MODAL: CHANGE PASSWORD */}
      {showPasswordModal && (
        <Modal title="Secure Access" onClose={() => setShowPasswordModal(false)}>
          <div className="space-y-5">
            <Input
              label="New Security Key"
              type="password"
              placeholder="••••••••"
              value={profileData.password}
              onChange={(e) =>
                setProfileData({ ...profileData, password: e.target.value })
              }
            />
            <Input
              label="Verify Security Key"
              type="password"
              placeholder="••••••••"
              value={profileData.confirmPassword}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button
              onClick={handleUpdateProfile}
              className="w-full bg-[#C5A059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 shadow-lg shadow-[#C5A059]/20 hover:bg-[#B48A30] transition-all"
            >
              Update Protocol
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* =========================
    REUSABLE COMPONENTS
========================= */

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white w-full max-w-[440px] rounded-[3rem] shadow-2xl overflow-hidden border border-[#F2EDE4] animate-in zoom-in duration-300">
      <div className="bg-[#FDF9F0] p-8 flex justify-between items-center border-b border-[#F2EDE4]">
        <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-10">{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-[#FDFCFB] border border-[#F2EDE4] rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#C5A059] transition-all placeholder:text-gray-200"
    />
  </div>
);

export default Settings;