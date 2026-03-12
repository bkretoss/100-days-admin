/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  CreditCard, 
  Settings, 
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
  History
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { cn } from './lib/utils';

// --- Mock Data ---

const STATS = [
  {
    label: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-electric-blue',
    bg: 'bg-electric-blue/10',
    glow: 'neon-glow-blue'
  },
  {
    label: 'Active Subscriptions',
    value: '1,423',
    change: '+8.2%',
    trend: 'up',
    icon: Trophy,
    color: 'text-electric-purple',
    bg: 'bg-electric-purple/10',
    glow: 'neon-glow-purple'
  },
  {
    label: 'Completed Challenges',
    value: '156',
    change: '+42%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    glow: ''
  },
  {
    label: 'Expired Subscriptions',
    value: '312',
    change: '-2.1%',
    trend: 'down',
    icon: Zap,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    glow: ''
  }
];

const POPULAR_CHALLENGES = [
  { name: '100 Days of Code', participants: 847, trend: '+12%', color: 'bg-blue-500' },
  { name: '100 Days of Fitness', participants: 623, trend: '+8%', color: 'bg-green-500' },
  { name: '100 Days of Reading', participants: 456, trend: '+15%', color: 'bg-purple-500' },
  { name: '100 Days of Meditation', participants: 312, trend: '-3%', color: 'bg-orange-500' },
  { name: '100 Days of Writing', participants: 289, trend: '+5%', color: 'bg-teal-500' },
];

const CHART_DATA = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 58 },
  { name: 'Jun', value: 72 },
  { name: 'Jul', value: 85 },
  { name: 'Aug', value: 82 },
  { name: 'Sep', value: 95 },
  { name: 'Oct', value: 110 },
  { name: 'Nov', value: 105 },
  { name: 'Dec', value: 128 },
];

const USERS = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    plan: 'ELITE',
    challenge: '100 Days of Code',
    day: 67,
    progress: 67,
    status: 'Active',
    streak: 45,
    joinedDate: 'Oct 12, 2023',
    startDate: 'Oct 12, 2023',
    endDate: 'Jan 20, 2024',
    about: 'Passionate developer focusing on high-performance web applications.'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    email: 'marcus@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    plan: 'PRO',
    challenge: '100 Days of Fitness',
    day: 34,
    progress: 34,
    status: 'Active',
    streak: 32,
    joinedDate: 'Jan 15, 2024',
    startDate: 'Jan 15, 2024',
    endDate: 'Apr 25, 2024',
    about: 'Fitness enthusiast and software engineer.'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    plan: 'BASIC',
    challenge: '100 Days of Reading',
    day: 89,
    progress: 89,
    status: 'Active',
    streak: 89,
    joinedDate: 'May 05, 2023',
    startDate: 'May 05, 2023',
    endDate: 'Aug 13, 2023',
    about: 'Bookworm exploring new genres.'
  },
  {
    id: 4,
    name: 'Alex Rivera',
    email: 'alex@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    plan: 'ELITE',
    challenge: '100 Days of Meditation',
    day: 12,
    progress: 12,
    status: 'Paused',
    streak: 12,
    joinedDate: 'Jan 01, 2024',
    startDate: 'Jan 01, 2024',
    endDate: 'Apr 10, 2024',
    about: 'Mindfulness practitioner.'
  },
  {
    id: 5,
    name: 'Jordan Lee',
    email: 'jordan@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    plan: 'BASIC',
    challenge: '100 Days of Writing',
    day: 100,
    progress: 100,
    status: 'Completed',
    streak: 100,
    joinedDate: 'May 20, 2023',
    startDate: 'May 20, 2023',
    endDate: 'Aug 28, 2023',
    about: 'Aspiring novelist.'
  },
  {
    id: 6,
    name: 'Taylor Swift',
    email: 'taylor@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    plan: 'PRO',
    challenge: '100 Days of Songwriting',
    day: 13,
    progress: 13,
    status: 'Active',
    streak: 13,
    joinedDate: 'Mar 01, 2024',
    startDate: 'Mar 01, 2024',
    endDate: 'Jun 09, 2024',
    about: 'Music lover.'
  },
  {
    id: 7,
    name: 'Chris Evans',
    email: 'chris@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    plan: 'ELITE',
    challenge: '100 Days of Fitness',
    day: 45,
    progress: 45,
    status: 'Expired',
    streak: 45,
    joinedDate: 'Feb 10, 2024',
    startDate: 'Feb 10, 2024',
    endDate: 'May 21, 2024',
    about: 'Staying in shape.'
  },
  {
    id: 8,
    name: 'Zoe Kravitz',
    email: 'zoe@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    plan: 'BASIC',
    challenge: '100 Days of Yoga',
    day: 100,
    progress: 100,
    status: 'Completed',
    streak: 100,
    joinedDate: 'Jun 15, 2023',
    startDate: 'Jun 15, 2023',
    endDate: 'Sep 23, 2023',
    about: 'Finding balance.'
  },
  {
    id: 9,
    name: 'Robert Downey',
    email: 'robert@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    plan: 'PRO',
    challenge: '100 Days of Acting',
    day: 5,
    progress: 5,
    status: 'Expired',
    streak: 0,
    joinedDate: 'Jan 10, 2024',
    startDate: 'Jan 10, 2024',
    endDate: 'Apr 20, 2024',
    about: 'Method acting.'
  },
  {
    id: 10,
    name: 'Scarlett Johansson',
    email: 'scarlett@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scarlett',
    plan: 'ELITE',
    challenge: '100 Days of Languages',
    day: 78,
    progress: 78,
    status: 'Active',
    streak: 78,
    joinedDate: 'Dec 01, 2023',
    startDate: 'Dec 01, 2023',
    endDate: 'Mar 10, 2024',
    about: 'Polyglot in training.'
  },
  {
    id: 11,
    name: 'Tom Holland',
    email: 'tom@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    plan: 'BASIC',
    challenge: '100 Days of Gymnastics',
    day: 22,
    progress: 22,
    status: 'Active',
    streak: 22,
    joinedDate: 'Feb 20, 2024',
    startDate: 'Feb 20, 2024',
    endDate: 'May 31, 2024',
    about: 'Flipping around.'
  },
  {
    id: 12,
    name: 'Zendaya Coleman',
    email: 'zendaya@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zendaya',
    plan: 'PRO',
    challenge: '100 Days of Dance',
    day: 95,
    progress: 95,
    status: 'Active',
    streak: 95,
    joinedDate: 'Nov 15, 2023',
    startDate: 'Nov 15, 2023',
    endDate: 'Feb 23, 2024',
    about: 'Dancing through life.'
  }
];

const USER_PROGRESS_DATA = [
  { day: 'Day 1', value: 10 },
  { day: 'Day 10', value: 25 },
  { day: 'Day 20', value: 40 },
  { day: 'Day 30', value: 38 },
  { day: 'Day 40', value: 60 },
  { day: 'Day 50', value: 75 },
  { day: 'Day 60', value: 70 },
  { day: 'Day 70', value: 85 },
  { day: 'Day 80', value: 84 },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'task',
    title: 'Completed Daily Task',
    description: 'Day 84: Advanced React Patterns',
    time: '2 hours ago',
    icon: CheckCircle,
    color: 'text-green-400'
  },
  {
    id: 2,
    type: 'badge',
    title: 'Earned Badge',
    description: 'Consistent Coder: 30 Day Streak',
    time: '5 hours ago',
    icon: Trophy,
    color: 'text-yellow-400'
  },
  {
    id: 3,
    type: 'community',
    title: 'Posted in Community',
    description: 'Shared progress on "100 Days of Code"',
    time: 'Yesterday',
    icon: MessageSquare,
    color: 'text-blue-400'
  },
  {
    id: 4,
    type: 'subscription',
    title: 'Subscription Renewed',
    description: 'Pro Plan - Monthly',
    time: '2 days ago',
    icon: CreditCard,
    color: 'text-purple-400'
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left",
      active 
        ? "bg-white/5 border border-white/10 text-white" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-electric-blue" : "group-hover:text-electric-blue")} />
    <span className="font-medium">{label}</span>
  </button>
);

const DashboardView: React.FC<{ onUserClick: (user: any) => void, onViewAllUsers: () => void }> = ({ onUserClick, onViewAllUsers }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-8"
  >
    {/* Stats Grid */}
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group relative overflow-hidden", stat.glow)}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{stat.value}</h3>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold mt-2",
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                )}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Recent Users Section */}
      <section className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h2 
            className="text-xl font-bold text-white tracking-tight cursor-pointer hover:text-indigo-400 transition-colors"
            onClick={onViewAllUsers}
          >
            Recent Users
          </h2>
          <button 
            onClick={onViewAllUsers}
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
                  <th className="px-6 py-4">Challenge</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {USERS.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => onUserClick(user)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-300">{user.challenge}</td>
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
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        user.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                        user.status === 'Complete' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                        "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      )}>
                        {user.status}
                      </span>
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

const UsersView: React.FC<{ onUserClick: (user: any) => void }> = ({ onUserClick }) => {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | number | null }>({
    isOpen: false,
    userId: null
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
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
  const filteredUsers = USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = planFilter === 'All' || user.plan === planFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, planFilter, statusFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to proceed? This action cannot be undone."
      />

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

        <div className="flex items-center gap-2">
          <select 
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors outline-none appearance-none cursor-pointer"
          >
            <option value="All" className="bg-dark-900">Plan: All</option>
            <option value="BASIC" className="bg-dark-900">Basic</option>
            <option value="PRO" className="bg-dark-900">Pro</option>
            <option value="ELITE" className="bg-dark-900">Elite</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors outline-none appearance-none cursor-pointer"
          >
            <option value="All" className="bg-dark-900">Status: All</option>
            <option value="Active" className="bg-dark-900">Active</option>
            <option value="Completed" className="bg-dark-900">Completed</option>
            <option value="Expired" className="bg-dark-900">Expired</option>
            <option value="Paused" className="bg-dark-900">Paused</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Showing <b className="text-white">{paginatedUsers.length}</b> of <b className="text-white">{filteredUsers.length}</b> users</span>
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
              <th className="px-6 py-4 text-center">Dates</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => onUserClick(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-electric-blue/10 flex items-center justify-center text-electric-blue font-bold border border-electric-blue/20">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest border",
                      user.plan === 'ELITE' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      user.plan === 'PRO' ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" :
                      "bg-gray-500/10 text-gray-400 border-white/10"
                    )}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-400">
                    <div className="font-medium text-gray-200">{user.startDate.split(',')[0]}</div>
                    <div className="text-[10px] text-gray-500">to {user.endDate.split(',')[0]}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full rounded-full shadow-[0_0_8px_rgba(0,210,255,0.4)]" style={{ width: `${user.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-300">{user.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      user.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      user.status === 'Completed' ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" :
                      user.status === 'Expired' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-gray-500/10 text-gray-400 border-white/10"
                    )}>
                      <span className={cn("size-1.5 rounded-full", 
                        user.status === 'Active' ? "bg-green-500 animate-pulse" : 
                        user.status === 'Completed' ? "bg-electric-blue" : 
                        user.status === 'Expired' ? "bg-red-500" : "bg-gray-500"
                      )}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                        <Edit2 className="w-5 h-5" />
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

const UserDetailView: React.FC<{ user: any, onBack: () => void }> = ({ user, onBack }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    {/* Header with Back Button */}
    <div className="flex items-center justify-between">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Users</span>
      </button>
      
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-xl text-sm font-bold transition-all">
          Export Data
        </button>
        <button className="px-4 py-2 bg-electric-blue text-dark-900 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-electric-blue/20">
          Manage Account
        </button>
      </div>
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
              user.name.split(' ').map((n: string) => n[0]).join('')
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          
          <div className="flex items-center gap-2 mt-4">
            <span className={cn(
              "px-3 py-1 text-[10px] font-black tracking-widest rounded-lg border uppercase",
              user.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" :
              user.status === 'Completed' ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" :
              "bg-red-500/10 text-red-400 border-red-500/20"
            )}>
              {user.status}
            </span>
            <span className="px-3 py-1 bg-electric-purple/10 text-electric-purple text-[10px] font-black tracking-widest rounded-lg border border-electric-purple/20 uppercase">
              {user.plan} Plan
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-8">
            <button className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs">
              <Mail className="w-4 h-4" />
              Message
            </button>
            <button className="py-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Subscription Details Card */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-electric-purple/10 flex items-center justify-center text-electric-purple">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Subscription</h3>
              <p className="text-xs text-gray-500">Plan & Billing Details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">Current Plan</span>
              <span className="text-sm font-bold text-white">{user.plan}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">Start Date</span>
              <span className="text-sm font-bold text-white">{user.startDate}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-sm text-gray-400">End Date</span>
              <span className="text-sm font-bold text-white">{user.endDate}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-400">Status</span>
              <span className={cn(
                "text-sm font-bold",
                user.status === 'Active' ? "text-green-400" : 
                user.status === 'Completed' ? "text-electric-blue" : "text-red-400"
              )}>{user.status}</span>
            </div>
          </div>
        </div>

        {/* About Card */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">About User</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {user.about}
          </p>
        </div>
      </div>

      {/* Right Column: Progress & Activity */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Card */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Challenge Progress</h3>
              <p className="text-gray-500 text-xs mt-1">100 Days of Code Journey</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-electric-blue">{user.progress}/100</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Days Completed</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-500">Progress</span>
              <span className="text-electric-blue">{user.progress}%</span>
            </div>
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${user.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-electric-blue to-indigo-500 rounded-full shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              />
            </div>
          </div>

          <div className="h-64 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USER_PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141418', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Days</p>
                <p className="text-lg font-bold text-white">100</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completed</p>
                <p className="text-lg font-bold text-white">{user.progress}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Remaining</p>
                <p className="text-lg font-bold text-white">{100 - user.progress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group">
                <div className={cn("size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-white/10", activity.color)}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white">{activity.title}</p>
                    <span className="text-[10px] text-gray-500 font-medium">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-xl hover:bg-white/10 transition-all">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const ActivityLogView = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-black text-white tracking-tight">Activity Log</h1>
      <p className="text-gray-500 font-medium">Monitor all recent actions and system events</p>
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search activities..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm font-bold hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">
            Clear All Logs
          </button>
        </div>

        <div className="space-y-4">
          {RECENT_ACTIVITY.map((activity, idx) => (
            <div 
              key={activity.id} 
              className={cn(
                "flex items-center gap-6 p-4 rounded-2xl transition-all hover:bg-white/[0.02] border border-transparent hover:border-white/5 group",
                idx !== RECENT_ACTIVITY.length - 1 && "border-b border-white/5"
              )}
            >
              <div className={cn(
                "size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                activity.color
              )}>
                <activity.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white truncate">{activity.title}</h4>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{activity.time}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{activity.description}</p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Mocking more data for the log view */}
          {[5, 6, 7, 8].map((id) => (
            <div 
              key={id} 
              className="flex items-center gap-6 p-4 rounded-2xl transition-all hover:bg-white/[0.02] border border-transparent hover:border-white/5 group border-b border-white/5"
            >
              <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 text-orange-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white truncate">System Alert</h4>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">3 days ago</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">High memory usage detected on server cluster-04</p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest">
          Load Older Activities
        </button>
      </div>
    </div>
  </motion.div>
);

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('admin@100days.app');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@100days.app' && password === 'password123') {
      onLogin({ name: 'Marcus Smith', role: 'Super Admin', email });
      toast.success('Login successful. Welcome back!');
    } else {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0f1115]">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px)'
        }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-[24px] bg-[#3b82f6] flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/30 mb-4 p-2">
            <span className="text-3xl font-black leading-none">100</span>
            <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">Days</span>
            <span className="text-[5px] font-bold tracking-[0.2em] uppercase opacity-80 mt-1">Of My Journey</span>
          </div>
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
                    rememberMe ? "bg-electric-blue border-electric-blue" : "border-gray-600 group-hover:border-gray-400"
                  )}
                >
                  {rememberMe && <div className="size-1.5 bg-dark-900 rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
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
        <p className="mt-12 text-gray-500 text-xs font-medium">
          © 2026 100 Days App. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('Dashboard');
    setSelectedUser(null);
    toast.success('You have logged out successfully.');
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setActiveTab('Users'); // Ensure we are in users tab context
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors theme="dark" />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-white">
      <Toaster position="top-right" richColors theme="dark" />
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-dark-900 hidden lg:flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-electric-purple flex items-center justify-center font-bold text-white shadow-lg shadow-electric-blue/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">100<span className="text-electric-blue">Days</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => {
              setActiveTab('Dashboard');
              setSelectedUser(null);
            }}
          />
          <SidebarItem 
            icon={Users} 
            label="Users" 
            active={activeTab === 'Users'} 
            onClick={() => {
              setActiveTab('Users');
              setSelectedUser(null);
            }}
          />
          <SidebarItem 
            icon={Trophy} 
            label="Challenges" 
            active={activeTab === 'Challenges'} 
            onClick={() => setActiveTab('Challenges')}
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Reports" 
            active={activeTab === 'Reports'} 
            onClick={() => setActiveTab('Reports')}
          />
          <SidebarItem 
            icon={History} 
            label="Activity Log" 
            active={activeTab === 'Activity'} 
            onClick={() => {
              setActiveTab('Activity');
              setSelectedUser(null);
            }}
          />
          <div className="pt-4 mt-4 border-t border-white/5">
            <SidebarItem icon={Settings} label="Settings" />
          </div>
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
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-electric-purple rounded-full border-2 border-dark-900" />
              <Bell className="w-6 h-6" />
            </button>
            
            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">{user.role}</p>
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
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' ? (
              <DashboardView 
                key="dashboard" 
                onUserClick={handleUserClick} 
                onViewAllUsers={() => setActiveTab('Users')}
              />
            ) : activeTab === 'Users' ? (
              selectedUser ? (
                <UserDetailView 
                  user={selectedUser} 
                  onBack={() => setSelectedUser(null)} 
                />
              ) : (
                <UsersView onUserClick={handleUserClick} />
              )
            ) : activeTab === 'Activity' ? (
              <ActivityLogView key="activity" />
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-gray-500"
              >
                Section under development
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
