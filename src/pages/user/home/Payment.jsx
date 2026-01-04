import React, { useState } from "react";
import { CreditCard, Lock, Calendar, User, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const Payment = () => {
  const [form, setForm] = useState({ name: "", cardNumber: "", expiry: "", cvv: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleChange = (e) => {
  let value = e.target.value;
  const name = e.target.name;

  if (name === "cardNumber") {
    // Remove all non-digits and limit to 16 digits, then format with spaces
    value = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  }

  if (name === "expiry") {
    // Remove all non-digits
    let cleanValue = value.replace(/\D/g, '');
    
    // Limit to 4 digits (MMYY)
    cleanValue = cleanValue.substring(0, 4);

    // Format as MM/YY
    if (cleanValue.length >= 3) {
      value = `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`;
    } else {
      value = cleanValue;
    }
  }

  if (name === "cvv") {
    // Ensure only numbers and max 3 digits
    value = value.replace(/\D/g, '').substring(0, 3);
  }

  setForm({ ...form, [name]: value });
};

  const handlePayNow = () => {
    if (!form.name || !form.cardNumber || !form.expiry || !form.cvv) {
      return; // You can add a toast notification here
    }
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 font-sans">
      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <Confetti numberOfPieces={200} recycle={false} colors={['#C5A059', '#FFFFFF', '#1A1A1A']} />
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="text-center p-10"
            >
              <div className="w-24 h-24 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(197,160,89,0.4)]">
                <CheckCircle2 size={48} className="text-black" />
              </div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">PAYMENT SUCCESS</h2>
              <p className="text-gray-400 mb-8 font-medium">Your luxury residence is now reserved.</p>
              <button 
                onClick={() => window.location.href = "/"}
                className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-[#C5A059] transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: VIRTUAL CARD PREVIEW */}
        <div className="hidden lg:block perspective-1000">
          <motion.div 
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full aspect-[1.58/1] rounded-[24px] shadow-2xl preserve-3d"
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#222] via-[#111] to-black p-8 text-white backface-hidden rounded-[24px] border border-white/10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md opacity-80" />
                <ShieldCheck className="text-[#C5A059]" size={32} />
              </div>
              <div>
                <p className="text-2xl tracking-[4px] font-mono mb-4 h-8">
                  {form.cardNumber || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between uppercase">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold mb-1">Card Holder</p>
                    <p className="text-sm tracking-widest font-bold h-5">{form.name || "YOUR NAME"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Expires</p>
                    <p className="text-sm tracking-widest font-bold h-5">{form.expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BACK OF CARD (CVV focus) */}
            <div className="absolute inset-0 bg-[#111] text-white backface-hidden rounded-[24px] border border-white/10 flex flex-col py-8 rotate-y-180">
                <div className="w-full h-12 bg-black mt-4" />
                <div className="px-8 mt-6">
                    <div className="bg-gray-800 h-10 w-full rounded flex items-center justify-end px-4">
                        <span className="text-black font-bold italic tracking-wider bg-white px-2 rounded">{form.cvv || "•••"}</span>
                    </div>
                    <p className="text-[8px] mt-4 text-gray-500 opacity-50 uppercase tracking-widest">Authorized Signature. Not valid unless signed.</p>
                </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-2xl">
          <header className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Secure Payment</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">Finalize your booking with Rentora.</p>
          </header>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cardholder Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                <input 
                  type="text" name="name" onChange={handleChange} placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Card Number</label>
              <div className="relative group">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                <input 
                  type="text" name="cardNumber" maxLength={19} onChange={handleChange} placeholder="0000 0000 0000 0000"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059] transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Expiry</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                  <input 
                    type="text" name="expiry" maxLength={5} onChange={handleChange} placeholder="MM/YY"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">CVV</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C5A059] transition-colors" size={18} />
                  <input 
                    type="password" name="cvv" maxLength={3} onChange={handleChange} placeholder="•••"
                    onFocus={() => setIsFlipped(true)} onBlur={() => setIsFlipped(false)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C5A059] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full mt-4 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#C5A059] transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
            >
              Authorize Payment
            </button>
            
            <p className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-[#C5A059]" /> 256-Bit SSL Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;