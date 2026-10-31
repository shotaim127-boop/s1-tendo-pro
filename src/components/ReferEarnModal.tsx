import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gift, Copy, Check, Users, Share2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { UserAccount, AppConfig } from '../types';
import { StorageService } from '../services/storage';

interface ReferEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  config: AppConfig;
  onSuccess?: () => void;
}

export const ReferEarnModal: React.FC<ReferEarnModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  config,
  onSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  if (!isOpen || !currentUser) return null;

  const bonusAmount = config.features?.referralBonus || 10;
  // Generate consistent referral code based on UID or ID if not present
  const refCode = currentUser.referralCode || `S1-${currentUser.ffUid || currentUser.id.slice(-5).toUpperCase()}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `🔥 এস১ টেন্ডো প্রো (S1 TENDO PRO) ফ্রি ফায়ার টুর্নামেন্ট অ্যাপে জয়েন করে প্রতিদিন আনলিমিটেড টাকা জিতুন! আমার রেফার কোড ব্যবহার করুন: ${refCode}\nঅ্যাপ লিংক: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: 'S1 TENDO PRO - Refer & Earn',
        text,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyFriendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const clean = friendCode.trim().toUpperCase();

    if (!clean) {
      setFeedback({ type: 'error', message: 'দয়া করে একটি সঠিক রেফার কোড লিখুন।' });
      return;
    }
    if (clean === refCode) {
      setFeedback({ type: 'error', message: 'আপনি নিজের রেফার কোড নিজে ব্যবহার করতে পারবেন না।' });
      return;
    }
    if (currentUser.referredBy) {
      setFeedback({ type: 'error', message: 'আপনি ইতিপূর্বে একজন বন্ধুর রেফার কোড ব্যবহার করেছেন।' });
      return;
    }

    // Reward both users
    const allUsers = StorageService.getAllUsers();
    const referrer = allUsers.find(
      u => (u.referralCode && u.referralCode.toUpperCase() === clean) ||
           (`S1-${u.ffUid || u.id.slice(-5).toUpperCase()}` === clean)
    );

    if (referrer) {
      // Reward referrer
      const updatedReferrer: UserAccount = {
        ...referrer,
        balance: referrer.balance + bonusAmount,
        totalReferrals: (referrer.totalReferrals || 0) + 1,
        referralEarnings: (referrer.referralEarnings || 0) + bonusAmount,
      };
      StorageService.saveUser(updatedReferrer);
    }

    // Reward current user
    const updatedUser: UserAccount = {
      ...currentUser,
      balance: currentUser.balance + bonusAmount,
      referredBy: clean,
    };
    StorageService.saveUser(updatedUser);

    setFeedback({
      type: 'success',
      message: `🎉 অভিনন্দন! রেফার কোড সফলভাবে যুক্ত হয়েছে এবং আপনার ওয়ালেটে ৳${bonusAmount} ক্যাশ যোগ করা হয়েছে!`,
    });
    setFriendCode('');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-lg">
            <Gift className="w-8 h-8 text-amber-200 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight font-heading">
            রেফার এবং আনলিমিটেড ইনকাম
          </h2>
          <p className="text-xs text-orange-100 mt-1">
            প্রতিটি সফল রেফারে আপনি এবং আপনার বন্ধু পাবেন ৳{bonusAmount} টাকা করে!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* User Referral Code Card */}
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-orange-200 dark:border-slate-700 text-center space-y-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
              আপনার পার্সোনাল রেফার কোড
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-black font-mono tracking-widest text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-xl border border-orange-300 dark:border-slate-600">
                {refCode}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCopyCode}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>শেয়ার</span>
              </button>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                মোট সফল রেফার
              </span>
              <span className="text-xl font-black font-mono text-gray-900 dark:text-white mt-0.5 block">
                {currentUser.totalReferrals || 0} জন
              </span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-medium">
                মোট রেফারেল আয়
              </span>
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                ৳{currentUser.referralEarnings || 0}
              </span>
            </div>
          </div>

          {/* Apply Friend's Code Box */}
          {!currentUser.referredBy ? (
            <form onSubmit={handleApplyFriendCode} className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2.5">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200">
                বন্ধুর রেফার কোড বসান (বোনাস ৳{bonusAmount}):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value)}
                  placeholder="রেফার কোড লিখুন"
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>যুক্ত করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>আপনি ইতিমধ্যে রেফারেল বোনাস গ্রহণ করেছেন! (কোড: {currentUser.referredBy})</span>
            </div>
          )}

          {/* Rules */}
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
            <span className="font-bold block">💡 রেফারেল নিয়মাবলী:</span>
            <p>১. আপনার রেফার কোড বন্ধুকে পাঠাতে শেয়ার বাটনে ক্লিক করুন।</p>
            <p>২. বন্ধু আপনার কোড দিয়ে যুক্ত হলে তাৎক্ষণিক আপনার ওয়ালেটে ৳{bonusAmount} জমা হবে।</p>
            <p>৩. এই টাকা দিয়ে যেকোনো ফ্রি ফায়ার টুর্নামেন্ট খেলা যাবে অথবা উইথড্র করা যাবে।</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
