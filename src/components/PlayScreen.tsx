import React, { useState } from 'react';
import { Radio, ChevronRight, Headphones, Volume2, ArrowLeft, Flame, Sparkles } from 'lucide-react';
import { Tournament, MatchCategory, UserAccount, AppConfig } from '../types';
import { TournamentCard } from './TournamentCard';

interface PlayScreenProps {
  tournaments: Tournament[];
  currentUser: UserAccount | null;
  config: AppConfig;
  onSelectTournament: (tournament: Tournament) => void;
  onOpenSupport: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  tournaments,
  currentUser,
  config,
  onSelectTournament,
  onOpenSupport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MatchCategory | 'ALL' | null>(null);

  // Free Fire 6 standard categories matching user screenshots
  const categories: {
    id: MatchCategory;
    title: string;
    image: string;
    badgeCount: number;
  }[] = [
    {
      id: 'BR MATCH',
      title: 'BR MATCH',
      image: config.categoryImages?.['BR MATCH'] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'BR MATCH' && t.status !== 'completed').length,
    },
    {
      id: 'BR SURVIVAL',
      title: 'BR SURVIVAL',
      image: config.categoryImages?.['BR SURVIVAL'] || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'BR SURVIVAL' && t.status !== 'completed').length,
    },
    {
      id: 'Clash Squad',
      title: 'Clash Squad',
      image: config.categoryImages?.['Clash Squad'] || 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'Clash Squad' && t.status !== 'completed').length,
    },
    {
      id: 'CS 2 VS 2',
      title: 'CS 2 VS 2',
      image: config.categoryImages?.['CS 2 VS 2'] || 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'CS 2 VS 2' && t.status !== 'completed').length,
    },
    {
      id: 'Lone Wolf 2v2',
      title: 'Lone Wolf 2v2',
      image: config.categoryImages?.['Lone Wolf 2v2'] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'Lone Wolf 2v2' && t.status !== 'completed').length,
    },
    {
      id: 'Lone Wolf 1 Vs 1',
      title: 'Lone Wolf 1 Vs 1',
      image: config.categoryImages?.['Lone Wolf 1 Vs 1'] || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
      badgeCount: tournaments.filter(t => t.category === 'Lone Wolf 1 Vs 1' && t.status !== 'completed').length,
    },
  ];

  const filteredTournaments = selectedCategory === 'ALL'
    ? tournaments.filter(t => t.status !== 'completed')
    : selectedCategory
      ? tournaments.filter(t => t.category === selectedCategory && t.status !== 'completed')
      : [];

  return (
    <div className="pb-24 pt-2 px-3 max-w-md mx-auto space-y-3.5">
      {/* If a category is selected, show category matches */}
      {selectedCategory !== null ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>সকল ক্যাটাগরি</span>
            </button>
            <span className="font-heading font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
              {selectedCategory === 'ALL' ? 'লাইভ ম্যাচসমূহ' : selectedCategory}
            </span>
          </div>

          {filteredTournaments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-slate-800">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 mb-2">
                🎮
              </div>
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                এই ক্যাটাগরিতে বর্তমানে কোনো লাইভ ম্যাচ নেই
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                এডমিন শীঘ্রই নতুন টুর্নামেন্ট স্লট ওপেন করবেন। কিছুক্ষণ পর পুনরায় চেক করুন।
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                অন্য ক্যাটাগরি দেখুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  currentUser={currentUser}
                  onJoinClick={onSelectTournament}
                  onViewDetails={onSelectTournament}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 1. Top Telegram Support Slider Banner matching Screenshot 1 */}
          <div 
            onClick={onOpenSupport}
            className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-4 shadow-lg border border-emerald-500/20 group"
          >
            {/* Background elements */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1 pr-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 mb-1">
                  <Sparkles className="w-3 h-3" /> অফিশিয়াল হেল্পডেস্ক
                </span>
                <h3 className="font-heading font-extrabold text-base sm:text-lg tracking-wide text-emerald-300">
                  WELCOME TO JOIN OUR COMMUNITY
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  আমাদের টেলিগ্রাম গ্রুপে যুক্ত হয়ে টুর্নামেন্ট আপডেট ও সাপোর্ট নিন।
                </p>
                
                {/* Fast • Safe • Trusted badges matching screenshot */}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-300 font-medium">
                  <span className="flex items-center gap-1">⚡ Fast</span>
                  <span className="flex items-center gap-1">🛡️ Safe</span>
                  <span className="flex items-center gap-1">🤝 Trusted</span>
                </div>

                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                  <span>Click here for join Telegram</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Telegram App Logo Avatar */}
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 p-2 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                  alt="Telegram"
                  className="w-full h-full object-contain filter drop-shadow"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Slider Dots Indicator matching screenshot */}
            <div className="flex justify-center items-center gap-1.5 mt-3 pt-1 border-t border-white/10">
              <span className="w-4 h-1 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1 rounded-full bg-white/40" />
              <span className="w-1.5 h-1 rounded-full bg-white/40" />
              <span className="w-1.5 h-1 rounded-full bg-white/40" />
              <span className="w-1.5 h-1 rounded-full bg-white/40" />
            </div>
          </div>

          {/* 2. Orange Notice Bar matching Screenshot 1 */}
          <div 
            className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-900/40 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <p className="truncate">
                {config.noticeText}
              </p>
            </div>
          </div>

          {/* 3. 24/7 Support Card matching Screenshot 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Headphones className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  কোনো সাহায্য দরকার?
                </h4>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ২৪/৭ কাস্টমার সাপোর্ট
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSupport}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span>যোগাযোগ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Red Button: LIVE MATCHES - এখনই দেখুন matching Screenshot 1 */}
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 text-white font-extrabold rounded-2xl shadow-md shadow-red-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all tracking-wide text-sm font-heading"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>• LIVE MATCHES - এখনই দেখুন</span>
          </button>

          {/* 5. Section Heading: FREE FIRE matching Screenshot 1 */}
          <div className="pt-1">
            <h2 className="text-center font-extrabold text-gray-700 dark:text-gray-300 font-heading tracking-widest text-base uppercase">
              FREE FIRE
            </h2>
          </div>

          {/* 6. Free Fire 6 Categories 2-Column Grid matching Screenshot 1 & 2 */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col active:scale-95"
              >
                {/* Image Banner */}
                <div className="h-24 w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Chip */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-amber-400 px-1.5 py-0.5 rounded font-mono border border-white/10">
                    ESPORTS
                  </div>
                </div>

                {/* Card Title & Found count */}
                <div className="p-3 bg-white dark:bg-slate-900">
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white font-heading truncate">
                    {cat.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {cat.badgeCount} matches found
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
