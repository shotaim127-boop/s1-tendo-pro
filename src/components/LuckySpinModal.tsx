import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Trophy, Award, Gift, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, AppConfig } from '../types';
import { StorageService } from '../services/storage';

interface LuckySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  config: AppConfig;
  onSuccess: () => void;
}

export const LuckySpinModal: React.FC<LuckySpinModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  config,
  onSuccess,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const prizes = [2, 5, 0, 10, 1, 20, 3, 15];

  const handleSpin = () => {
    if (spinning) return;

    // Check if already spun today
    const today = new Date().toDateString();
    if (currentUser.lastSpinDate === today) {
      setFeedback('আপনি আজকের স্পিনটি ইতিমধ্যে গ্রহণ করেছেন! আবার কাল স্পিন করতে পারবেন।');
      return;
    }

    setSpinning(true);
    setReward(null);
    setFeedback(null);

    // Pick random prize
    const randomIdx = Math.floor(Math.random() * prizes.length);
    const winAmount = prizes[randomIdx];

    setTimeout(() => {
      setSpinning(false);
      setReward(winAmount);

      const updatedUser: UserAccount = {
        ...currentUser,
        balance: currentUser.balance + winAmount,
        lastSpinDate: today,
      };
      StorageService.saveUser(updatedUser);

      if (winAmount > 0) {
        try {
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        } catch {}
        setFeedback(`🎉 অভিনন্দন! আপনি জিতেছেন ৳${winAmount} ক্যাশ! এটি সরাসরি ওয়ালেটে যোগ হয়েছে।`);
      } else {
        setFeedback('খারাপ ভাগ্য! এবার কোনো প্রাইজ মেলেনি। আগামীকাল আবার চেষ্টা করুন!');
      }

      onSuccess();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 p-6 text-center space-y-4"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            <h3 className="font-extrabold text-lg font-heading text-gray-900 dark:text-white">
              ডেইলি লাকি স্পিন (Lucky Spin)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          প্রতিদিন বিনামূল্যে ১ বার স্পিন করে জিতে নিন ৳২০ টাকা পর্যন্ত ক্যাশ রিওয়ার্ড!
        </p>

        {/* Wheel graphics */}
        <div className="w-44 h-44 mx-auto rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-2 shadow-xl relative flex items-center justify-center">
          <motion.div
            animate={spinning ? { rotate: 1800 } : { rotate: 0 }}
            transition={spinning ? { duration: 2.5, ease: 'easeOut' } : { duration: 0 }}
            className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-4 border-amber-300 relative overflow-hidden"
          >
            <div className="text-center">
              <Gift className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <span className="text-[10px] font-black font-mono text-amber-300">
                {spinning ? 'SPINNING...' : reward !== null ? `৳${reward} WIN` : 'SPIN & WIN'}
              </span>
            </div>
          </motion.div>
        </div>

        {feedback && (
          <div className="p-3 bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 rounded-2xl text-xs font-semibold">
            {feedback}
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-600/30 active:scale-95 transition-all text-sm font-heading"
        >
          {spinning ? 'স্পিন ঘুরছে...' : 'এখনই স্পিন করুন (Free)'}
        </button>
      </motion.div>
    </div>
  );
};
