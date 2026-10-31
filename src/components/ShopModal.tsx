import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Gem, Check, AlertCircle, ShoppingCart, ShieldCheck } from 'lucide-react';
import { UserAccount, AppConfig } from '../types';
import { StorageService } from '../services/storage';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  config: AppConfig;
  onNeedWallet: () => void;
  onSuccess: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  config,
  onNeedWallet,
  onSuccess,
}) => {
  const [selectedPack, setSelectedPack] = useState<number | null>(0);
  const [playerUid, setPlayerUid] = useState(currentUser?.ffUid || '');
  const [inGameName, setInGameName] = useState(currentUser?.inGameName || '');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  if (!isOpen || !currentUser) return null;

  const packs = [
    { id: 1, diamonds: 115, price: 85, badge: 'জনপ্রিয়' },
    { id: 2, diamonds: 240, price: 165, badge: 'হট' },
    { id: 3, diamonds: 610, price: 410, badge: 'বেস্ট ভ্যালু' },
    { id: 4, diamonds: 1240, price: 820, badge: 'মেগা প্যাক' },
    { id: 5, diamonds: 'Weekly Membership', price: 190, badge: 'সাপ্তাহিক' },
    { id: 6, diamonds: 'Monthly Membership', price: 790, badge: 'মাসিক' },
  ];

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (selectedPack === null) {
      setFeedback({ type: 'error', message: 'দয়া করে একটি ডায়মন্ড প্যাক নির্বাচন করুন।' });
      return;
    }
    if (!playerUid.trim()) {
      setFeedback({ type: 'error', message: 'আপনার Free Fire Player UID প্রদান করুন।' });
      return;
    }

    const pack = packs[selectedPack];
    if (currentUser.balance < pack.price) {
      setFeedback({
        type: 'error',
        message: `পর্যাপ্ত ব্যালেন্স নেই! আপনার ওয়ালেটে প্রয়োজন ৳${pack.price}, বর্তমান ব্যালেন্স ৳${currentUser.balance}। এড মানি করুন।`,
      });
      return;
    }

    // Deduct from balance
    const updatedUser: UserAccount = {
      ...currentUser,
      balance: currentUser.balance - pack.price,
    };
    StorageService.saveUser(updatedUser);

    // Create transaction record
    StorageService.createTransaction({
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      type: 'tournament_entry',
      amount: pack.price,
      status: 'completed',
      note: `💎 Free Fire Top-Up: ${pack.diamonds} (UID: ${playerUid})`,
    });

    setFeedback({
      type: 'success',
      message: `🎉 সফলভাবে ডায়মন্ড অর্ডার সম্পন্ন হয়েছে! আপনার UID (${playerUid}) এ ৫-১০ মিনিটের মধ্যে ডায়মন্ড পৌঁছে যাবে।`,
    });

    setTimeout(() => {
      onSuccess();
    }, 2000);
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
        <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-lg">
            <Gem className="w-8 h-8 text-cyan-200 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight font-heading">
            ফ্রি ফায়ার ডায়মন্ড টপ-আপ শপ
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            ওয়ালেট ব্যালেন্স দিয়ে ১ ক্লিকেই সবচেয়ে কম দামে ডায়মন্ড নিন
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

          {/* Diamond Packs Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              ডায়মন্ড প্যাক বেছে নিন:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {packs.map((pack, idx) => (
                <button
                  type="button"
                  key={pack.id}
                  onClick={() => setSelectedPack(idx)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all relative ${
                    selectedPack === idx
                      ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 shadow-md'
                      : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 hover:border-gray-200'
                  }`}
                >
                  <span className="absolute top-2 right-2 text-[9px] font-bold bg-cyan-500 text-white px-1.5 py-0.5 rounded-full font-mono">
                    {pack.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
                    <Gem className="w-4 h-4" />
                    <span>{typeof pack.diamonds === 'number' ? `${pack.diamonds} 💎` : pack.diamonds}</span>
                  </div>
                  <div className="text-xs font-black font-mono text-gray-900 dark:text-white mt-1">
                    ৳{pack.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePurchase} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Player UID (ফ্রি ফায়ার গেম আইডি) *
              </label>
              <input
                type="text"
                value={playerUid}
                onChange={(e) => setPlayerUid(e.target.value)}
                placeholder="আপনার গেম UID দিন"
                required
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                In-Game Name (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={inGameName}
                onChange={(e) => setInGameName(e.target.value)}
                placeholder="গেমের নাম"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {selectedPack !== null
                  ? `৳${packs[selectedPack].price} দিয়ে কিনুন`
                  : 'ডায়মন্ড কিনুন'}
              </span>
            </button>
          </form>

          {/* Wallet Balance check */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-slate-800">
            <span>আপনার ব্যালেন্স: ৳{currentUser.balance}</span>
            <button
              onClick={() => { onClose(); onNeedWallet(); }}
              className="text-cyan-600 hover:text-cyan-500 font-bold underline"
            >
              এড মানি করুন
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
