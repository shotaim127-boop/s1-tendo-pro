import React, { useState } from 'react';
import { KeyRound, Copy, Check, Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Tournament, UserAccount } from '../types';

interface MyMatchesScreenProps {
  tournaments: Tournament[];
  currentUser: UserAccount | null;
  onBrowseMatches: () => void;
  onNeedAuth: () => void;
}

export const MyMatchesScreen: React.FC<MyMatchesScreenProps> = ({
  tournaments,
  currentUser,
  onBrowseMatches,
  onNeedAuth,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
          🎮
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          আপনার জয়েন করা ম্যাচ দেখতে লগইন করুন
        </h3>
        <p className="text-xs text-gray-500">
          জিমেইল দিয়ে লগইন করলেই আপনার সমস্ত পূর্বের ম্যাচ ও রুম তথ্য দেখতে পাবেন।
        </p>
        <button
          onClick={onNeedAuth}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  // Filter tournaments user has joined
  const myJoinedMatches = tournaments.filter(t =>
    t.joinedPlayers.some(p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
  );

  const handleCopy = (text: string, type: 'id' | 'pass', matchId: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(matchId);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedPass(matchId);
      setTimeout(() => setCopiedPass(null), 2000);
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 max-w-md mx-auto space-y-3">
      {/* Title Header matching Screenshot 6 */}
      <div className="text-center py-2">
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 font-heading uppercase tracking-wider">
          MY MATCHES
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          মোট জয়েন করা ম্যাচ: <span className="font-bold text-indigo-600 dark:text-indigo-400">{myJoinedMatches.length}</span>
        </p>
      </div>

      {myJoinedMatches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-500 text-2xl">
            📋
          </div>
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
            আপনি এখনও কোনো ম্যাচে জয়েন করেননি
          </h4>
          <p className="text-xs text-gray-500">
            টুর্নামেন্ট সেকশন থেকে আপনার পছন্দের স্লট বুকিং করুন এবং আকর্ষণীয় প্রাইজ জিতে নিন!
          </p>
          <button
            onClick={onBrowseMatches}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            ম্যাচ খুঁজুন (Browse Matches)
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {myJoinedMatches.map((match, idx) => {
            const playerInfo = match.joinedPlayers.find(
              p => p.userEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
            );
            const isExpanded = expandedId === match.id;
            const myWinnerRecord = match.winners?.find(
              w => w.userEmail === currentUser.email || w.userId === currentUser.id
            );
            const wonAmount = myWinnerRecord ? myWinnerRecord.prizeWon : 0;

            return (
              <div
                key={match.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Main Card Header matching Screenshot 6 */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : match.id)}
                  className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Left Index Number */}
                  <div className="text-base font-extrabold text-gray-400 font-mono w-5 pt-0.5 text-center">
                    {idx + 1}
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 truncate">
                      {match.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {playerInfo?.joinedAt || match.schedule}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-mono">
                        #{match.id.slice(-6)}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Won Amount: <strong className="font-mono">{wonAmount} TK</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Entry Fee Badge & Expand Chevron */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-slate-900 dark:bg-slate-800 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                      TK {match.entryFee}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Expanded Details: Room ID & Password */}
                {isExpanded && (
                  <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        আপনার স্লট নাম্বার: <strong className="font-mono text-indigo-600 dark:text-indigo-400 text-sm">#{playerInfo?.slotNumber}</strong>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        স্ট্যাটাস: {match.status === 'completed' ? 'সমাপ্ত' : 'স্লট কনফার্মড'}
                      </span>
                    </div>

                    {/* Room ID & Password Box */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                          কাস্টম রুম তথ্য:
                        </span>
                        {match.isRoomPublished ? (
                          <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">
                            রুম উন্মুক্ত
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">
                            অপেক্ষারত
                          </span>
                        )}
                      </div>

                      {match.isRoomPublished && match.roomId ? (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg text-xs">
                            <span className="font-medium text-gray-500">Room ID:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                                {match.roomId}
                              </span>
                              <button
                                onClick={() => handleCopy(match.roomId || '', 'id', match.id)}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-indigo-600"
                                title="কপি করুন"
                              >
                                {copiedId === match.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/80 p-2 rounded-lg text-xs">
                            <span className="font-medium text-gray-500">Password:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                                {match.roomPassword || 'None'}
                              </span>
                              <button
                                onClick={() => handleCopy(match.roomPassword || '', 'pass', match.id)}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-indigo-600"
                                title="কপি করুন"
                              >
                                {copiedPass === match.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-[11px] text-amber-800 dark:text-amber-300">
                          ম্যাচ শুরুর ১০-১৫ মিনিট পূর্বে রুম আইডি ও পাসওয়ার্ড এখানে স্বয়ংক্রিয়ভাবে ভেসে উঠবে। দয়া করে অপেক্ষা করুন।
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
