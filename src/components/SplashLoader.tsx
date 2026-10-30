import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Flame } from 'lucide-react';
import { AppConfig } from '../types';

interface SplashLoaderProps {
  config: AppConfig;
  onFinish: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ config, onFinish }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 400);
    const timer2 = setTimeout(() => setProgress(85), 1000);
    const timer3 = setTimeout(() => setProgress(100), 1600);
    const timerFinish = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinish);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0e111a] text-white flex flex-col items-center justify-between py-16 px-6 select-none overflow-hidden">
      {/* Background ambient glowing particles */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="w-full flex justify-between items-center text-xs text-gray-500 font-mono">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> ESPORTS ENGINE
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SECURE 256-BIT
        </span>
      </div>

      {/* Center Logo & Branding matching Screenshot 3 */}
      <div className="flex flex-col items-center text-center my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          {/* Outer glowing ring */}
          <div className="w-36 h-36 rounded-full border-2 border-emerald-500/40 p-2 flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-t-2 border-emerald-400"
            />
            
            {/* Logo image or icon */}
            <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-900/90 flex items-center justify-center border border-white/10 shadow-inner">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={config.appName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl font-black text-amber-400 flex flex-col items-center">
                  <span>⚡</span>
                  <span className="text-[10px] tracking-wider text-emerald-400 font-mono uppercase">PRO</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* App Title */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold tracking-wide text-white font-heading"
        >
          {config.appName}
        </motion.h1>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-sm font-semibold text-gray-400 mt-1 font-mono tracking-widest"
        >
          {config.appVersion}
        </motion.p>
      </div>

      {/* Bottom Loading Bar matching Screenshot 3 */}
      <div className="w-full max-w-xs flex flex-col items-center">
        <p className="text-sm font-medium text-gray-300 mb-3 tracking-wide">
          Welcome back!
        </p>

        {/* Animated Green Progress Bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden relative mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 3 dots indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Tap to skip */}
        <button
          onClick={onFinish}
          className="mt-4 text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4 transition-colors"
        >
          ক্লিক করে সরাসরি প্রবেশ করুন
        </button>
      </div>
    </div>
  );
};
