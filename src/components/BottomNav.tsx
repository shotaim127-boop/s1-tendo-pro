import React from 'react';
import { Gamepad2, ListOrdered, TrendingUp, User, Headphones } from 'lucide-react';

export type TabType = 'play' | 'my-matches' | 'results' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenSupport: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenSupport,
}) => {
  const tabs = [
    { id: 'play' as TabType, label: 'Play', icon: Gamepad2, color: 'text-indigo-500' },
    { id: 'my-matches' as TabType, label: 'My Matches', icon: ListOrdered, color: 'text-amber-500' },
    { id: 'results' as TabType, label: 'Results', icon: TrendingUp, color: 'text-emerald-500' },
    { id: 'profile' as TabType, label: 'Profile', icon: User, color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Floating 24/7 Support Mascot Button matching screenshot floating avatar */}
      <button
        onClick={onOpenSupport}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-xl shadow-amber-500/30 border-2 border-white flex items-center justify-center active:scale-90 transition-transform group animate-bounce duration-1000"
        title="২৪/৭ কাস্টমার সাপোর্ট"
      >
        <span className="text-xl">🐱</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
      </button>

      {/* Main Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="w-full px-2 h-16 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {/* Active Indicator Background Pill */}
                {isActive && (
                  <span className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl -z-10 scale-95" />
                )}
                
                <Icon
                  className={`w-5 h-5 mb-1 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                <span className="text-[11px] leading-tight tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
