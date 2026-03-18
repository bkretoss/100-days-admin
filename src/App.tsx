/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Trophy,
  CreditCard,
  LogOut,
  Search,
  User,
  Bell,
  Plus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Zap,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  BarChart3,
  Mail,
  Ban,
  MessageSquare,
  Calendar,
  Flame,
  Clock,
  Tag,
  Percent,
  Copy,
  Check,
  Receipt,
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, LineChart, Line } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import { cn, formatDate, fromInputDate, toInputDate } from "./lib/utils";

// --- Mock Data ---

const STATS = [
  {
    label: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
    glow: "neon-glow-blue",
  },
  {
    label: "Completed Challenges",
    value: "156",
    change: "+42%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
    glow: "",
  },
  {
    label: "Active Subscriptions",
    value: "8",
    change: "+8.2%",
    trend: "up",
    icon: Trophy,
    color: "text-electric-purple",
    bg: "bg-electric-purple/10",
    glow: "neon-glow-purple",
  },
  {
    label: "Expired Subscriptions",
    value: "19",
    change: "-2.1%",
    trend: "down",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    glow: "",
  },
  {
    label: "Coupon Codes",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Tag,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    glow: "",
  },
];

const POPULAR_CHALLENGES = [
  { name: "100 Days of Code", participants: 847, trend: "+12%", color: "bg-blue-500" },
  { name: "100 Days of Fitness", participants: 623, trend: "+8%", color: "bg-green-500" },
  { name: "100 Days of Reading", participants: 456, trend: "+15%", color: "bg-purple-500" },
  { name: "100 Days of Meditation", participants: 312, trend: "-3%", color: "bg-orange-500" },
  { name: "100 Days of Writing", participants: 289, trend: "+5%", color: "bg-teal-500" },
];

const CHART_DATA = [
  { name: "Jan", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 48 },
  { name: "Apr", value: 61 },
  { name: "May", value: 58 },
  { name: "Jun", value: 72 },
  { name: "Jul", value: 85 },
  { name: "Aug", value: 82 },
  { name: "Sep", value: 95 },
  { name: "Oct", value: 110 },
  { name: "Nov", value: 105 },
  { name: "Dec", value: 128 },
];

const USERS = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    plan: "Yearly",
    challenge: "100 Days of Code",
    day: 67,
    progress: 67,
    status: "Active",
    streak: 45,
    joinedDate: "12-10-2023",
    startDate: "12-10-2023",
    endDate: "20-01-2024",
    about: "Passionate developer focusing on high-performance web applications.",
    couponUsed: "WELCOME20",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    plan: "Monthly",
    challenge: "100 Days of Fitness",
    day: 34,
    progress: 34,
    status: "Active",
    streak: 32,
    joinedDate: "15-01-2024",
    startDate: "15-01-2024",
    endDate: "25-04-2024",
    about: "Fitness enthusiast and software engineer.",
    couponUsed: null,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    plan: "Monthly",
    challenge: "100 Days of Reading",
    day: 89,
    progress: 89,
    status: "Active",
    streak: 89,
    joinedDate: "05-05-2023",
    startDate: "05-05-2023",
    endDate: "13-08-2023",
    about: "Bookworm exploring new genres.",
    couponUsed: "SUMMER50",
  },
  {
    id: 4,
    name: "Alex Rivera",
    email: "alex@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    plan: "Yearly",
    challenge: "100 Days of Meditation",
    day: 12,
    progress: 12,
    status: "Paused",
    streak: 12,
    joinedDate: "01-01-2024",
    startDate: "01-01-2024",
    endDate: "10-04-2024",
    about: "Mindfulness practitioner.",
    couponUsed: "ELITE100",
  },
  {
    id: 5,
    name: "Jordan Lee",
    email: "jordan@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    plan: "Monthly",
    challenge: "100 Days of Writing",
    day: 100,
    progress: 100,
    status: "Completed",
    streak: 100,
    joinedDate: "20-05-2023",
    startDate: "20-05-2023",
    endDate: "28-08-2023",
    about: "Aspiring novelist.",
    couponUsed: null,
  },
  {
    id: 6,
    name: "Taylor Swift",
    email: "taylor@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    plan: "Yearly",
    challenge: "100 Days of Songwriting",
    day: 13,
    progress: 13,
    status: "Active",
    streak: 13,
    joinedDate: "01-03-2024",
    startDate: "01-03-2024",
    endDate: "09-06-2024",
    about: "Music lover.",
    couponUsed: "WELCOME20",
  },
  {
    id: 7,
    name: "Chris Evans",
    email: "chris@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    plan: "Yearly",
    challenge: "100 Days of Fitness",
    day: 45,
    progress: 45,
    status: "Expired",
    streak: 45,
    joinedDate: "10-02-2024",
    startDate: "10-02-2024",
    endDate: "21-05-2024",
    about: "Staying in shape.",
    couponUsed: null,
  },
  {
    id: 8,
    name: "Zoe Kravitz",
    email: "zoe@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    plan: "Monthly",
    challenge: "100 Days of Yoga",
    day: 100,
    progress: 100,
    status: "Completed",
    streak: 100,
    joinedDate: "15-06-2023",
    startDate: "15-06-2023",
    endDate: "23-09-2023",
    about: "Finding balance.",
    couponUsed: "SUMMER50",
  },
  {
    id: 9,
    name: "Robert Downey",
    email: "robert@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    plan: "Monthly",
    challenge: "100 Days of Acting",
    day: 5,
    progress: 5,
    status: "Expired",
    streak: 0,
    joinedDate: "10-01-2024",
    startDate: "10-01-2024",
    endDate: "20-04-2024",
    about: "Method acting.",
    couponUsed: "NEWYEAR2024",
  },
  {
    id: 10,
    name: "Scarlett Johansson",
    email: "scarlett@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Scarlett",
    plan: "Yearly",
    challenge: "100 Days of Languages",
    day: 78,
    progress: 78,
    status: "Active",
    streak: 78,
    joinedDate: "01-12-2023",
    startDate: "01-12-2023",
    endDate: "10-03-2024",
    about: "Polyglot in training.",
    couponUsed: null,
  },
  {
    id: 11,
    name: "Tom Holland",
    email: "tom@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    plan: "Monthly",
    challenge: "100 Days of Gymnastics",
    day: 22,
    progress: 22,
    status: "Active",
    streak: 22,
    joinedDate: "20-02-2024",
    startDate: "20-02-2024",
    endDate: "31-05-2024",
    about: "Flipping around.",
    couponUsed: "WELCOME20",
  },
  {
    id: 12,
    name: "Zendaya Coleman",
    email: "zendaya@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zendaya",
    plan: "Yearly",
    challenge: "100 Days of Dance",
    day: 95,
    progress: 95,
    status: "Active",
    streak: 95,
    joinedDate: "15-11-2023",
    startDate: "15-11-2023",
    endDate: "23-02-2024",
    about: "Dancing through life.",
    couponUsed: null,
  },
];

const USER_PROGRESS_DATA = [
  { day: "Day 1", value: 10 },
  { day: "Day 10", value: 25 },
  { day: "Day 20", value: 40 },
  { day: "Day 30", value: 38 },
  { day: "Day 40", value: 60 },
  { day: "Day 50", value: 75 },
  { day: "Day 60", value: 70 },
  { day: "Day 70", value: 85 },
  { day: "Day 80", value: 84 },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "task",
    title: "Completed Daily Task",
    description: "Day 84: Advanced React Patterns",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    id: 2,
    type: "badge",
    title: "Earned Badge",
    description: "Consistent Coder: 30 Day Streak",
    time: "5 hours ago",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    id: 3,
    type: "community",
    title: "Posted in Community",
    description: 'Shared progress on "100 Days of Code"',
    time: "Yesterday",
    icon: MessageSquare,
    color: "text-blue-400",
  },
  {
    id: 4,
    type: "subscription",
    title: "Subscription Renewed",
    description: "Pro Plan - Monthly",
    time: "2 days ago",
    icon: CreditCard,
    color: "text-purple-400",
  },
];

const COUPONS = [
  {
    id: 1,
    code: "WELCOME20",
    discount: 20,
    type: "percentage",
    status: "active",
    usageCount: 145,
    usageLimit: 500,
    startDate: "01-01-2024",
    expiryDate: "31-12-2024",
    description: "Welcome discount for new users",
    deviceTypes: ["android", "ios"],
  },
  {
    id: 2,
    code: "SUMMER50",
    discount: 50,
    type: "fixed",
    status: "active",
    usageCount: 89,
    usageLimit: 200,
    startDate: "01-06-2024",
    expiryDate: "31-08-2024",
    description: "Summer special offer",
    deviceTypes: ["android"],
  },
  {
    id: 3,
    code: "ELITE100",
    discount: 100,
    type: "fixed",
    status: "expired",
    usageCount: 200,
    usageLimit: 200,
    startDate: "01-12-2023",
    expiryDate: "15-01-2024",
    description: "Elite plan discount",
    deviceTypes: ["ios"],
  },
  {
    id: 4,
    code: "NEWYEAR2024",
    discount: 30,
    type: "percentage",
    status: "inactive",
    usageCount: 0,
    usageLimit: 1000,
    startDate: "01-01-2024",
    expiryDate: "31-12-2024",
    description: "New Year promotion",
    deviceTypes: ["android", "ios"],
  },
];

const SUBSCRIPTIONS = [
  // Sarah Chen - Multiple subscriptions
  {
    id: 1,
    userId: 1,
    userName: "Sarah Chen",
    plan: "Yearly",
    status: "Active",
    startDate: "12-10-2023",
    endDate: "12-10-2024",
    couponCode: "WELCOME20",
    device_type: "ios",
  },
  {
    id: 13,
    userId: 1,
    userName: "Sarah Chen",
    plan: "Monthly",
    status: "Expired",
    startDate: "10-07-2023",
    endDate: "10-08-2023",
    couponCode: null,
    device_type: "ios",
  },
  {
    id: 14,
    userId: 1,
    userName: "Sarah Chen",
    plan: "Monthly",
    status: "Expired",
    startDate: "10-08-2023",
    endDate: "10-09-2023",
    couponCode: null,
    device_type: "ios",
  },

  // Marcus Johnson - Multiple subscriptions
  {
    id: 2,
    userId: 2,
    userName: "Marcus Johnson",
    plan: "Monthly",
    status: "Active",
    startDate: "15-01-2024",
    endDate: "15-02-2024",
    couponCode: null,
    device_type: "android",
  },
  {
    id: 15,
    userId: 2,
    userName: "Marcus Johnson",
    plan: "Monthly",
    status: "Expired",
    startDate: "15-12-2023",
    endDate: "15-01-2024",
    couponCode: "WELCOME20",
    device_type: "android",
  },

  // Emily Davis - Multiple subscriptions
  {
    id: 3,
    userId: 3,
    userName: "Emily Davis",
    plan: "Monthly",
    status: "Active",
    startDate: "05-05-2023",
    endDate: "05-06-2023",
    couponCode: "SUMMER50",
    device_type: "android",
  },
  {
    id: 16,
    userId: 3,
    userName: "Emily Davis",
    plan: "Monthly",
    status: "Expired",
    startDate: "05-04-2023",
    endDate: "05-05-2023",
    couponCode: null,
    device_type: "android",
  },
  {
    id: 17,
    userId: 3,
    userName: "Emily Davis",
    plan: "Yearly",
    status: "Expired",
    startDate: "05-04-2022",
    endDate: "05-04-2023",
    couponCode: "ELITE100",
    device_type: "android",
  },

  // Alex Rivera
  {
    id: 4,
    userId: 4,
    userName: "Alex Rivera",
    plan: "Yearly",
    status: "Active",
    startDate: "01-01-2024",
    endDate: "01-01-2025",
    couponCode: "ELITE100",
    device_type: "ios",
  },

  // Jordan Lee - Multiple subscriptions
  {
    id: 5,
    userId: 5,
    userName: "Jordan Lee",
    plan: "Monthly",
    status: "Expired",
    startDate: "20-05-2023",
    endDate: "20-06-2023",
    couponCode: null,
    device_type: "android",
  },
  {
    id: 18,
    userId: 5,
    userName: "Jordan Lee",
    plan: "Monthly",
    status: "Expired",
    startDate: "20-04-2023",
    endDate: "20-05-2023",
    couponCode: null,
    device_type: "android",
  },
  {
    id: 19,
    userId: 5,
    userName: "Jordan Lee",
    plan: "Yearly",
    status: "Expired",
    startDate: "20-04-2022",
    endDate: "20-04-2023",
    couponCode: "WELCOME20",
    device_type: "android",
  },

  // Taylor Swift
  {
    id: 6,
    userId: 6,
    userName: "Taylor Swift",
    plan: "Yearly",
    status: "Active",
    startDate: "01-03-2024",
    endDate: "01-03-2025",
    couponCode: "WELCOME20",
    device_type: "ios",
  },

  // Chris Evans - Multiple subscriptions
  {
    id: 7,
    userId: 7,
    userName: "Chris Evans",
    plan: "Yearly",
    status: "Expired",
    startDate: "10-02-2024",
    endDate: "10-02-2025",
    couponCode: null,
    device_type: "android",
  },
  {
    id: 20,
    userId: 7,
    userName: "Chris Evans",
    plan: "Monthly",
    status: "Expired",
    startDate: "10-01-2024",
    endDate: "10-02-2024",
    couponCode: "SUMMER50",
    device_type: "android",
  },
  {
    id: 21,
    userId: 7,
    userName: "Chris Evans",
    plan: "Monthly",
    status: "Expired",
    startDate: "10-12-2023",
    endDate: "10-01-2024",
    couponCode: null,
    device_type: "android",
  },

  // Zoe Kravitz - Multiple subscriptions
  {
    id: 8,
    userId: 8,
    userName: "Zoe Kravitz",
    plan: "Monthly",
    status: "Expired",
    startDate: "15-06-2023",
    endDate: "15-07-2023",
    couponCode: "SUMMER50",
    device_type: "ios",
  },
  {
    id: 22,
    userId: 8,
    userName: "Zoe Kravitz",
    plan: "Yearly",
    status: "Expired",
    startDate: "15-06-2022",
    endDate: "15-06-2023",
    couponCode: null,
    device_type: "ios",
  },

  // Robert Downey
  {
    id: 9,
    userId: 9,
    userName: "Robert Downey",
    plan: "Monthly",
    status: "Expired",
    startDate: "10-01-2024",
    endDate: "10-02-2024",
    couponCode: "NEWYEAR2024",
    device_type: "android",
  },

  // Scarlett Johansson - Multiple subscriptions
  {
    id: 10,
    userId: 10,
    userName: "Scarlett Johansson",
    plan: "Yearly",
    status: "Active",
    startDate: "01-12-2023",
    endDate: "01-12-2024",
    couponCode: null,
    device_type: "ios",
  },
  {
    id: 23,
    userId: 10,
    userName: "Scarlett Johansson",
    plan: "Monthly",
    status: "Expired",
    startDate: "01-11-2023",
    endDate: "01-12-2023",
    couponCode: "WELCOME20",
    device_type: "ios",
  },
  {
    id: 24,
    userId: 10,
    userName: "Scarlett Johansson",
    plan: "Monthly",
    status: "Expired",
    startDate: "01-10-2023",
    endDate: "01-11-2023",
    couponCode: null,
    device_type: "ios",
  },

  // Tom Holland - Multiple subscriptions
  {
    id: 11,
    userId: 11,
    userName: "Tom Holland",
    plan: "Monthly",
    status: "Active",
    startDate: "20-02-2024",
    endDate: "20-03-2024",
    couponCode: "WELCOME20",
    device_type: "android",
  },
  {
    id: 25,
    userId: 11,
    userName: "Tom Holland",
    plan: "Monthly",
    status: "Expired",
    startDate: "20-01-2024",
    endDate: "20-02-2024",
    couponCode: null,
    device_type: "android",
  },

  // Zendaya Coleman - Multiple subscriptions
  {
    id: 12,
    userId: 12,
    userName: "Zendaya Coleman",
    plan: "Yearly",
    status: "Active",
    startDate: "15-11-2023",
    endDate: "15-11-2024",
    couponCode: null,
    device_type: "ios",
  },
  {
    id: 26,
    userId: 12,
    userName: "Zendaya Coleman",
    plan: "Yearly",
    status: "Expired",
    startDate: "15-11-2022",
    endDate: "15-11-2023",
    couponCode: "ELITE100",
    device_type: "ios",
  },
  {
    id: 27,
    userId: 12,
    userName: "Zendaya Coleman",
    plan: "Monthly",
    status: "Expired",
    startDate: "15-10-2022",
    endDate: "15-11-2022",
    couponCode: null,
    device_type: "ios",
  },
];

// --- Components ---

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  to,
}: {
  icon: any;
  label: string;
  active?: boolean;
  to: string;
}) => {
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

const DashboardView: React.FC<{
  couponsCount: number;
}> = ({ couponsCount }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {STATS.map((stat, i) => {
            const displayValue = stat.label === "Coupon Codes" ? couponsCount.toString() : stat.value;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden",
                  stat.glow,
                )}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{displayValue}</h3>
                  </div>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users Section */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold text-white tracking-tight cursor-pointer hover:text-indigo-400 transition-colors"
              onClick={() => navigate("/users")}
            >
              Recent Users
            </h2>
            <button
              onClick={() => navigate("/users")}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1 transition-colors"
            >
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
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
                            <div
                              className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                              style={{ width: `${user.progress}%` }}
                            ></div>
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
      </div>
    </motion.div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md glass-card p-8 shadow-2xl border-white/10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-gray-400 text-sm mt-1">{message}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const CouponModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  coupon?: any;
}> = ({ isOpen, onClose, onSave, coupon }) => {
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percentage",
    status: "active",
    usageLimit: "",
    startDate: "",
    expiryDate: "",
    deviceTypes: [] as string[],
    description: "",
  });
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  React.useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discount: coupon.discount.toString(),
        type: coupon.type,
        status: coupon.status,
        usageLimit: coupon.usageLimit.toString(),
        startDate: toInputDate(coupon.startDate || ""),
        expiryDate: toInputDate(coupon.expiryDate),
        deviceTypes: coupon.deviceTypes || [],
        description: coupon.description,
      });
    } else {
      setFormData({
        code: "",
        discount: "",
        type: "percentage",
        status: "active",
        usageLimit: "",
        startDate: "",
        expiryDate: "",
        deviceTypes: [],
        description: "",
      });
    }
  }, [coupon, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.discount ||
      !formData.usageLimit ||
      !formData.startDate ||
      !formData.expiryDate ||
      !formData.deviceTypes.length
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave({
      code: formData.code.toUpperCase(),
      discount: parseFloat(formData.discount),
      type: formData.type,
      status: formData.status,
      usageLimit: parseInt(formData.usageLimit),
      startDate: fromInputDate(formData.startDate),
      expiryDate: fromInputDate(formData.expiryDate),
      deviceTypes: formData.deviceTypes,
      description: formData.description,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-card p-8 shadow-2xl border-white/10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-electric-purple/10 flex items-center justify-center text-electric-purple border border-electric-purple/20">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{coupon ? "Edit Coupon" : "Add New Coupon"}</h3>
                  <p className="text-gray-400 text-sm mt-1">Create or modify discount codes</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Discount Value * (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="20"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      className={cn(
                        "w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all",
                        statusDropdownOpen ? "border-electric-blue/50 ring-2 ring-electric-blue/20" : "border-white/10 hover:border-white/20",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "size-2 rounded-full",
                          formData.status === "active" ? "bg-green-400" : "bg-gray-400"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          formData.status === "active" ? "text-green-400" : "text-gray-400"
                        )}>
                          {formData.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform shrink-0", statusDropdownOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {statusDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-full bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                          >
                            {[
                              { value: "active", label: "Active", dot: "bg-green-400", text: "text-green-400" },
                              { value: "inactive", label: "Inactive", dot: "bg-gray-400", text: "text-gray-400" },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setFormData({ ...formData, status: opt.value }); setStatusDropdownOpen(false); }}
                                className={cn("w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left", formData.status === opt.value ? "bg-white/[0.04]" : "hover:bg-white/[0.03]")}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={cn("size-2 rounded-full", opt.dot)} />
                                  <span className={cn("text-sm font-medium", opt.text)}>{opt.label}</span>
                                </div>
                                {formData.status === opt.value && <Check className="w-4 h-4 text-electric-blue" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage Limit *</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    min={formData.startDate || undefined}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Device Type *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
                    className={cn(
                      "w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all",
                      deviceDropdownOpen ? "border-electric-blue/50 ring-2 ring-electric-blue/20" : "border-white/10 hover:border-white/20",
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {formData.deviceTypes.length === 0 ? (
                        <span className="text-gray-500">Select device type</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {formData.deviceTypes.map((d: string) => (
                            <span key={d} className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border",
                              d === "ios" ? "bg-electric-blue/15 text-electric-blue border-electric-blue/30" : "bg-green-500/15 text-green-400 border-green-500/30",
                            )}>
                              {d === "ios" ? "iOS" : "Android"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2", deviceDropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {deviceDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDeviceDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-full bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                        >
                          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Platforms</span>
                            {formData.deviceTypes.length > 0 && (
                              <button type="button" onClick={() => setFormData({ ...formData, deviceTypes: [] })} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors font-bold">Clear</button>
                            )}
                          </div>
                          {["ios", "android"].map((value) => {
                            const selected = formData.deviceTypes.includes(value);
                            const label = value === "ios" ? "iOS" : "Android";
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setFormData({ ...formData, deviceTypes: selected ? formData.deviceTypes.filter((d: string) => d !== value) : [...formData.deviceTypes, value] })}
                                className={cn("w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left", selected ? "bg-white/[0.04]" : "hover:bg-white/[0.03]")}
                              >
                                <span className={cn("text-sm font-medium", selected ? "text-white" : "text-gray-400")}>{label}</span>
                                {selected && <Check className="w-4 h-4 text-electric-blue" />}
                              </button>
                            );
                          })}
                          <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">{formData.deviceTypes.length === 0 ? "No platform selected" : `${formData.deviceTypes.length} platform${formData.deviceTypes.length > 1 ? "s" : ""} selected`}</span>
                            {formData.deviceTypes.length > 0 && (
                              <button type="button" onClick={() => setDeviceDropdownOpen(false)} className="text-[10px] font-bold text-electric-blue hover:opacity-80 transition-opacity">Done ✓</button>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the coupon"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-electric-blue text-dark-900 font-bold hover:opacity-90 transition-all shadow-lg shadow-electric-blue/20"
                >
                  {coupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const UsersView: React.FC = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | number | null }>({
    isOpen: false,
    userId: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeleteClick = (e: React.MouseEvent, userId: string | number) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, userId });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.userId) {
      toast.success(`User ${deleteModal.userId} deleted successfully`);
    }
  };

  // Filter logic
  const filteredUsers = USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = planFilter === "All" || user.plan === planFilter;

    return matchesSearch && matchesPlan;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, planFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to proceed? This action cannot be undone."
      />

      {/* Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{USERS.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-electric-blue/10 text-electric-blue border border-electric-blue/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Monthly Users</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                {USERS.filter((u) => u.plan === "Monthly").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/20">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Yearly Users</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                {USERS.filter((u) => u.plan === "Yearly").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
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

          {/* Plan Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors min-w-[140px]"
            >
              <CreditCard className="w-4 h-4" />
              <span className="flex-1 text-left">{planFilter === "All" ? "Plan: All" : planFilter}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isPlanDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isPlanDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsPlanDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                  >
                    {[
                      { value: "All", label: "Plan: All", icon: CreditCard },
                      { value: "Monthly", label: "Monthly", icon: Calendar, color: "text-green-400" },
                      { value: "Yearly", label: "Yearly", icon: Calendar, color: "text-electric-blue" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setPlanFilter(option.value);
                          setIsPlanDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                          planFilter === option.value
                            ? "bg-electric-blue/10 text-white"
                            : "text-gray-400 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <option.icon className={cn("w-4 h-4", option.color || "text-gray-500")} />
                        <span className="flex-1">{option.label}</span>
                        {planFilter === option.value && <Check className="w-4 h-4 text-electric-blue" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Showing <b className="text-white">{paginatedUsers.length}</b> of{" "}
            <b className="text-white">{filteredUsers.length}</b> users
          </span>
        </div>
      </div>

      {/* Table Card */}
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
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border",
                          user.plan === "Yearly"
                            ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20",
                        )}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.couponUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                          <Tag className="w-3 h-3" />
                          {user.couponUsed}
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
                          <div
                            className="bg-electric-blue h-full rounded-full shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-300">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                          onClick={(e) => handleDeleteClick(e, user.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages || 1}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/20"
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserDetailView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/").pop() || "0");
  const user = USERS.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 font-medium">User not found</p>
          <button
            onClick={() => navigate("/users")}
            className="mt-4 px-4 py-2 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  // Get all subscriptions for this user
  const userSubscriptions = SUBSCRIPTIONS.filter((sub) => sub.userId === user.id);
  const activeSubscription = userSubscriptions.find((sub) => sub.status === "Active") || userSubscriptions[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Subscription Details */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-blue to-electric-purple"></div>

            <div className="size-24 rounded-full bg-dark-800 border-4 border-white/5 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-2xl shadow-electric-blue/10 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
              )}
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-electric-purple/10 text-electric-purple text-[10px] font-black tracking-widest rounded-lg border border-electric-purple/20 uppercase">
                {user.plan}
              </span>
            </div>
          </div>

          {/* Current Subscription Details Card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-electric-purple/10 flex items-center justify-center text-electric-purple">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Current Subscription</h3>
                <p className="text-xs text-gray-500">Active Plan Details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Current Plan</span>
                <span className="text-sm font-bold text-white">{user.plan}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Coupon Used</span>
                {user.couponUsed ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                    <Tag className="w-3 h-3" />
                    {user.couponUsed}
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">Not Used</span>
                )}
              </div>
              {user.couponUsed && activeSubscription && (
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-sm text-gray-400">Device Type</span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold  tracking-widest border",
                      activeSubscription.device_type === "ios"
                        ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20",
                    )}
                  >
                    {activeSubscription.device_type === "ios" ? "iOS" : "Android"}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Start Date</span>
                <span className="text-sm font-bold text-white">{formatDate(user.startDate)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-400">End Date</span>
                <span className="text-sm font-bold text-white">{formatDate(user.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Details & Subscription History */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Details Card */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Profile Details</h3>
                <p className="text-gray-500 text-xs mt-1">User information and settings</p>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4" />
                  <span>Job Title</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                  {user.challenge || "Not specified"}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <Trophy className="w-4 h-4" />
                  <span>Industry</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                  Technology
                </div>
              </div>

              {/* Geographic Scope */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>Geographic Scope</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">Country</div>
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4" />
                  <span>Company Type</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                  Public Company
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                  New York
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm">
                  {formatDate(user.startDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription History Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Subscription History</h3>
                <p className="text-xs text-gray-500">All subscriptions for this user</p>
              </div>
            </div>

            {userSubscriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">End Date</th>
                      <th className="px-4 py-3">Coupon</th>
                      <th className="px-4 py-3">Device Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest border",
                              sub.plan === "Yearly"
                                ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20",
                            )}
                          >
                            {sub.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                              sub.status === "Active"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20",
                            )}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.startDate)}</td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-medium">{formatDate(sub.endDate)}</td>
                        <td className="px-4 py-3">
                          {sub.couponCode ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                              <Tag className="w-2.5 h-2.5" />
                              {sub.couponCode}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-medium">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {sub.couponCode ? (
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold  tracking-widest border",
                                sub.device_type === "ios"
                                  ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                  : "bg-green-500/10 text-green-400 border-green-500/20",
                              )}
                            >
                              {sub.device_type === "ios" ? "iOS" : "Android"}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-medium">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No subscription history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CouponsView = () => {
  const [coupons, setCoupons] = useState(COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; couponId: number | null }>({
    isOpen: false,
    couponId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || coupon.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate coupon statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const inactiveCoupons = coupons.filter((c) => c.status === "inactive").length;
  const expiredCoupons = coupons.filter((c) => c.status === "expired").length;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = (couponData: any) => {
    const newCoupon = {
      id: Math.max(...coupons.map((c) => c.id)) + 1,
      ...couponData,
      usageCount: 0,
    };
    setCoupons([...coupons, newCoupon]);
    setShowAddModal(false);
    toast.success("Coupon created successfully!");
  };

  const handleEditCoupon = (couponData: any) => {
    setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? { ...c, ...couponData } : c)));
    setEditingCoupon(null);
    toast.success("Coupon updated successfully!");
  };

  const handleDeleteCoupon = () => {
    if (deleteModal.couponId) {
      setCoupons(coupons.filter((c) => c.id !== deleteModal.couponId));
      toast.success("Coupon deleted successfully!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, couponId: null })}
        onConfirm={handleDeleteCoupon}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This action cannot be undone."
      />

      <CouponModal
        isOpen={showAddModal || editingCoupon !== null}
        onClose={() => {
          setShowAddModal(false);
          setEditingCoupon(null);
        }}
        onSave={editingCoupon ? handleEditCoupon : handleAddCoupon}
        coupon={editingCoupon}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Coupon Codes</h1>
          <p className="text-gray-500 font-medium mt-1">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-electric-blue/20"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Coupons</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{totalCoupons}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-electric-blue/10 text-electric-blue">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Coupons</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{activeCoupons}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Inactive Coupons</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{inactiveCoupons}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500/10 text-gray-400">
              <Ban className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Expired Coupons</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{expiredCoupons}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search coupon codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64"
          />
        </div>

        {/* Custom Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors min-w-[140px]"
          >
            <Filter className="w-4 h-4" />
            <span className="flex-1 text-left">
              {statusFilter === "All" ? "Status: All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isStatusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                >
                  {[
                    { value: "All", label: "Status: All", icon: Filter },
                    { value: "active", label: "Active", icon: CheckCircle, color: "text-green-400" },
                    { value: "inactive", label: "Inactive", icon: Ban, color: "text-gray-400" },
                    { value: "expired", label: "Expired", icon: AlertCircle, color: "text-red-400" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                        statusFilter === option.value
                          ? "bg-electric-blue/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <option.icon className={cn("w-4 h-4", option.color || "text-gray-500")} />
                      <span className="flex-1">{option.label}</span>
                      {statusFilter === option.value && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Device Type</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCoupons.length > 0 ? (
                paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{coupon.code}</span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="p-1 text-gray-500 hover:text-electric-blue transition-colors"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.deviceTypes && coupon.deviceTypes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {coupon.deviceTypes.map((dt: string) => (
                            <span
                              key={dt}
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold  tracking-widest border",
                                dt === "ios"
                                  ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                                  : "bg-green-500/10 text-green-400 border-green-500/20",
                              )}
                            >
                              {dt === "ios" ? "iOS" : "Android"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-electric-blue">
                        {coupon.type === "percentage" ? `${coupon.discount}%` : `${coupon.discount}%`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          coupon.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : coupon.status === "inactive"
                              ? "bg-gray-500/10 text-gray-400 border-white/10"
                              : "bg-red-500/10 text-red-400 border-red-500/20",
                        )}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="bg-electric-blue h-full rounded-full"
                              style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-300">
                            {coupon.usageCount}/{coupon.usageLimit}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{coupon.startDate ? formatDate(coupon.startDate) : "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{formatDate(coupon.expiryDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{coupon.description}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCoupon(coupon)}
                          className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, couponId: coupon.id })}
                          className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No coupons found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages || 1}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/20"
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SubscriptionsView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter subscriptions based on search and plan (excluding status for box counts)
  const baseFilteredSubscriptions = SUBSCRIPTIONS.filter((sub) => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "All" || sub.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  // Calculate counts based on current filters (search + plan)
  const activeCount = baseFilteredSubscriptions.filter((sub) => sub.status === "Active").length;
  const expiredCount = baseFilteredSubscriptions.filter((sub) => sub.status === "Expired").length;

  // Apply all filters including status for the table
  const filteredSubscriptions = baseFilteredSubscriptions.filter((sub) => {
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchesStatus;
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, planFilter, statusFilter]);

  const handleStatusBoxClick = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Subscriptions</h1>
          <p className="text-gray-500 font-medium mt-1">Manage user subscriptions and plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Subscriptions</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{SUBSCRIPTIONS.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-electric-blue/10 text-electric-blue border border-electric-blue/20">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => handleStatusBoxClick("Active")}
          className={cn(
            "glass-card p-6 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden",
            statusFilter === "Active" ? "ring-2 ring-green-500/50 bg-green-500/5" : "",
          )}
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Subscriptions</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{activeCount}</h3>
              {statusFilter === "Active" && (
                <p className="text-green-400 text-xs font-bold mt-2 uppercase tracking-wider">Filtered</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => handleStatusBoxClick("Expired")}
          className={cn(
            "glass-card p-6 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden",
            statusFilter === "Expired" ? "ring-2 ring-red-500/50 bg-red-500/5" : "",
          )}
        >
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium">Expired Subscriptions</p>
              <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{expiredCount}</h3>
              {statusFilter === "Expired" && (
                <p className="text-red-400 text-xs font-bold mt-2 uppercase tracking-wider">Filtered</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64"
          />
        </div>

        {/* Custom Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsPlanDropdownOpen(false);
            }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors min-w-[140px]"
          >
            <Filter className="w-4 h-4" />
            <span className="flex-1 text-left">{statusFilter === "All" ? "Status: All" : statusFilter}</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isStatusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                >
                  {[
                    { value: "All", label: "Status: All", icon: Filter },
                    { value: "Active", label: "Active", icon: CheckCircle, color: "text-green-400" },
                    { value: "Expired", label: "Expired", icon: AlertCircle, color: "text-red-400" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                        statusFilter === option.value
                          ? "bg-electric-blue/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <option.icon className={cn("w-4 h-4", option.color || "text-gray-500")} />
                      <span className="flex-1">{option.label}</span>
                      {statusFilter === option.value && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Custom Plan Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsPlanDropdownOpen(!isPlanDropdownOpen);
              setIsStatusDropdownOpen(false);
            }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors min-w-[140px]"
          >
            <CreditCard className="w-4 h-4" />
            <span className="flex-1 text-left">{planFilter === "All" ? "Plan: All" : planFilter}</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isPlanDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isPlanDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsPlanDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                >
                  {[
                    { value: "All", label: "Plan: All", icon: CreditCard },
                    { value: "Monthly", label: "Monthly", icon: Calendar, color: "text-green-400" },
                    { value: "Yearly", label: "Yearly", icon: Calendar, color: "text-electric-blue" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setPlanFilter(option.value);
                        setIsPlanDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                        planFilter === option.value
                          ? "bg-electric-blue/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <option.icon className={cn("w-4 h-4", option.color || "text-gray-500")} />
                      <span className="flex-1">{option.label}</span>
                      {planFilter === option.value && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {(statusFilter !== "All" || planFilter !== "All") && (
          <button
            onClick={() => {
              setStatusFilter("All");
              setPlanFilter("All");
            }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            Clear All Filters
            <span className="text-electric-blue">×</span>
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Device Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedSubscriptions.length > 0 ? (
                paginatedSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20">
                          {sub.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-white">{sub.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border",
                          sub.plan === "Yearly"
                            ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                            : "bg-green-500/10 text-green-400 border-green-500/20",
                        )}
                      >
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          sub.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20",
                        )}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-medium">{formatDate(sub.startDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-medium">{formatDate(sub.endDate)}</td>
                    <td className="px-6 py-4">
                      {sub.couponCode ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-electric-purple/10 text-electric-purple border border-electric-purple/20">
                          <Tag className="w-3 h-3" />
                          {sub.couponCode}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Not Used</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {sub.couponCode ? (
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold  tracking-widest border",
                            sub.device_type === "ios"
                              ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20"
                              : "bg-green-500/10 text-green-400 border-green-500/20",
                          )}
                        >
                          {sub.device_type === "ios" ? "iOS" : "Android"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No subscriptions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Page <b className="text-white">{currentPage}</b> of <b className="text-white">{totalPages || 1}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-electric-blue text-white shadow-lg shadow-electric-blue/20"
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CouponApplySection = () => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const validateCoupon = () => {
    setIsValidating(true);
    setError("");

    setTimeout(() => {
      const coupon = COUPONS.find((c) => c.code === couponCode.toUpperCase());

      if (!coupon) {
        setError("Invalid coupon code");
        setIsValidating(false);
        toast.error("Invalid coupon code");
        return;
      }

      if (coupon.status === "expired") {
        setError("This coupon has expired");
        setIsValidating(false);
        toast.error("This coupon has expired");
        return;
      }

      if (coupon.status === "inactive") {
        setError("This coupon is not active");
        setIsValidating(false);
        toast.error("This coupon is not active");
        return;
      }

      if (coupon.usageCount >= coupon.usageLimit) {
        setError("This coupon has reached its usage limit");
        setIsValidating(false);
        toast.error("This coupon has reached its usage limit");
        return;
      }

      setAppliedCoupon(coupon);
      setIsValidating(false);
      toast.success(
        `Coupon applied! You saved ${coupon.type === "percentage" ? coupon.discount + "%" : "$" + coupon.discount}`,
      );
    }, 800);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError("");
    toast.info("Coupon removed");
  };

  const basePrice = 99.99;
  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (basePrice * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const finalPrice = basePrice - discount;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl bg-electric-purple/10 flex items-center justify-center text-electric-purple">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Apply Coupon</h3>
          <p className="text-xs text-gray-500">Enter your discount code</p>
        </div>
      </div>

      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="Enter coupon code"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all placeholder:text-gray-600"
            />
            <button
              onClick={validateCoupon}
              disabled={!couponCode || isValidating}
              className="px-6 py-2.5 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? "Validating..." : "Apply"}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold text-white">{appliedCoupon.code}</span>
              </div>
              <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-white transition-colors">
                Remove
              </button>
            </div>
            <p className="text-xs text-gray-400">{appliedCoupon.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Discount</span>
              <span className="text-green-400 font-bold">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-white/5">
              <span className="text-white font-bold">Total</span>
              <span className="text-electric-blue font-black">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState("admin@100days.app");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@100days.app" && password === "password123") {
      onLogin({ name: "Marcus Smith", role: "Super Admin", email });
      toast.success("Login successful. Welcome back!");
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0f1115]">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
        }}
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <img src="/images/Asset_4_3.png" alt="100 Days Challenge" className="w-20 h-20 rounded-2xl mb-4" />
          <h1 className="text-3xl font-black text-white tracking-tight">100 Days App</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-[#1a1d24] rounded-[32px] p-10 shadow-2xl border border-white/5"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-2">Please enter your credentials to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@100days.app"
                  className="w-full bg-[#23272f] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 transition-all outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#23272f] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 focus:border-electric-blue/50 transition-all outline-none placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "size-4 rounded-full border flex items-center justify-center transition-all",
                    rememberMe
                      ? "bg-electric-blue border-electric-blue"
                      : "border-gray-600 group-hover:border-gray-400",
                  )}
                >
                  {rememberMe && <div className="size-1.5 bg-dark-900 rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-4"
            >
              Sign in
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="mt-12 text-gray-500 text-xs font-medium">© 2026 100 Days App. All rights reserved.</p>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [coupons, setCoupons] = useState(COUPONS);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (userData: any) => {
    setUser(userData);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
    toast.success("You have logged out successfully.");
  };

  const currentPath = location.pathname;

  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <div className="flex h-screen overflow-hidden bg-dark-900 text-white">
                {/* Sidebar */}
                <aside className="w-64 border-r border-white/5 bg-dark-900 hidden lg:flex flex-col shrink-0">
                  <div className="p-6 flex items-center">
                    <img src="/images/Asset_4_3.png" alt="100 Days Challenge" className="w-10 h-10 rounded-lg" />
                  </div>

                  <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <SidebarItem
                      icon={LayoutDashboard}
                      label="Dashboard"
                      active={currentPath === "/dashboard" || currentPath === "/"}
                      to="/dashboard"
                    />
                    <SidebarItem icon={Users} label="Users" active={currentPath.startsWith("/users")} to="/users" />
                    <SidebarItem icon={Tag} label="Coupons" active={currentPath === "/coupons"} to="/coupons" />
                    <SidebarItem
                      icon={Receipt}
                      label="Subscriptions"
                      active={currentPath === "/subscriptions"}
                      to="/subscriptions"
                    />
                  </nav>

                  <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="size-8 rounded-full bg-dark-800 overflow-hidden border border-white/10">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Admin" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {/* Header */}
                  <header className="h-20 border-b border-white/5 flex items-center justify-end px-8 bg-dark-900/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                            {user.role}
                          </p>
                        </div>
                        <div className="size-10 rounded-full border-2 border-electric-purple p-0.5 flex items-center justify-center">
                          <div className="size-full rounded-full bg-dark-800 flex items-center justify-center text-gray-400">
                            <User className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Scrollable Area */}
                  <div className="flex-1 overflow-y-auto p-8">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardView couponsCount={coupons.length} />} />
                      <Route path="/users" element={<UsersView />} />
                      <Route path="/users/:id" element={<UserDetailView />} />
                      <Route path="/coupons" element={<CouponsView />} />
                      <Route path="/subscriptions" element={<SubscriptionsView />} />
                    </Routes>
                  </div>
                </main>
              </div>
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
