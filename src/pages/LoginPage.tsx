import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { getToken, setAuth } from "../lib/authStorage";
import { adminLogin } from "../services/authApi";
import type { AuthUser } from "../types";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await adminLogin({ email, password });
      setAuth(token, user);
      onLogin(user);
      toast.success("Login successful. Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const message =
        axiosErrorMessage(err) ?? "Invalid email or password. Please try again.";
      setError(message);
      toast.error(message);
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
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-2">Please enter your credentials to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full bg-[#23272f] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 transition-all outline-none placeholder:text-gray-600 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full bg-[#23272f] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 transition-all outline-none placeholder:text-gray-600 disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn("size-4 rounded-full border flex items-center justify-center transition-all", rememberMe ? "bg-electric-blue border-electric-blue" : "border-gray-600 group-hover:border-gray-400")}
                >
                  {rememberMe && <div className="size-1.5 bg-dark-900 rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-60 disabled:pointer-events-none text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </motion.div>

        <p className="mt-12 text-gray-500 text-xs font-medium">© 2026 100 Days App. All rights reserved.</p>
      </div>
    </div>
  );
};

function axiosErrorMessage(err: unknown): string | null {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: unknown } }).response;
    const data = res?.data;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
      if (typeof d.error === "string") return d.error;
      if (Array.isArray(d.errors) && d.errors.length && typeof d.errors[0] === "string") {
        return d.errors[0];
      }
    }
  }
  if (err instanceof Error) return err.message;
  return null;
}

export default LoginPage;
