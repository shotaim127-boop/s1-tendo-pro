import React from 'react';
import { Users, Eye, KeyRound, Award, Sparkles, AlertCircle } from 'lucide-react';
import { Tournament, UserAccount } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  currentUser: UserAccount | null;
  onJoinClick: (tournament: Tournament) => void;
  onViewDetails: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  currentUser,
  onJoinClick,
  onViewDetails,
}) => {
  const isJoined = currentUser 
    ? tournament.joinedPlayers.some(p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
    : false;

  const playerSlot = currentUser && isJoined
    ? tournament.joinedPlayers.find(p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())?.slotNumber
    : null;

  const joinedCount = tournament.joinedPlayers.length;
  const isFull = joinedCount >= tournament.totalSlots;
  const progressPercent = Math.min(100, Math.round((joinedCount / tournament.totalSlots) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Top Banner & Title Header matching Screenshot 4 */}
      <div className="p-3.5 pb-2 border-b border-gray-50 dark:border-slate-800/80 flex gap-3">
        {/* Thumbnail */}
        <div className="w-18 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800 relative">
          <img
            src={tournament.bannerImage}
            alt={tournament.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-1">
            <span className="text-[9px] font-mono font-bold text-amber-300">
              {tournament.matchType}
            </span>
          </div>
        </div>

        {/* Title & Schedule */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
            {tournament.title}
          </h3>
          <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-0.5">
            {tournament.schedule}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
              #{tournament.id.slice(-6)}
            </span>
            <span>•</span>
            <span className="font-medium">{tournament.category}</span>
          </div>
        </div>
      </div>

      {/* 6 Stats Grid matching Screenshot 4 */}
      <div className="grid grid-cols-3 gap-y-2.5 gap-x-1 px-4 py-3 bg-gray-50/60 dark:bg-slate-800/40 text-center border-b border-gray-100 dark:border-slate-800">
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">WIN PRIZE</span>
          <span className="font-extrabold text-sm text-gray-900 dark:text-white font-mono">
            {tournament.winPrize} TK
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">ENTRY TYPE</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {tournament.matchType}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">ENTRY FEE</span>
          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
            {tournament.entryFee} TK
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">PER KILL</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white font-mono">
            {tournament.perKillPrize} TK
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">MAP</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {tournament.map}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">VERSION</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {tournament.version}
          </span>
        </div>
      </div>

      {/* Room ID & Password Secret Status Banner */}
      <div className="px-4 py-2 bg-amber-50/80 dark:bg-amber-950/20 border-b border-amber-100/60 dark:border-amber-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
          <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {isJoined ? (
            tournament.isRoomPublished ? (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" /> রুম আইডি ও পাসওয়ার্ড প্রকাশ হয়েছে!
              </span>
            ) : (
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                রুম আইডি ম্যাচ শুরুর ১৫ মিনিট আগে প্রকাশ হবে
              </span>
            )
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-[11px]">
              🔒 পাসওয়ার্ড দেখতে ম্যাচ স্লট ক্রয় করুন
            </span>
          )}
        </div>

        {isJoined && (
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md text-[10px] font-mono">
            SLOT #{playerSlot}
          </span>
        )}
      </div>

      {/* Slots Progress & Action Buttons */}
      <div className="p-3.5 flex items-center justify-between gap-3">
        {/* Slots */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3" /> স্লট বুকিং:
            </span>
            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
              {joinedCount}/{tournament.totalSlots}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onViewDetails(tournament)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> নিয়মাবলী
          </button>

          {isJoined ? (
            <button
              onClick={() => onViewDetails(tournament)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" /> রুম দেখুন
            </button>
          ) : (
            <button
              onClick={() => onJoinClick(tournament)}
              disabled={isFull}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isFull
                  ? 'bg-gray-300 dark:bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white active:scale-95 shadow-blue-500/25'
              }`}
            >
              {isFull ? 'হাউজফুল' : 'JOIN'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
