import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Award, Swords } from 'lucide-react';
import { Tournament } from '../types';

interface ResultsScreenProps {
  tournaments: Tournament[];
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ tournaments }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FF FULLMAP' | 'FF Clash Squad' | 'LoneWolf' | 'CS 1v1 2v2' | 'BR Survival'>('FF FULLMAP');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterChips = [
    { id: 'FF FULLMAP', label: 'FF FULLMAP' },
    { id: 'FF Clash Squad', label: 'FF Clash Squad' },
    { id: 'LoneWolf', label: 'LoneWolf' },
    { id: 'CS 1v1 2v2', label: 'CS 1v1 2v2' },
    { id: 'BR Survival', label: 'BR Survival' },
    { id: 'ALL', label: 'সকল রেজাল্ট' },
  ] as const;

  const completedTournaments = tournaments.filter(t => {
    if (t.status !== 'completed') return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FF FULLMAP') return t.category === 'BR MATCH';
    if (activeFilter === 'FF Clash Squad') return t.category === 'Clash Squad';
    if (activeFilter === 'LoneWolf') return t.category.includes('Lone Wolf');
    if (activeFilter === 'CS 1v1 2v2') return t.category === 'CS 2 VS 2';
    if (activeFilter === 'BR Survival') return t.category === 'BR SURVIVAL';
    return true;
  });

  return (
    <div className="pb-24 pt-2 px-3 max-w-md mx-auto space-y-3">
      {/* Header matching Screenshot 4 */}
      <div className="text-center py-1">
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 font-heading tracking-wide">
          Result
        </h2>
        <p className="text-[11px] text-gray-400">
          সমাপ্ত টুর্নামেন্টের ফলাফল ও চ্যাম্পিয়ন তালিকা
        </p>
      </div>

      {/* Horizontal Filter Chips matching Screenshot 4 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterChips.map(chip => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-sm' // yellow chip from screenshot 4
                  : 'bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-slate-700 hover:bg-indigo-100'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Completed Matches List */}
      {completedTournaments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-800">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">
            এই ক্যাটাগরিতে এখনও কোনো রেজাল্ট পাবলিশ হয়নি
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            টুর্নামেন্ট সমাপ্ত হওয়া মাত্রই এডমিন প্যানেল থেকে বিজয়ী ঘোষণা করা হবে।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedTournaments.map(match => {
            const isExpanded = expandedId === match.id;
            return (
              <div
                key={match.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden"
              >
                {/* Header matching Screenshot 4 */}
                <div className="p-3.5 pb-2 flex gap-3">
                  <div className="w-18 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={match.bannerImage}
                      alt={match.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {match.title}
                    </h3>
                    <p className="text-xs font-semibold text-rose-500 mt-0.5">
                      {match.schedule}
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                      MATCH FINISHED
                    </span>
                  </div>
                </div>

                {/* 6 Stats Grid matching Screenshot 4 */}
                <div className="grid grid-cols-3 gap-y-2 gap-x-1 px-4 py-2.5 bg-gray-50/60 dark:bg-slate-800/40 text-center border-t border-b border-gray-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">WIN PRIZE</span>
                    <span className="font-extrabold text-sm text-gray-900 dark:text-white font-mono">
                      {match.winPrize} TK
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">ENTRY TYPE</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {match.matchType}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">ENTRY FEE</span>
                    <span className="font-extrabold text-sm text-gray-900 dark:text-white font-mono">
                      {match.entryFee}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">PER KILL</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white font-mono">
                      {match.perKillPrize}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">MAP</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {match.map}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">VERSION</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {match.version}
                    </span>
                  </div>
                </div>

                {/* Winners Accordion Trigger */}
                <div className="p-2.5 bg-white dark:bg-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>বিজয়ীদের তালিকা ({match.winners?.length || 0})</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : match.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>{isExpanded ? 'লুকান' : 'বিস্তারিত দেখুন'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Winners Leaderboard */}
                {isExpanded && (
                  <div className="p-3 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-slate-800/80 dark:to-slate-800/40 border-t border-gray-100 dark:border-slate-800 space-y-2">
                    {match.winners && match.winners.length > 0 ? (
                      match.winners.map(winner => (
                        <div
                          key={winner.rank + winner.inGameName}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-700 shadow-xs text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center font-mono ${
                              winner.rank === 1
                                ? 'bg-amber-400 text-slate-900 shadow-xs'
                                : winner.rank === 2
                                  ? 'bg-slate-300 text-slate-800'
                                  : 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                            }`}>
                              #{winner.rank}
                            </span>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white leading-tight">
                                {winner.inGameName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">
                                UID: {winner.ffUid} • {winner.kills} Kills
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase">
                              PRIZE WON
                            </span>
                            <span className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                              ৳{winner.prizeWon}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-center text-gray-400 py-1">
                        কোনো বিজয়ী তথ্য নেই
                      </p>
                    )}
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
