import React from 'react';
import { motion } from 'motion/react';
import { X, Bell, Megaphone, CheckCircle2, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { AppConfig } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, config }) => {
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
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-600 via-red-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base font-heading">
                অফিসিয়াল নোটিফিকেশন সেন্টার
              </h3>
              <p className="text-[11px] text-red-100">
                S1 TENDO PRO এর সকল গুরুত্বপূর্ণ আপডেট ও নোটিশ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* 1. Main Live Notice */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 font-heading">
              <Megaphone className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>জরুরি ঘোষণা ও নোটিশ</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
              {config.noticeText}
            </p>
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> আপডেট করা হয়েছে: আজ
            </div>
          </div>

          {/* 2. Tournament Room Password Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 font-heading">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>রুম আইডি ও পাসওয়ার্ড নিয়মাবলী</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              ম্যাচ শুরু হওয়ার ঠিক ১৫ মিনিট পূর্বে অ্যাপের **"My Matches"** সেクションে রুম আইডি ও পাসওয়ার্ড প্রকাশ করা হয়। শুধুমাত্র স্লট জয়েন করা খেলোয়াড়গণই দেখতে পারবেন।
            </p>
          </div>

          {/* 3. Anti-Cheat & Rules List */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white font-heading">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>টুর্নামেন্টের সাধারণ নিয়ম ও শর্তাবলী</span>
            </div>

            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {config.rulesText.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
