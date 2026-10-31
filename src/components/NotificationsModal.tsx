import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Megaphone, CheckCircle2, ShieldAlert, Sparkles, Clock, Volume2, Check } from 'lucide-react';
import { AppConfig } from '../types';
import { BrowserNotificationService } from '../services/notificationService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, config }) => {
  const [notifState, setNotifState] = useState<NotificationPermission | 'unsupported'>(
    BrowserNotificationService.getPermissionState()
  );
  const [isActivating, setIsActivating] = useState(false);

  if (!isOpen) return null;

  const handleEnablePushNotifications = async () => {
    setIsActivating(true);
    const success = await BrowserNotificationService.requestPermission();
    setNotifState(BrowserNotificationService.getPermissionState());
    setIsActivating(false);
  };

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
          {/* 0. Browser Push Notification Card */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 rounded-2xl border border-indigo-500/30 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="text-xs font-bold font-heading text-indigo-200">
                  ব্রাউজার পুশ নোটিফিকেশন অ্যালার্ট
                </span>
              </div>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                notifState === 'granted' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {notifState === 'granted' ? 'ACTIVE' : notifState === 'denied' ? 'BLOCKED' : 'OFF'}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              ম্যাচ শুরুর রুম আইডি ও পাসওয়ার্ড প্রকাশ হলে, রেজাল্ট শিট আপলোড হলে এবং এড মানি কনফার্ম হলে সরাসরি ডিভাইসে অটো নোটিফিকেশন পাবেন।
            </p>

            {notifState === 'granted' ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>ব্রাউজার নোটিফিকেশন চালু রয়েছে</span>
                </div>
                <button
                  onClick={() => BrowserNotificationService.sendNotification({
                    title: '🎮 রুম আইডি অ্যালার্ট টেস্ট!',
                    body: 'আপনার ব্রাউজার নোটিফিকেশন সিস্টেম সফলভাবে কাজ করছে।',
                  })}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold"
                >
                  টেস্ট অ্যালার্ট
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnablePushNotifications}
                disabled={isActivating || notifState === 'unsupported'}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 font-heading"
              >
                <Bell className="w-4 h-4" />
                <span>{isActivating ? 'অনুমতি নেওয়া হচ্ছে...' : '🔔 নোটিফিকেশন সুবিধা চালু করুন (Enable Alert)'}</span>
              </button>
            )}
          </div>

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
              ম্যাচ শুরু হওয়ার ঠিক ১৫ মিনিট পূর্বে অ্যাপের **"My Matches"** সেকশনে রুম আইডি ও পাসওয়ার্ড প্রকাশ করা হয়। শুধুমাত্র স্লট জয়েন করা খেলোয়াড়গণই দেখতে পারবেন।
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
