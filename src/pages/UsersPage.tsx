import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Users, Calendar, Eye, Trash2 } from "lucide-react";
import { cn, formatDate } from "../lib/utils";
import { toast } from "sonner";
import { fetchAdminUsers, deleteAdminUser, type AdminUsersApiRow } from "../services/usersApi";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/ui/Pagination";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; apiUserId: string | null }>({
    isOpen: false,
    apiUserId: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiRows, setApiRows] = useState<AdminUsersApiRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    fetchAdminUsers(currentPage, itemsPerPage)
      .then((rows) => {
        if (!cancelled) setApiRows(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setApiRows([]);
          toast.error(err instanceof Error ? err.message : "Failed to load users");
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentPage, itemsPerPage]);

  const filteredRows = apiRows.filter((row) => {
    const q = searchQuery.toLowerCase();
    return row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, apiUserId: null })}
        onConfirm={async () => {
          if (!deleteModal.apiUserId) return;
          setDeleteLoading(true);
          try {
            await deleteAdminUser(deleteModal.apiUserId);
            setApiRows((prev) => prev.filter((r) => r.id !== deleteModal.apiUserId));
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value={apiRows.length}
          icon={Users}
          color="text-electric-blue"
          bg="bg-electric-blue/10"
          delay={0}
        />
        <StatCard
          label="Monthly Users"
          value={apiRows.filter((r) => r.subscription_plan?.toLowerCase() === "monthly").length}
          icon={Calendar}
          color="text-green-400"
          bg="bg-green-500/10"
          delay={0.1}
        />
        <StatCard
          label="100 Day Users"
          value={apiRows.filter((r) => r.subscription_plan?.toLowerCase() === "100 day access").length}
          icon={Calendar}
          color="text-electric-purple"
          bg="bg-electric-purple/10"
          delay={0.2}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
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
        <span className="text-sm text-gray-500">
          Showing <b className="text-white">{paginatedRows.length}</b> of{" "}
          <b className="text-white">{filteredRows.length}</b> users
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
                <th className="px-6 py-4 text-center">Created Date</th>
                <th className="px-6 py-4 text-center">Dates</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Loading users…
                  </td>
                </tr>
              ) : paginatedRows.length > 0 ? (
                paginatedRows.map((row) => {
                  const plan = row.subscription_plan ?? "";
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => navigate(`/users/${row.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserRowAvatar name={row.name} imageUrl={row.image} />
                          <span className="font-medium text-white">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{row.email}</td>
                      <td className="px-6 py-4">
                        {plan ? (
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border",
                              plan.toLowerCase() === "100 day access"
                                ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20",
                            )}
                          >
                            {plan}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">{formatDate(row.createdAt)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">
                        {row.subscription_start_date || row.subscription_end_date ? (
                          <>
                            <div className="font-medium text-gray-200">{formatDate(row.subscription_start_date)}</div>
                            <div className="text-[10px] text-gray-500">to {formatDate(row.subscription_end_date)}</div>
                          </>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ isOpen: true, apiUserId: row.id });
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </motion.div>
  );
};

function UserRowAvatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);
  const showRemote = Boolean(imageUrl?.trim()) && !failed;

  return (
    <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20 overflow-hidden shrink-0">
      {showRemote ? (
        <img
          src={imageUrl!.trim()}
          alt=""
          className="size-10 rounded-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-sm leading-none">{(name?.[0] ?? "-").toUpperCase()}</span>
      )}
    </div>
  );
}

export default UsersPage;
