import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Sparkles, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Resizable } from "re-resizable"; // Import Resizable

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Welcome to Rentora Luxury Services. How may I assist you today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { from: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:4000/api/chat", {
                message: userMessage.text,
            });
            setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
        } catch {
            setMessages((prev) => [...prev, { from: "bot", text: "Service offline." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className={`fixed bottom-6 right-6 p-4 rounded-2xl z-50 transition-all duration-500 shadow-xl flex items-center justify-center ${open ? "bg-white text-gray-800 rotate-90" : "bg-black text-[#D4AF37] hover:scale-105 active:scale-95"
                    }`}
            >
                {open ? <X size={20} /> : <MessageCircle size={20} />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 shadow-2xl border border-white/50 rounded-[2rem] overflow-hidden bg-white/95 backdrop-blur-xl"
                    >
                        <Resizable
                            defaultSize={{ width: 320, height: 450 }}
                            minWidth={280}
                            minHeight={350}
                            maxWidth={500}
                            maxHeight={700}
                            enable={{
                                top: true,
                                left: true,
                                topLeft: true,
                            }}
                            handleStyles={{
                                left: { cursor: "ew-resize", width: "10px", left: "0" },
                                top: { cursor: "ns-resize", height: "10px", top: "0" },
                                topLeft: {
                                    cursor: "nwse-resize",
                                    width: "20px",
                                    height: "20px",
                                    left: "0",
                                    top: "0",
                                },
                            }}
                            className="flex flex-col"
                        >

                            {/* Header - Fixed height */}
                            <div className="bg-black p-4 flex items-center gap-3 flex-shrink-0 select-none">
                                <div className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/10">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold tracking-tight text-sm">Rentora <span className="text-[#D4AF37]">AI</span></h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                                <div className="ml-auto text-gray-600 text-[10px] italic">Resize ↖</div>
                            </div>

                            {/* Chat Area - Grows with container */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
                            >
                                {messages.map((msg, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={i}
                                        className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.from === "bot" ? "bg-gray-100 text-[#D4AF37]" : "bg-black text-white"
                                            }`}>
                                            {msg.from === "bot" ? <Bot size={12} /> : <User size={12} />}
                                        </div>

                                        <div
                                            className={`p-3 rounded-2xl text-[13px] font-medium leading-snug max-w-[85%] ${msg.from === "bot"
                                                    ? "bg-[#FDFBF7] text-gray-700 rounded-bl-none border border-[#F1E9D6]"
                                                    : "bg-black text-white rounded-br-none"
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}

                                {loading && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[#D4AF37]">
                                            <Bot size={12} />
                                        </div>
                                        <div className="bg-[#FDFBF7] px-3 py-2.5 rounded-2xl rounded-bl-none border border-[#F1E9D6] flex gap-1">
                                            <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce"></span>
                                            <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area - Fixed height at bottom */}
                            <div className="p-4 bg-white border-t border-gray-50 flex items-center gap-2 flex-shrink-0">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Ask something..."
                                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-[13px] font-medium outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-black text-[#D4AF37] p-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all active:scale-90"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </Resizable>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;