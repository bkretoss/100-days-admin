import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Receipt, CheckCircle, AlertCircle, Filter, CreditCard, Calendar } from "lucide-react";
import { cn, formatDate } from "../lib/utils";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/ui/Pagination";
import FilterDropdown from "../components/ui/FilterDropdown";
import { fetchSubscriptions, type ApiSubscription } from "../services/subscriptionsApi";

const STATUS_OPTIONS = [
  { value: "All", label: "Status: All", icon: Filter },
  { value: "active", label: "Active", icon: CheckCircle, color: "text-green-400" },
  { value: "expired", label: "Expired", icon: AlertCircle, color: "text-red-400" },
];

const PLAN_OPTIONS = [
  { value: "All", label: "Plan: All", icon: CreditCard },
  { value: "Monthly", label: "Monthly", icon: Calendar, color: "text-green-400" },
  { value: "100 Day Access", label: "100 Day Access", icon: Calendar, color: "text-electric-blue" },
];

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ApiSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSubscriptions(currentPage, itemsPerPage)
      .then(({ data, pagination }) => {
        setSubscriptions(data);
        setTotalRecords(pagination.total_records);
      })
      .catch(() => setError("Failed to load subscriptions. Please try again."))
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, planFilter, statusFilter]);

  const filtered = subscriptions.filter((sub) => {
    const matchesSearch = sub.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "All" || sub.subscription_plan === planFilter;
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const expiredCount = subscriptions.filter((s) => s.status === "expired").length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Subscriptions</h1>
        <p className="text-gray-500 font-medium mt-1">Manage user subscriptions and plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Subscriptions" value={totalRecords} icon={Receipt} color="text-electric-blue" bg="bg-electric-blue/10" delay={0} />
        <StatCard
          label="Active Subscriptions" value={activeCount} icon={CheckCircle} color="text-green-400" bg="bg-green-500/10" delay={0.1}
          onClick={() => setStatusFilter(statusFilter === "active" ? "All" : "active")}
          highlight={statusFilter === "active"} highlightColor="ring-2 ring-green-500/50 bg-green-500/5"
          badge={statusFilter === "active" ? "Filtered" : undefined} badgeColor="text-green-400"
        />
        <StatCard
          label="Expired Subscriptions" value={expiredCount} icon={AlertCircle} color="text-red-400" bg="bg-red-500/10" delay={0.2}
          onClick={() => setStatusFilter(statusFilter === "expired" ? "All" : "expired")}
          highlight={statusFilter === "expired"} highlightColor="ring-2 ring-red-500/50 bg-red-500/5"
          badge={statusFilter === "expired" ? "Filtered" : undefined} badgeColor="text-red-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search by user name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64" />
        </div>
        <FilterDropdown value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} isOpen={isStatusDropdownOpen} onToggle={() => { setIsStatusDropdownOpen(!isStatusDropdownOpen); setIsPlanDropdownOpen(false); }} onClose={() => setIsStatusDropdownOpen(false)} />
        <FilterDropdown value={planFilter} options={PLAN_OPTIONS} onChange={setPlanFilter} isOpen={isPlanDropdownOpen} onToggle={() => { setIsPlanDropdownOpen(!isPlanDropdownOpen); setIsStatusDropdownOpen(false); }} onClose={() => setIsPlanDropdownOpen(false)} />
        {(statusFilter !== "All" || planFilter !== "All") && (
          <button onClick={() => { setStatusFilter("All"); setPlanFilter("All"); }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
            Clear All Filters <span className="text-electric-blue">×</span>
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                {["User", "Plan", "Status", "Start Date", "End Date", "Remaining Days", "Device Type"].map((h) => <th key={h} className="px-6 py-4">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">Loading subscriptions...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-red-400 font-medium">{error}</td></tr>
              ) : filtered.length > 0 ? filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20">
                        {sub.user_name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-white">{sub.user_name}</p>
                        <p className="text-xs text-gray-500">{sub.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border bg-electric-blue/10 text-electric-blue border-electric-blue/20">
                      {sub.subscription_plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", sub.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium">{formatDate(sub.start_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium">{formatDate(sub.end_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium">{sub.remaining_days} days</td>
                  <td className="px-6 py-4">
                    {sub.device_type ? (
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border", sub.device_type.toLowerCase() === "ios" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
                        {sub.device_type.toLowerCase() === "ios" ? "iOS" : "Android"}
                      </span>
                    ) : <span className="text-xs text-gray-500 font-medium">-</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" /><p className="text-gray-500 font-medium">No subscriptions found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </motion.div>
  );
};

export default SubscriptionsPage;
