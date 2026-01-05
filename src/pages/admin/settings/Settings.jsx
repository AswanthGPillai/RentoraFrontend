import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Camera,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { updateAdminProfileAPI } from "@/services/allApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* =========================
   ENV CONFIG
========================= */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_URL = `${BASE_URL}/uploads`;

/* =========================
   IMAGE HELPER
========================= */
const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${UPLOADS_URL}/${img.replace(/^uploads\//, "")}`;
};

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
      setPreview(getImageUrl(admin.profile));
    }
  }, [admin, navigate]);

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

        setPreview(getImageUrl(res.data.profile));
        setProfileImage(null);
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
        {/* PROFILE CARD */}
        <div className="bg-white rounded-[2.5rem] border border-[#F2EDE4] p-8 flex flex-col items-center text-center shadow-sm">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-1 border-2 border-[#C5A059] mb-4 bg-[#FDF9F0] overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
                  alt="Admin"
                />
              ) : (
                <User size={48} className="text-[#C5A059]/40 mx-auto mt-8" />
              )}
            </div>
            <div className="absolute bottom-6 right-0 bg-black text-white p-2 rounded-full">
              <ShieldCheck size={14} />
            </div>
          </div>

          <h3 className="text-xl font-bold">{admin?.username}</h3>
          <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">
            Super Admin
          </p>

          <div className="w-full h-px bg-[#F2EDE4] my-6" />

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-3"
          >
            Edit Identity
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full border border-[#F2EDE4] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          >
            Security Keys
          </button>
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-[#F2EDE4] p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <CheckCircle2 className="text-[#C5A059]" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
              Verified Credentials
            </h3>
          </div>

          <InfoRow icon={<User />} label="Admin Alias" value={admin?.username} />
          <InfoRow icon={<Mail />} label="Email" value={admin?.email} />
          <InfoRow icon={<Lock />} label="Password" value="••••••••••••" />
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal title="Refine Identity" onClose={() => setShowEditModal(false)}>
          <div className="space-y-6">
            <label className="block text-center cursor-pointer">
              <div className="w-24 h-24 mx-auto rounded-3xl border border-dashed flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-300" />
                )}
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setProfileImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>

            <Input
              label="Username"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
            />

            <button
              onClick={handleUpdateProfile}
              className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              Confirm Changes
            </button>
          </div>
        </Modal>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <Modal title="Secure Access" onClose={() => setShowPasswordModal(false)}>
          <Input
            label="New Password"
            type="password"
            value={profileData.password}
            onChange={(e) =>
              setProfileData({ ...profileData, password: e.target.value })
            }
          />
          <Input
            label="Confirm Password"
            type="password"
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
            className="w-full bg-[#C5A059] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4"
          >
            Update Protocol
          </button>
        </Modal>
      )}
    </div>
  );
};

/* =========================
    REUSABLE COMPONENTS
========================= */

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-6 mb-8">
    <div className="bg-[#FDF9F0] p-4 rounded-2xl text-[#C5A059]">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 flex justify-between items-center border-b">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
          {title}
        </h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="p-10">{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2 mb-4">
    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-5 py-4 border rounded-xl bg-[#FDFCFB]"
    />
  </div>
);

export default Settings;
