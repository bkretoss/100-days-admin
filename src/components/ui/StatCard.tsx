import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  glow?: string;
  delay?: number;
  onClick?: () => void;
  highlight?: boolean;
  highlightColor?: string;
  badge?: string;
  badgeColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bg, glow = "", delay = 0, onClick, highlight, highlightColor, badge, badgeColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className={cn(
      "glass-card p-6 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden",
      glow,
      highlight && highlightColor,
    )}
  >
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</h3>
        {badge && <p className={cn("text-xs font-bold mt-2 uppercase tracking-wider", badgeColor)}>{badge}</p>}
      </div>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", bg, color, `border-current/20`)}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
