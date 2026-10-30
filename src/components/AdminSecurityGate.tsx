import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, X, AlertTriangle } from 'lucide-react';
import { AppConfig } from '../types';

interface AdminSecurityGateProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSuccess: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  isOpen,
  onClose,
  config,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check against configured admin password (default 271030 or user-customized)
    const validPassword = config.adminPassword || '271030';

    if (password.trim() === validPassword.trim()) {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setError('অতিরিক্ত ভুল চেষ্টা! সাময়িকভাবে লক করা হয়েছে।');
      } else {
        setError(`ভুল সিকিউরিটি পাসওয়ার্ড! (বাকি সুযোগ: ${5 - nextAttempts} বার)`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 text-white shadow-[0_0_50px_rgba(239,68,68,0.2)]"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-mono font-bold tracking-widest">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span>ENCRYPTED ADMIN GATE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center my-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-900/40 to-slate-800 border border-rose-500/40 flex items-center justify-center mb-3 text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading">
            মাস্টার সিকিউরিটি ভেরিফিকেশন
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            এডমিন কন্ট্রোল প্যানেলে প্রবেশের জন্য মাস্টার পাসওয়ার্ড দিন
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
              ADMIN PASSCODE
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="মাস্টার পাসওয়ার্ড লিখুন"
                autoFocus
                required
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl text-sm font-mono tracking-wider focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={attempts >= 5}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-rose-900/30 active:scale-95 transition-all"
          >
            আনলক এডমিন প্যানেল
          </button>
        </form>
      </motion.div>
    </div>
  );
};
