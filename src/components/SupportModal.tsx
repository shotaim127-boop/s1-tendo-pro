import React from 'react';
import { motion } from 'motion/react';
import { X, Send, PhoneCall, Headphones, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { AppConfig } from '../types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[85vh] flex flex-col"
      >
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base font-heading">
                ২৪/৭ কাস্টমার সাপোর্ট
              </h3>
              <p className="text-[11px] text-emerald-100">
                যেকোনো সমস্যায় সরাসরি এডমিনের সাথে যোগাযোগ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Telegram Support Channel */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Send className="w-4 h-4 text-blue-600" /> Telegram Support (অফিশিয়াল চ্যানেল)
              </span>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                অনলাইন
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              এড মানি পেন্ডিং, উইথড্র ভেরিফিকেশন বা টুর্নামেন্ট সম্পর্কিত যেকোনো প্রয়োজনে টেলিগ্রামে মেসেজ দিন।
            </p>
            <a
              href={config.telegramLink}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>টেলিগ্রামে যুক্ত হোন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Developer WhatsApp Contact */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" /> ডেভেলপার অফিসিয়াল WhatsApp:
              </span>
              <span className="font-mono text-xs font-black">01627290830</span>
            </div>
            <a
              href="https://wa.me/8801627290830?text=%E0%A6%B9%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%20%E0%A6%A1%E0%A7%87%E0%A6%AD%E0%A7%87%E0%A6%B2%E0%A6%AA%E0%A6%BE%E0%A6%B0%2C%20S1%20TENDO%20PRO%20%E0%A6%8F%E0%A6%AA%20%E0%A6%B8%E0%A6%BE%E0%A6%AA%E0%A7%8B%E0%A6%B0%E0%A7%8D%E0%A6%9F%E0%A7%87%20%E0%A6%AF%E0%A7%8B%E0%A6%97%E0%A6%BE%E0%A6%AF%E0%A7%8B%E0%A6%97%20%E0%A6%95%E0%A6%B0%E0%A6%9B%E0%A6%BF%E0%A7%84"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>ডেভেলপারের সাথে WhatsApp চ্যাট</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Hotline / Payment Info */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-indigo-600" /> বিকাশ / নগদ হেল্পলাইন নাম্বার:
              </span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="font-mono font-extrabold text-sm text-gray-900 dark:text-white">
                {config.supportPhone || config.addMoneyNumber}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">সকাল ৯টা - রাত ১২টা</span>
            </div>
          </div>

          {/* Live response time */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>গড় রেসপন্স টাইম: ৩ থেকে ৫ মিনিট।</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
