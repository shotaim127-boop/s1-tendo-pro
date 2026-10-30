import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowDownLeft, ArrowUpRight, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  userEmail: string;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  transactions,
  userEmail,
}) => {
  if (!isOpen) return null;

  // Filter user's transactions
  const userTx = transactions.filter(
    t => t.userEmail.toLowerCase().trim() === userEmail.toLowerCase().trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white font-heading">
              Transaction History
            </h3>
            <p className="text-xs text-gray-400">
              আপনার সমস্ত জমা, উত্তোলন ও টুর্নামেন্ট লেনদেন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {userTx.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Clock className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs">এখনও কোনো ট্রানজেকশন সম্পন্ন হয়নি।</p>
            </div>
          ) : (
            userTx.map((tx) => {
              const isCredit = tx.type === 'add_money' || tx.type === 'tournament_win';
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  {/* Left Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'tournament_win'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        : isCredit
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'tournament_win' ? (
                      <Trophy className="w-5 h-5" />
                    ) : isCredit ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  {/* Middle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white capitalize">
                        {tx.type === 'add_money'
                          ? `এড মানি (${tx.method || 'বিকাশ/নগদ'})`
                          : tx.type === 'withdraw'
                            ? `উইথড্র (${tx.method || 'বিকাশ/নগদ'})`
                            : tx.type === 'tournament_win'
                              ? 'ম্যাচ উইনিং প্রাইজ'
                              : tx.type === 'tournament_entry'
                                ? 'টুর্নামেন্ট এন্ট্রি ফি'
                                : 'এডমিন সমন্বয়'}
                      </h4>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {tx.tournamentTitle || (tx.trxId ? `TrxID: ${tx.trxId}` : tx.note || 'ব্যালেন্স আপডেট')}
                    </p>

                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {tx.createdAt}
                    </p>

                    {tx.adminNote && (
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 italic mt-0.5">
                        * {tx.adminNote}
                      </p>
                    )}
                  </div>

                  {/* Right Status & Amount */}
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-extrabold text-sm block ${
                        isCredit
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isCredit ? '+' : '-'}৳{tx.amount}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        tx.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : tx.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                      {tx.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      <span>
                        {tx.status === 'completed' ? 'সফল' : tx.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
