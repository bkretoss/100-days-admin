import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface Option {
  value: string;
  label: string;
  icon: React.ElementType;
  color?: string;
}

interface FilterDropdownProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, options, onChange, isOpen, onToggle, onClose }) => {
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:border-electric-blue transition-colors min-w-[140px]"
      >
        <selected.icon className={cn("w-4 h-4", selected.color || "text-gray-500")} />
        <span className="flex-1 text-left">{selected.label}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#1a1d24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { onChange(option.value); onClose(); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left",
                    value === option.value ? "bg-electric-blue/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <option.icon className={cn("w-4 h-4", option.color || "text-gray-500")} />
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 text-electric-blue" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
