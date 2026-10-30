import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, ShieldCheck, Wallet, ArrowDownRight, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { UserAccount, AppConfig, PaymentMethod } from '../types';
import { StorageService } from '../services/storage';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  config: AppConfig;
  initialTab?: 'add_money' | 'withdraw';
  onNeedAuth: () => void;
  onSuccess: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  config,
  initialTab = 'add_money',
  onNeedAuth,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'add_money' | 'withdraw'>(initialTab);
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  
  // Add money fields
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [addAmount, setAddAmount] = useState('50');

  // Withdraw fields
  const [receiverNumber, setReceiverNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('100');

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            ওয়ালেট ব্যবহার করতে দয়া করে লগইন করুন
          </h3>
          <button
            onClick={() => { onClose(); onNeedAuth(); }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  // Active number based on selected method
  const activePayNumber = method === 'bKash' 
    ? (config.bkashNumber || config.addMoneyNumber) 
    : (config.nagadNumber || config.addMoneyNumber);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activePayNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt < 10) {
      setFeedback({ type: 'error', message: 'সর্বনিম্ন এড মানি পরিমাণ ১০ টাকা।' });
      return;
    }
    if (!senderNumber || senderNumber.length < 11) {
      setFeedback({ type: 'error', message: 'সঠিক বিকাশ বা নগদ মোবাইল নাম্বার লিখুন।' });
      return;
    }
    if (!trxId || trxId.length < 5) {
      setFeedback({ type: 'error', message: 'সঠিক Transaction ID (TrxID) প্রদান করুন।' });
      return;
    }

    StorageService.requestAddMoney({
      user: currentUser,
      method,
      senderNumber,
      trxId: trxId.toUpperCase().trim(),
      amount: amt,
    });

    setFeedback({
      type: 'success',
      message: 'পেমেন্ট রিকোয়েস্ট জমা হয়েছে! এটি পেন্ডিং (Pending) অবস্থায় রয়েছে। এডমিন ভেরিফাই করে কনফার্ম করার সাথে সাথে ব্যালেন্স যুক্ত হবে।',
    });
    setTrxId('');
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 50) {
      setFeedback({ type: 'error', message: 'সর্বনিম্ন উইথড্র পরিমাণ ৫০ টাকা।' });
      return;
    }
    if (!receiverNumber || receiverNumber.length < 11) {
      setFeedback({ type: 'error', message: 'সঠিক বিকাশ বা নগদ মোবাইল নাম্বার লিখুন।' });
      return;
    }

    const res = StorageService.requestWithdraw({
      user: currentUser,
      method,
      receiverNumber,
      amount: amt,
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
    } else {
      setFeedback({ type: 'success', message: res.message });
      setWithdrawAmount('');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl font-bold font-heading">
              মাই ওয়ালেট (Wallet)
            </h3>
          </div>
          <p className="text-xs text-blue-100">
            বর্তমান একাউন্ট ব্যালেন্স: <strong className="font-mono text-base text-amber-300">৳{currentUser.balance}</strong>
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-black/25 p-1 rounded-xl mt-4">
            <button
              onClick={() => { setActiveTab('add_money'); setFeedback(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'add_money'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              এড মানি (Add Money)
            </button>
            <button
              onClick={() => { setActiveTab('withdraw'); setFeedback(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              উইথড্র (Withdraw)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                feedback.type === 'error'
                  ? 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'add_money' ? (
            /* TAB 1: ADD MONEY */
            <div className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">
                  পেমেন্ট মাধ্যম বেছে নিন:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod('bKash')}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      method === 'bKash'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 shadow-xs'
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-pink-500" />
                    <span>bKash (বিকাশ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Nagad')}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      method === 'Nagad'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 shadow-xs'
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Nagad (নগদ)</span>
                  </button>
                </div>
              </div>

              {/* Number Card with 1-Click Copy */}
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-2xl border border-indigo-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    {method} পার্সোনাল নাম্বার (Send Money):
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                    24/7 ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xl font-extrabold text-gray-900 dark:text-white tracking-wider">
                    {activePayNumber}
                  </span>
                  <button
                    onClick={handleCopyNumber}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                  * উপরের নাম্বারে সেন্ড মানি করুন। টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) নিচের বক্সে দিন।
                </p>
              </div>

              {/* Add Money Form */}
              <form onSubmit={handleAddMoneySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    টাকার পরিমাণ (BDT) *
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['20', '50', '100', '200'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setAddAmount(amt)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          addAmount === amt
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="টাকার পরিমাণ লিখুন"
                    min="10"
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    যে নাম্বার থেকে টাকা পাঠিয়েছেন (Sender Number) *
                  </label>
                  <input
                    type="tel"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="যেমন: BKS8927189"
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>সাবমিটের পর রিকোয়েস্টটি পেন্ডিং থাকবে। এডমিন প্যানেল কনফার্ম করলেই ব্যালেন্স যুক্ত হবে।</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all text-sm"
                >
                  পেমেন্ট রিকোয়েস্ট সাবমিট করুন
                </button>
              </form>
            </div>
          ) : (
            /* TAB 2: WITHDRAW */
            <div className="space-y-4">
              {/* Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">
                  উত্তোলন মাধ্যম বেছে নিন:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod('bKash')}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      method === 'bKash'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400'
                        : 'border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    <span>bKash (বিকাশ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('Nagad')}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      method === 'Nagad'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-slate-800'
                    }`}
                  >
                    <span>Nagad (নগদ)</span>
                  </button>
                </div>
              </div>

              {/* Withdraw Form */}
              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    টাকার পরিমাণ (ন্যূনতম ৫০ টাকা) *
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="৫০ বা তার বেশি"
                    min="50"
                    max={currentUser.balance}
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    সর্বোচ্চ উত্তোলনযোগ্য ব্যালেন্স: ৳{currentUser.balance}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    যে নাম্বারে টাকা নিবেন (Receiver Number) *
                  </label>
                  <input
                    type="tel"
                    value={receiverNumber}
                    onChange={(e) => setReceiverNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
                  উইথড্র রিকোয়েস্ট সাবমিটের পর এটি পেন্ডিং অবস্থায় থাকবে। এডমিন প্যানেল থেকে টাকা পাঠিয়ে কনফার্ম করা হবে।
                </div>

                <button
                  type="submit"
                  disabled={currentUser.balance < 50}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                    currentUser.balance < 50
                      ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/25 active:scale-95'
                  }`}
                >
                  উইথড্র রিকোয়েস্ট পাঠান
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
