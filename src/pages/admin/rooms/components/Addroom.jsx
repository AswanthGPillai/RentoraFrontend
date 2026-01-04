import React, { useState } from "react";
import { Trash2, RefreshCw, Plus, ArrowLeft, UploadCloud, Info, MapPin, Tag, Image as ImageIcon } from "lucide-react";
import { createRoomAPI } from "@/services/allApis";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    houseNumber: "",
    location: "",
    address: "",
    propertyType: "",
    status: "Available",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImages([...images, file]);
  };

  const handleReplace = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleDelete = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const { houseNumber, location, address, propertyType, price, imageUrl, status } = formData;

      if (!houseNumber || !location || !address || !propertyType || !price || !imageUrl) {
        alert("Please fill all required fields");
        return;
      }

      const reqBody = new FormData();
      reqBody.append("houseNumber", houseNumber);
      reqBody.append("location", location);
      reqBody.append("address", address);
      reqBody.append("propertyType", propertyType);
      reqBody.append("status", status);
      reqBody.append("price", price);
      reqBody.append("imageUrl", imageUrl);

      images.forEach((img) => {
        reqBody.append("uploadedImg", img);
      });

      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const result = await createRoomAPI(reqBody, reqHeader);

      if (result.status === 201) {
        alert("Room created successfully");
        navigate("/admin/rooms");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <button
          onClick={() => navigate("/admin/rooms")}
          className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#C5A059] transition-colors mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-2">New Listing</h2>
            <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight">Register Property</h1>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => navigate("/admin/rooms")}
                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-[#1A1A1A] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
              Save Property
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PRIMARY INFO */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-[#F2EDE4] shadow-sm">
              <div className="flex items-center gap-2 mb-8 text-[#C5A059]">
                <Info size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">General Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">House Number</label>
                  <input
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    placeholder="e.g. Villa 402"
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/10 focus:border-[#C5A059] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Category</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Type</option>
                    <option>Villa</option>
                    <option>Flat</option>
                    <option>Studio</option>
                    <option>Single House</option>
                    <option>PG</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete physical address..."
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm focus:outline-none focus:border-[#C5A059] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-[#F2EDE4] shadow-sm">
              <div className="flex items-center gap-2 mb-8 text-[#C5A059]">
                <MapPin size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Pricing & Location</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / Area</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Beverly Hills, CA"
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm font-bold focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MEDIA */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-[#F2EDE4] shadow-sm">
              <div className="flex items-center gap-2 mb-8 text-[#C5A059]">
                <ImageIcon size={18} />
                <h3 className="text-sm font-black uppercase tracking-widest">Media Assets</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Thumbnail URL</label>
                  <input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://image-link.com/..."
                    className="w-full bg-[#FDFCFB] border border-[#F2EDE4] p-4 rounded-xl text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Gallery Uploads</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-[#F2EDE4]">
                        <img
                          src={URL.createObjectURL(img)}
                          className="h-full w-full object-cover"
                          alt="preview"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                          <label className="p-2 bg-white/20 backdrop-blur-md rounded-lg cursor-pointer hover:bg-white/40 transition-colors">
                            <RefreshCw size={14} className="text-white" />
                            <input type="file" hidden onChange={(e) => handleReplace(index, e)} />
                          </label>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg hover:bg-red-500/40 transition-colors"
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <label className="aspect-video border-2 border-dashed border-[#E8E1D5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#FDF9F0] hover:border-[#C5A059] transition-all group">
                      <UploadCloud size={24} className="text-gray-300 group-hover:text-[#C5A059] transition-colors" />
                      <span className="text-[9px] font-black text-gray-400 uppercase mt-2">Upload</span>
                      <input type="file" hidden onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                <div className="relative z-10">
                    <Tag size={24} className="text-[#C5A059] mb-4" />
                    <h4 className="text-sm font-bold mb-2">Ready to publish?</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6">Ensure all high-resolution images are uploaded for better visibility.</p>
                    <button onClick={handleSubmit} className="w-full py-3 bg-[#C5A059] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B48A30] transition-colors">
                        Confirm & Save
                    </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Plus size={120} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;