import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { STATS } from "../data/mockData";
import { fetchAdminUsers } from "../services/usersApi";
import StatCard from "../components/ui/StatCard";

const RECENT_USERS = [
  { id: 1,  name: "Sarah Chen",         email: "sarah@email.com",    day: 67,  progress: 67  },
  { id: 2,  name: "Marcus Johnson",      email: "marcus@email.com",   day: 34,  progress: 34  },
  { id: 3,  name: "Emily Davis",         email: "emily@email.com",    day: 89,  progress: 89  },
  { id: 4,  name: "Alex Rivera",         email: "alex@email.com",     day: 12,  progress: 12  },
  { id: 5,  name: "Jordan Lee",          email: "jordan@email.com",   day: 100, progress: 100 },
  { id: 6,  name: "Taylor Swift",        email: "taylor@email.com",   day: 13,  progress: 13  },
  { id: 7,  name: "Chris Evans",         email: "chris@email.com",    day: 45,  progress: 45  },
  { id: 8,  name: "Zoe Kravitz",         email: "zoe@email.com",      day: 100, progress: 100 },
  { id: 9,  name: "Robert Downey",       email: "robert@email.com",   day: 5,   progress: 5   },
  { id: 10, name: "Scarlett Johansson",  email: "scarlett@email.com", day: 78,  progress: 78  },
  { id: 11, name: "Tom Holland",         email: "tom@email.com",      day: 22,  progress: 22  },
  { id: 12, name: "Zendaya Coleman",     email: "zendaya@email.com",  day: 95,  progress: 95  },
];

const DASHBOARD_STATS = STATS.filter((stat) => stat.label !== "Coupon Codes");

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminUsers(1, 100)
      .then((rows) => setTotalUsers(rows.length))
      .catch(() => setTotalUsers(null));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_STATS.map((stat, i) => (
            <div
              key={stat.label}
              onClick={() => {
                if (stat.label === "Total Users") navigate("/users");
                else if (stat.label === "Active Subscriptions") navigate("/subscriptions?status=Active");
              }}
              className={stat.label === "Total Users" || stat.label === "Active Subscriptions" ? "cursor-pointer" : ""}
            >
              <StatCard
                label={stat.label}
                value={stat.label === "Total Users" && totalUsers !== null ? totalUsers : stat.value}
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
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {RECENT_USERS.map((user) => (
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
