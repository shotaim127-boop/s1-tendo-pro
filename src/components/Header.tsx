import React, { useState, useRef } from 'react';
import { Bell, Moon, Sun, ShieldAlert, Sparkles } from 'lucide-react';
import { UserAccount, AppConfig } from '../types';

interface HeaderProps {
  user: UserAccount | null;
  config: AppConfig;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  onOpenAdminAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  config,
  darkMode,
  onToggleDarkMode,
  onOpenWallet,
  onOpenNotifications,
  onOpenAdminAuth,
}) => {
  const logoTapCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden stealth admin trigger: 15 taps OR 3-second long press
  const handleLogoTap = () => {
    logoTapCountRef.current += 1;
    const current = logoTapCountRef.current;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (current >= 15) {
      logoTapCountRef.current = 0;
      onOpenAdminAuth();
    } else {
      clickTimerRef.current = setTimeout(() => {
        logoTapCountRef.current = 0;
      }, 5000);
    }
  };

  const startLogoLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      logoTapCountRef.current = 0;
      onOpenAdminAuth();
    }, 3000);
  };

  const cancelLogoLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
        {/* Left: App Logo & Title (Stealth Admin Gateway) */}
        <div 
          onClick={handleLogoTap}
          onTouchStart={startLogoLongPress}
          onTouchEnd={cancelLogoLongPress}
          onTouchCancel={cancelLogoLongPress}
          onMouseDown={startLogoLongPress}
          onMouseUp={cancelLogoLongPress}
          onMouseLeave={cancelLogoLongPress}
          className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform select-none group"
          title="S1 TENDO PRO"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-0.5 shadow-md flex items-center justify-center">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={config.appName}
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <span className="text-white font-black text-sm">S1</span>
            )}
          </div>
          <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white font-heading leading-tight">
                {config.appName}
              </h1>
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 leading-none">
              ESPORTS ARENA
            </p>
          </div>
        </div>

        {/* Right Action Icons matching Screenshot 1 */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors"
            title={darkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notification Bell with red badge `1` */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors"
            title="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
              1
            </span>
          </button>

          {/* Wallet Balance Badge matching Screenshot 1 [ ৳ 15 ] */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl shadow-sm shadow-red-500/20 active:scale-95 transition-all text-xs font-bold"
            title="ওয়ালেট ও এড মানি"
          >
            <span className="text-base leading-none">৳</span>
            <span className="font-mono text-sm tracking-tight">{user ? user.balance : 0}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
