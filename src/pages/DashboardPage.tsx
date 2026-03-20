import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { STATS, USERS } from "../data/mockData";
import StatCard from "../components/ui/StatCard";

interface DashboardPageProps {
  couponsCount: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ couponsCount }) => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS.map((stat, i) => (
            <StatCard
              key={i}
              label={stat.label}
              value={stat.label === "Coupon Codes" ? couponsCount : stat.value}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
              glow={stat.glow}
              delay={i * 0.1}
            />
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
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-gray-500">Day {user.day}</span>
                          <span className="text-indigo-400">{user.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${user.progress}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default DashboardPage;
