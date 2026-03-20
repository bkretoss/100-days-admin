import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Users, Calendar, Tag, Eye, Trash2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "../lib/utils";
import { USERS } from "../data/mockData";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/ui/Pagination";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import FilterDropdown from "../components/ui/FilterDropdown";

const PLAN_OPTIONS = [
  { value: "All", label: "Plan: All", icon: CreditCard },
  { value: "Monthly", label: "Monthly", icon: Calendar, color: "text-green-400" },
  { value: "Yearly", label: "Yearly", icon: Calendar, color: "text-electric-blue" },
];

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: number | null }>({ isOpen: false, userId: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = USERS.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (planFilter === "All" || user.plan === planFilter);
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, planFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={() => { if (deleteModal.userId) toast.success(`User ${deleteModal.userId} deleted successfully`); }}
        title="Delete User"
        message="Are you sure you want to proceed? This action cannot be undone."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={USERS.length} icon={Users} color="text-electric-blue" bg="bg-electric-blue/10" delay={0} />
        <StatCard label="Monthly Users" value={USERS.filter((u) => u.plan === "Monthly").length} icon={Calendar} color="text-green-400" bg="bg-green-500/10" delay={0.1} />
        <StatCard label="Yearly Users" value={USERS.filter((u) => u.plan === "Yearly").length} icon={Calendar} color="text-electric-purple" bg="bg-electric-purple/10" delay={0.2} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64"
            />
          </div>
          <FilterDropdown
            value={planFilter}
            options={PLAN_OPTIONS}
            onChange={setPlanFilter}
            isOpen={isPlanDropdownOpen}
            onToggle={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
            onClose={() => setIsPlanDropdownOpen(false)}
          />
        </div>
        <span className="text-sm text-gray-500">
          Showing <b className="text-white">{paginatedUsers.length}</b> of <b className="text-white">{filteredUsers.length}</b> users
        </span>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Coupon Used</th>
                <th className="px-6 py-4 text-center">Dates</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border", user.plan === "Yearly" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.couponUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                          <Tag className="w-3 h-3" />{user.couponUsed}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Not Used</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-400">
                      <div className="font-medium text-gray-200">{formatDate(user.startDate)}</div>
                      <div className="text-[10px] text-gray-500">to {formatDate(user.endDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-electric-blue h-full rounded-full shadow-[0_0_8px_rgba(0,210,255,0.4)]" style={{ width: `${user.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-300">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors"><Eye className="w-5 h-5" /></button>
                        <button
                          className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, userId: user.id }); }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">No users found matching your criteria</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </motion.div>
  );
};

export default UsersPage;
