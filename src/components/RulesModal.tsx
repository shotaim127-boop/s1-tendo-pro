import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AppConfig } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-100" />
            <h3 className="font-bold text-base font-heading">
              All Rules & Terms
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-gray-700 dark:text-gray-300">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>খেলোয়াড়দের অবগতির জন্য:</strong> ফেয়ার প্লে বজায় রাখতে নিচের নিয়মগুলো কঠোরভাবে অনুসরণ করা বাধ্যতামূলক।
            </span>
          </div>

          <div className="space-y-2.5">
            {config.rulesText.map((rule, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-100 dark:border-slate-800 leading-relaxed font-medium"
              >
                {rule}
              </div>
            ))}
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>
              নিয়ম ভঙ্গ করলে একাউন্ট আজীবনের জন্য ব্যান করা হবে এবং ওয়ালেট ব্যালেন্স বাজেয়াপ্ত করা হবে।
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
