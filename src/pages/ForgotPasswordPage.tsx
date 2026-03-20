import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const mockSendResetLink = async (email: string): Promise<void> => {
  await new Promise((res) => setTimeout(res, 1200));
  if (email === "fail@test.com") throw new Error("Failed to send reset link.");
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");

    setError("");
    setLoading(true);
    try {
      await mockSendResetLink(email);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0f1115]">
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop")', backgroundSize: "cover", backgroundPosition: "center", filter: "blur(4px)" }}
      />
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-6">
        <div className="mb-8 flex flex-col items-center">
          <img src="/images/Asset_4_3.png" alt="100 Days Challenge" className="w-20 h-20 rounded-2xl mb-4" />
          <h1 className="text-3xl font-black text-white tracking-tight">100 Days App</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Admin Panel</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-[#1a1d24] rounded-[32px] p-10 shadow-2xl border border-white/5">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your email to reset your password</p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-white font-semibold text-center">Reset link sent!</p>
              <p className="text-gray-400 text-sm text-center">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Check your inbox.
              </p>
              <button onClick={() => navigate("/login")} className="mt-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="admin@100days.app"
                  className={`w-full bg-[#23272f] border rounded-xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 transition-all outline-none placeholder:text-gray-600 ${error ? "border-red-500/60" : "border-white/5"}`}
                />
                {error && <p className="text-red-400 text-xs font-medium pt-0.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => navigate("/login")} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 mx-auto">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <p className="mt-12 text-gray-500 text-xs font-medium">© 2026 100 Days App. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
