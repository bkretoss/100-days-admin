import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, Trash2 } from "lucide-react";
import { deleteAdminUser } from "../services/usersApi";
import { toast } from "sonner";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { cn, formatDate } from "../lib/utils";
import { STATS } from "../data/mockData";
import { fetchAdminUsers, type AdminUsersApiRow } from "../services/usersApi";
import { fetchSubscriptions } from "../services/subscriptionsApi";
import StatCard from "../components/ui/StatCard";

const DASHBOARD_STATS = STATS.filter((stat) => stat.label !== "Coupon Codes");

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number | null>(null);
  const [expiredSubscriptions, setExpiredSubscriptions] = useState<number | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUsersApiRow[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; apiUserId: string | null }>({ isOpen: false, apiUserId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);

  useEffect(() => {
    fetchSubscriptions(1, 1, "active")
      .then((res) => setActiveSubscriptions(res.pagination.total_records))
      .catch(() => {});

    fetchSubscriptions(1, 1, "expired")
      .then((res) => setExpiredSubscriptions(res.pagination.total_records))
      .catch(() => {});

    fetchAdminUsers(1, 100)
      .then((rows) => {
        setTotalUsers(rows.length);
        const sorted = [...rows].sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setRecentUsers(sorted.slice(0, 10));
      })
      .catch(() => { setTotalUsers(null); setUsersError(true); })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, apiUserId: null })}
        onConfirm={async () => {
          if (!deleteModal.apiUserId) return;
          setDeleteLoading(true);
          try {
            await deleteAdminUser(deleteModal.apiUserId);
            setRecentUsers((prev) => prev.filter((u) => u.id !== deleteModal.apiUserId));
            toast.success("User deleted successfully");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete user");
          } finally {
            setDeleteLoading(false);
            setDeleteModal({ isOpen: false, apiUserId: null });
          }
        }}
        title="Delete User"
        message="Are you sure you want to proceed? This action cannot be undone."
        isLoading={deleteLoading}
      />
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_STATS.map((stat, i) => (
            <div key={stat.label}>
              <StatCard
                label={stat.label}
                value={
                  stat.label === "Total Users" && totalUsers !== null ? totalUsers
                  : stat.label === "Active Subscriptions" && activeSubscriptions !== null ? activeSubscriptions
                  : stat.label === "Expired Subscriptions" && expiredSubscriptions !== null ? expiredSubscriptions
                  : stat.value
                }
                icon={stat.icon}
                color={stat.color}
                bg={stat.bg}
                glow={stat.glow}
                delay={i * 0.1}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => navigate("/users")}>
            Recent Users
          </h2>
          <button onClick={() => navigate("/users")} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4 text-center">Created Date</th>
                  <th className="px-6 py-4 text-center">Dates</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading data...</td></tr>
                ) : usersError ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-red-400">Failed to load users.</td></tr>
                ) : recentUsers.map((user) => {
                  const plan = user.subscription_plan ?? "";
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <RecentUserAvatar name={user.name} imageUrl={user.image} />
                          <span className="font-medium text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        {plan ? (
                          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border", plan.toLowerCase() === "100 day access" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
                            {plan}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {user.subscription_start_date || user.subscription_end_date ? (
                          <>
                            <div className="font-medium text-gray-200">{formatDate(user.subscription_start_date)}</div>
                            <div className="text-[10px] text-gray-500">to {formatDate(user.subscription_end_date)}</div>
                          </>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors"><Eye className="w-5 h-5" /></button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, apiUserId: user.id }); }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

function RecentUserAvatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [imageUrl]);
  const showRemote = Boolean(imageUrl?.trim()) && !failed;
  return (
    <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20 overflow-hidden shrink-0">
      {showRemote ? (
        <img src={imageUrl!.trim()} alt="" className="size-10 rounded-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span className="text-sm leading-none">{(name?.[0] ?? "-").toUpperCase()}</span>
      )}
    </div>
  );
}

export default DashboardPage;
