import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Receipt, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import type { AuthUser } from "../../types";

const SidebarItem = ({ icon: Icon, label, active = false, to }: { icon: any; label: string; active?: boolean; to: string }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left",
        active ? "bg-white/5 border border-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-electric-blue" : "group-hover:text-electric-blue")} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  user: AuthUser;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 border-r border-white/5 bg-dark-900 hidden lg:flex flex-col shrink-0">
      <div className="p-6 flex items-center">
        <img src="/images/Asset_4_3.png" alt="100 Days Challenge" className="w-10 h-10 rounded-lg" />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={pathname === "/dashboard" || pathname === "/"} to="/dashboard" />
        <SidebarItem icon={Users} label="Users" active={pathname.startsWith("/users")} to="/users" />
        <SidebarItem icon={Receipt} label="Subscriptions" active={pathname === "/subscriptions"} to="/subscriptions" />
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="size-8 rounded-full bg-dark-800 overflow-hidden border border-white/10">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Admin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name || "Guest User"}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email || "guest@example.com"}</p>
          </div>
          <button onClick={onLogout} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
