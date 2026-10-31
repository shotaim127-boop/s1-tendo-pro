import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, Gamepad2, X, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';
import { UserAccount, AppConfig } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, config, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email || !email.includes('@')) {
      setError('দয়া করে সঠিক ইমেইল অ্যাড্রেস প্রদান করুন');
      return;
    }
    if (!password || password.length < 4) {
      setError('পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে');
      return;
    }

    if (isRegister) {
      if (!name) {
        setError('আপনার পুরো নাম লিখুন');
        return;
      }
      if (!ffUid) {
        setError('Free Fire UID প্রদান করুন');
        return;
      }
    }

    const { user, isRestored } = StorageService.loginOrRegister({
      email,
      password,
      name: name || undefined,
      phone: phone || undefined,
      ffUid: ffUid || undefined,
      inGameName: inGameName || undefined,
    });

    if (isRestored) {
      setNotice(`স্বাগতম! আপনার ইমেইল (${user.email}) এর পূর্বের ব্যালেন্স ৳${user.balance} ও সকল হিস্ট্রি রিস্টোর করা হয়েছে।`);
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 1200);
    } else {
      setNotice('নতুন একাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম বোনাস ৳১৫ যোগ করা হয়েছে।');
      setTimeout(() => {
        onSuccess(user);
        onClose();
      }, 1000);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-lg">
            <Gamepad2 className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">
            {config.appName}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {isRegister ? 'নতুন প্লেয়ার একাউন্ট তৈরি করুন' : 'প্লেয়ার আইডি লগইন করুন'}
          </p>

          {/* Tab Pill */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); setNotice(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isRegister ? 'bg-white text-blue-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); setNotice(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isRegister ? 'bg-white text-blue-600 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              রেজিস্ট্রেশন (Register)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Email Persistence Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>অ্যাকাউন্ট রিস্টোর গ্যারান্টি:</strong> পূর্বে ব্যবহৃত ইমেইল দিয়ে লগইন করলে সাথে সাথে আপনার পূর্বের ওয়ালেট ব্যালেন্স এবং ম্যাচ হিস্ট্রি সম্পূর্ণ ফিরে পাবেন।
            </span>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {notice && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    আপনার পুরো নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: Shuvo Saha"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Free Fire UID *
                    </label>
                    <input
                      type="text"
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="UID (10 সংখ্যার)"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      In-Game Name
                    </label>
                    <input
                      type="text"
                      value={inGameName}
                      onChange={(e) => setInGameName(e.target.value)}
                      placeholder="FF গেমের নাম"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    মোবাইল নাম্বার
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                ইমেইল অ্যাড্রেস *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              <span>{isRegister ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>


        </div>
      </motion.div>
    </div>
  );
};
