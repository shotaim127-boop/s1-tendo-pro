import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, KeyRound, Copy, Check, Users, ShieldAlert, AlertTriangle, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tournament, UserAccount } from '../types';
import { StorageService } from '../services/storage';

interface TournamentDetailsModalProps {
  tournament: Tournament | null;
  currentUser: UserAccount | null;
  onClose: () => void;
  onNeedAuth: () => void;
  onNeedWallet: () => void;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  currentUser,
  onClose,
  onNeedAuth,
  onNeedWallet,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [inGameNameInput, setInGameNameInput] = useState(currentUser?.inGameName || '');
  const [ffUidInput, setFfUidInput] = useState(currentUser?.ffUid || '');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  if (!tournament) return null;

  const isJoined = currentUser
    ? tournament.joinedPlayers.some(p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    : false;

  const myPlayer = currentUser && isJoined
    ? tournament.joinedPlayers.find(p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    : null;

  const handleCopy = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleJoinTournament = () => {
    setJoinError('');
    setJoinSuccess('');

    if (!currentUser) {
      onNeedAuth();
      return;
    }

    if (currentUser.balance < tournament.entryFee) {
      setJoinError(`আপনার ব্যালেন্স কম (৳${currentUser.balance})। টুর্নামেন্টে জয়েন করতে ৳${tournament.entryFee} প্রয়োজন।`);
      return;
    }

    // Check if inGameName and FF UID are set
    const userToJoin: UserAccount = {
      ...currentUser,
      inGameName: inGameNameInput || currentUser.inGameName || currentUser.name,
      ffUid: ffUidInput || currentUser.ffUid,
    };

    const res = StorageService.joinTournament(tournament.id, userToJoin);
    if (!res.success) {
      setJoinError(res.message);
    } else {
      setJoinSuccess(res.message);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
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
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30 font-mono mb-2">
            {tournament.category} • {tournament.matchType}
          </span>
          <h2 className="text-xl font-bold font-heading line-clamp-1">
            {tournament.title}
          </h2>
          <p className="text-xs text-rose-400 font-semibold mt-1">
            সময়সূচী: {tournament.schedule}
          </p>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Room ID and Password Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800/90 dark:to-slate-800/40 rounded-2xl p-4 border border-amber-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    কাস্টম রুম তথ্য (Room Info)
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    ম্যাচ শুরু হবার ১০-১৫ মিনিট পূর্বে রুম দেওয়া হয়
                  </p>
                </div>
              </div>
            </div>

            {isJoined ? (
              tournament.isRoomPublished && tournament.roomId ? (
                <div className="space-y-2.5 pt-2 border-t border-amber-200/60 dark:border-slate-700">
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      আপনার বরাদ্দকৃত স্লট: <span className="font-mono text-sm underline">#{myPlayer?.slotNumber}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900 px-2 py-0.5 rounded font-bold">
                      বুকিং নিশ্চিত
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Room ID</span>
                      <p className="font-mono font-extrabold text-base text-gray-900 dark:text-white">
                        {tournament.roomId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(tournament.roomId || '', 'id')}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? 'কপি হয়েছে' : 'কপি ID'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Room Password</span>
                      <p className="font-mono font-extrabold text-base text-gray-900 dark:text-white">
                        {tournament.roomPassword || 'None'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(tournament.roomPassword || '', 'pass')}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPass ? 'কপি হয়েছে' : 'কপি পাস'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    ⚠️ নির্ধারিত স্লট #{myPlayer?.slotNumber} ছাড়া অন্য স্লটে বসলে কিকে পড়তে পারেন।
                  </p>
                </div>
              ) : (
                <div className="bg-amber-100/70 dark:bg-amber-950/50 p-3 rounded-xl border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>আপনার স্লট বুকিং সফল (স্লট #{myPlayer?.slotNumber})!</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/80">
                    এডমিন ম্যাচ শুরু হবার ১০-১৫ মিনিট পূর্বে রুম আইডি ও পাসওয়ার্ড ছাড়বেন, তখন ঠিক এখানেই দেখা যাবে।
                  </p>
                </div>
              )
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>🔒 রুম আইডি ও পাসওয়ার্ড সংরক্ষিত (Locked)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                  শুধুমাত্র যারা স্লট বুকিং করবেন তারাই খেলার সুযোগ ও রুমের পাসওয়ার্ড দেখতে পাবেন। একজন ব্যক্তি একটি টুর্নামেন্টে মাত্র ১টি স্লটই নিতে পারবেন।
                </p>
              </div>
            )}
          </div>

          {/* Tournament Overview Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-gray-400">WIN PRIZE</span>
              <span className="font-black text-sm text-gray-900 dark:text-white font-mono">
                {tournament.winPrize} TK
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-gray-400">ENTRY FEE</span>
              <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                {tournament.entryFee} TK
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-gray-400">PER KILL</span>
              <span className="font-black text-sm text-gray-900 dark:text-white font-mono">
                {tournament.perKillPrize} TK
              </span>
            </div>
          </div>

          {/* Joined Players Roster */}
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> যুক্ত প্লেয়ারদের তালিকা ({tournament.joinedPlayers.length}/{tournament.totalSlots})
              </span>
            </div>
            {tournament.joinedPlayers.length === 0 ? (
              <p className="text-xs text-gray-400 py-2 text-center">এখনও কেউ জয়েন করেনি। আপনিই প্রথম স্লটটি বুকিং করুন!</p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {tournament.joinedPlayers.map((player) => (
                  <div
                    key={player.userId + player.slotNumber}
                    className="flex items-center justify-between text-xs py-1.5 px-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center">
                        #{player.slotNumber}
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {player.inGameName || player.userName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">
                      UID: {player.ffUid || 'Hidden'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rules Section */}
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-2xl">
            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>📜</span> বিশেষ নিয়মাবলী:
            </h5>
            <p>• {tournament.rules || 'মোবাইল প্লেয়ারদের জন্য নির্ধারিত। এমুলেটর সম্পূর্ণ নিষিদ্ধ।'}</p>
            <p>• একটি জিমেইল একাউন্ট থেকে টুর্নামেন্টে শুধুমাত্র একটি স্লট বুকিং করা যাবে।</p>
            <p>• রুম কোড অন্য কাউকে দিলে ম্যাচ থেকে ব্যান করা হবে।</p>
          </div>

          {/* Join Errors & Messages */}
          {joinError && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 p-3 rounded-xl text-xs text-red-600 dark:text-red-300 font-medium">
              {joinError}
              {currentUser && currentUser.balance < tournament.entryFee && (
                <button
                  onClick={onNeedWallet}
                  className="mt-2 block w-full py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center font-bold"
                >
                  ওয়ালেটে এড মানি করুন (Add Money)
                </button>
              )}
            </div>
          )}

          {joinSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold">
              {joinSuccess}
            </div>
          )}

          {/* Action Join Footer */}
          {isJoined ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl text-center space-y-1.5 mt-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>স্লট বুকিং সম্পন্ন হয়েছে (স্লট #{myPlayer?.slotNumber})</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                একজন খেলোয়াড় একটি টুর্নামেন্টে শুধুমাত্র একবারই স্লট নিতে পারেন। আপনি ইতিমধ্যে এই টুর্নামেন্টে নথিভুক্ত হয়েছেন।
              </p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Free Fire UID *
                  </label>
                  <input
                    type="text"
                    value={ffUidInput}
                    onChange={(e) => setFfUidInput(e.target.value)}
                    placeholder="আপনার FF UID"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    In-Game Name *
                  </label>
                  <input
                    type="text"
                    value={inGameNameInput}
                    onChange={(e) => setInGameNameInput(e.target.value)}
                    placeholder="গেমের নিকনেম"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                onClick={handleJoinTournament}
                disabled={tournament.joinedPlayers.length >= tournament.totalSlots}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>স্লট বুকিং করুন (এন্ট্রি ফি: ৳{tournament.entryFee})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
