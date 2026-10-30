import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Flame, Award, Crown } from 'lucide-react';
import { UserAccount } from '../types';

interface TopPlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserAccount[];
}

export const TopPlayersModal: React.FC<TopPlayersModalProps> = ({ isOpen, onClose, users }) => {
  if (!isOpen) return null;

  // Sort players by total winnings or matches played
  const topPlayers = [...users].sort((a, b) => (b.totalWon || 0) - (a.totalWon || 0)).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-100 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base font-heading">
                Top Players Leaderboard
              </h3>
              <p className="text-[11px] text-purple-100">
                টুর্নামেন্টের শীর্ষ বিজয়ী খেলোয়াড় তালিকা
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

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2">
          {topPlayers.map((player, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={player.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  rank === 1
                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-slate-800 border-amber-300 dark:border-amber-800'
                    : rank === 2
                      ? 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-800 border-slate-300 dark:border-slate-700'
                      : rank === 3
                        ? 'bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-slate-800 dark:to-slate-800 border-orange-200 dark:border-slate-700'
                        : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
                }`}
              >
                {/* Left Rank & Avatar */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7">
                    {rank === 1 ? (
                      <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />
                    ) : rank === 2 ? (
                      <Award className="w-6 h-6 text-slate-400" />
                    ) : rank === 3 ? (
                      <Award className="w-6 h-6 text-amber-700" />
                    ) : (
                      <span className="font-mono font-bold text-xs text-gray-400">
                        #{rank}
                      </span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                      {player.inGameName || player.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      UID: {player.ffUid || 'Hidden'} • {player.matchesJoined} Matches
                    </p>
                  </div>
                </div>

                {/* Right Won Amount */}
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                    WON PRIZE
                  </span>
                  <span className="font-mono font-extrabold text-sm text-gray-900 dark:text-white">
                    ৳{player.totalWon || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
