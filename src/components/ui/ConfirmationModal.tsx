import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
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
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting…" : "Confirm"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmationModal;
