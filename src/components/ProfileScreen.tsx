import React, { useState } from 'react';
import { Wallet, Banknote, History, UserCheck, BookOpen, BarChart3, Code2, ChevronRight, LogOut, ShieldAlert, Sparkles, Smartphone, MessageCircle, Copy, Check } from 'lucide-react';
import { UserAccount, AppConfig } from '../types';

interface ProfileScreenProps {
  currentUser: UserAccount | null;
  config: AppConfig;
  onOpenWallet: () => void;
  onOpenWithdraw: () => void;
  onOpenHistory: () => void;
  onOpenMyProfile: () => void;
  onOpenRules: () => void;
  onOpenTopPlayers: () => void;
  onOpenAdminAuth: () => void;
  onLogout: () => void;
  onNeedAuth: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  config,
  onOpenWallet,
  onOpenWithdraw,
  onOpenHistory,
  onOpenMyProfile,
  onOpenRules,
  onOpenTopPlayers,
  onOpenAdminAuth,
  onLogout,
  onNeedAuth,
}) => {
  const [showDevModal, setShowDevModal] = useState(false);
  const tapCountRef = React.useRef(0);
  const devTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Secret Admin trigger: 15 taps OR 3-second long press
  // Single click: Immediately opens WhatsApp 01627290830
  const handleDevClick = () => {
    tapCountRef.current += 1;
    const currentTaps = tapCountRef.current;

    if (devTimerRef.current) clearTimeout(devTimerRef.current);

    if (currentTaps >= 15) {
      tapCountRef.current = 0;
      setShowDevModal(false);
      onOpenAdminAuth();
    } else {
      devTimerRef.current = setTimeout(() => {
        if (tapCountRef.current === 1) {
          setShowDevModal(true);
          const whatsappUrl = 'https://wa.me/8801627290830?text=' + encodeURIComponent('হ্যালো ডেভেলপার, S1 TENDO PRO অ্যাপ থেকে যোগাযোগ করছি।');
          window.open(whatsappUrl, '_blank');
        }
        tapCountRef.current = 0;
      }, 350);
    }
  };

  // Long-press handler: hold for 3 seconds to open admin
  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      setShowDevModal(false);
      onOpenAdminAuth();
    }, 3000);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  if (!currentUser) {
    return (
      <div className="pb-24 pt-8 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
          👤
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          আপনার প্রোফাইল দেখতে লগইন করুন
        </h3>
        <p className="text-xs text-gray-500">
          পূর্বের জিমেইল দিয়ে লগইন করলেই আপনার সমস্ত ব্যালেন্স ও ট্রানজেকশন হিস্ট্রি ফিরে পাবেন।
        </p>
        <button
          onClick={onNeedAuth}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          লগইন / রেজিস্ট্রেশন
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 max-w-md mx-auto">
      {/* Top Gradient Card matching Screenshot 2 */}
      <div className="relative bg-gradient-to-b from-[#38b6ff] via-[#4682b4] to-[#2b5876] dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white pt-8 pb-6 px-6 rounded-b-[2.5rem] shadow-lg">
        {/* User Avatar */}
        <div className="flex flex-col items-center">
          <div 
            onClick={onOpenMyProfile}
            className="relative w-22 h-22 rounded-full ring-4 ring-white/70 dark:ring-indigo-500/80 shadow-2xl bg-slate-900 cursor-pointer group active:scale-95 transition-transform"
            title="প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন"
          >
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-800">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-4xl flex items-center justify-center">🥷</span>
              )}
            </div>
            
            {/* Quick edit camera badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Username */}
          <h2 className="text-lg font-extrabold mt-2.5 tracking-wide font-heading">
            {currentUser.inGameName || currentUser.name}
          </h2>
          <p className="text-[11px] text-blue-100/90 font-mono mt-0.5">
            UID: {currentUser.ffUid || 'Not Set'}
          </p>
        </div>

        {/* 3 Stats Columns matching Screenshot with responsive sizing */}
        <div className="w-full grid grid-cols-3 divide-x divide-white/20 mt-6 pt-4 border-t border-white/20 text-center">
          {/* Left: ম্যাচ জয়েন করেছেন */}
          <div className="px-1">
            <span className="block text-xl font-black font-mono leading-none">
              {currentUser.matchesJoined || 0}
            </span>
            <span className="text-[10px] sm:text-[11px] text-blue-100 font-medium mt-1 block truncate">
              ম্যাচ জয়েন করেছেন
            </span>
          </div>

          {/* Center: BDT 15 (Big & Highlighted) */}
          <div className="px-1">
            <span className="block text-xl sm:text-2xl font-black font-mono tracking-tight text-white leading-none">
              BDT {currentUser.balance}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-300 font-bold mt-1 block truncate">
              ওয়ালেট ব্যালেন্স
            </span>
          </div>

          {/* Right: এখন পর্যন্ত জিতেছেন */}
          <div className="px-1">
            <span className="block text-xl font-black font-mono leading-none text-emerald-300">
              {currentUser.totalWon || 0}
            </span>
            <span className="text-[10px] sm:text-[11px] text-blue-100 font-medium mt-1 block truncate">
              এখন পর্যন্ত জিতেছেন
            </span>
          </div>
        </div>
      </div>

      {/* Menu Options List matching Screenshot 2 */}
      <div className="px-4 mt-4 space-y-1">
        {/* Wallet (Add Money) */}
        <button
          onClick={onOpenWallet}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Wallet (এড মানি)
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
            ৳{currentUser.balance}
          </span>
        </button>

        {/* Withdraw */}
        <button
          onClick={onOpenWithdraw}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Withdraw (টাকা উত্তোলন)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Transaction History */}
        <button
          onClick={onOpenHistory}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Transaction History
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* My Profile */}
        <button
          onClick={onOpenMyProfile}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              My Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* All Rules matching screenshot with > */}
        <button
          onClick={onOpenRules}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              All Rules
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Top Players */}
        <button
          onClick={onOpenTopPlayers}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Top Players
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        {/* Developer Profile with WhatsApp 01627290830 */}
        <button
          onClick={handleDevClick}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchCancel={cancelLongPress}
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          className="w-full p-3.5 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-slate-800 shadow-2xs transition-all text-left active:scale-[0.99] select-none group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 block">
                Developer Profile
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                WhatsApp: 01627290830
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span>চ্যাট করুন</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </button>
      </div>

      {/* Full-width Blue Logout Button matching Screenshot 2 */}
      <div className="px-4 mt-6">
        <button
          onClick={onLogout}
          className="w-full py-3.5 bg-[#2196f3] hover:bg-[#1e88e5] text-white font-bold rounded-2xl shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Developer Contact & Info Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-2xl text-center space-y-3.5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <MessageCircle className="w-7 h-7 fill-white/20" />
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white font-heading">
                Developer WhatsApp Support
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                যেকোনো সমস্যা বা তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে যোগাযোগ করুন
              </p>
            </div>

            {/* WhatsApp Box */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-left flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Official WhatsApp
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-900 dark:text-emerald-200">
                  01627290830
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('01627290830');
                  alert('WhatsApp নাম্বার কপি হয়েছে: 01627290830');
                }}
                className="p-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="কপি করুন"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Direct WhatsApp Button */}
            <a
              href="https://wa.me/8801627290830?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20%E0%A6%A1%E0%A7%87%E0%A6%AD%E0%A7%87%E0%A6%B2%E0%A6%AA%E0%A6%BE%E0%A6%B0%2C%20S1%20TENDO%20PRO%20%E0%A6%8F%E0%A6%AA%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%AF%E0%A7%8B%E0%A6%97%E0%A6%BE%E0%A6%AF%E0%A7%8B%E0%A6%97%20%E0%A6%95%E0%A6%B0%E0%A6%9B%E0%A6%BF%E0%A7%84"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp চ্যাট ওপেন করুন</span>
            </a>

            <button
              onClick={() => setShowDevModal(false)}
              className="w-full py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
