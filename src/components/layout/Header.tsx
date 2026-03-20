import React from "react";
import { User } from "lucide-react";
import type { AuthUser } from "../../types";

interface HeaderProps {
  user: AuthUser;
}

const Header: React.FC<HeaderProps> = ({ user }) => (
  <header className="h-20 border-b border-white/5 flex items-center justify-end px-8 bg-dark-900/50 backdrop-blur-md z-10">
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-white leading-none">{user?.name || "Admin"}</p>
        <p className="text-[10px] text-gray-500 font-medium mt-1">{user?.email}</p>
      </div>
      <div className="size-10 rounded-full border-2 border-electric-purple p-0.5 flex items-center justify-center">
        <div className="size-full rounded-full bg-dark-800 flex items-center justify-center text-gray-400">
          <User className="w-5 h-5" />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
