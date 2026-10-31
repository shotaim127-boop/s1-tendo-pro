import React, { useState, useEffect } from 'react';
import { StorageService, subscribeToStorage } from './services/storage';
import { AppConfig, Tournament, Transaction, UserAccount } from './types';
import { SplashLoader } from './components/SplashLoader';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { PlayScreen } from './components/PlayScreen';
import { MyMatchesScreen } from './components/MyMatchesScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { WalletModal } from './components/WalletModal';
import { TournamentDetailsModal } from './components/TournamentDetailsModal';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';
import { RulesModal } from './components/RulesModal';
import { TopPlayersModal } from './components/TopPlayersModal';
import { MyProfileModal } from './components/MyProfileModal';
import { SupportModal } from './components/SupportModal';
import { AdminSecurityGate } from './components/AdminSecurityGate';
import { AdminPanel } from './components/AdminPanel';
import { NotificationsModal } from './components/NotificationsModal';
import { ReferEarnModal } from './components/ReferEarnModal';
import { ShopModal } from './components/ShopModal';
import { LuckySpinModal } from './components/LuckySpinModal';
import { Lock } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('play');
  const [darkMode, setDarkMode] = useState<boolean>(StorageService.getDarkMode());

  // Core Data
  const [config, setConfig] = useState<AppConfig>(StorageService.getConfig());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(StorageService.getCurrentUser());
  const [tournaments, setTournaments] = useState<Tournament[]>(StorageService.getTournaments());
  const [transactions, setTransactions] = useState<Transaction[]>(StorageService.getTransactions());
  const [users, setUsers] = useState<UserAccount[]>(StorageService.getAllUsers());

  // Modals
  const [authOpen, setAuthOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletTab, setWalletTab] = useState<'add_money' | 'withdraw'>('add_money');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [topPlayersOpen, setTopPlayersOpen] = useState(false);
  const [myProfileOpen, setMyProfileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [referOpen, setReferOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [spinOpen, setSpinOpen] = useState(false);
  const [detailsTournament, setDetailsTournament] = useState<Tournament | null>(null);

  // Stealth Admin
  const [adminGateOpen, setAdminGateOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Sync with storage updates & real-time server database polling
  useEffect(() => {
    StorageService.syncWithServer();

    const unsubscribe = subscribeToStorage(() => {
      setConfig(StorageService.getConfig());
      setCurrentUser(StorageService.getCurrentUser());
      setTournaments(StorageService.getTournaments());
      setTransactions(StorageService.getTransactions());
      setUsers(StorageService.getAllUsers());
      setDarkMode(StorageService.getDarkMode());
    });

    // 2.5s real-time live polling so all devices see Add Money, Withdraw, and Tournaments live
    const interval = setInterval(() => {
      StorageService.syncWithServer();
    }, 2500);

    const handleFocus = () => {
      StorageService.syncWithServer();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Sync on admin panel open
  useEffect(() => {
    if (adminPanelOpen) {
      StorageService.syncWithServer();
    }
  }, [adminPanelOpen]);

  // Support stealth URL hash trigger: e.g. #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#s1admin') {
        setAdminGateOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update HTML class for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    StorageService.setDarkMode(next);
  };

  const handleOpenWalletWithTab = (tab: 'add_money' | 'withdraw') => {
    setWalletTab(tab);
    setWalletOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
  };

  return (
    <div className={`w-full min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors selection:bg-indigo-500 selection:text-white`}>
      {/* Fullscreen Shell */}
      <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#0c1017] relative flex flex-col overflow-x-hidden">
        {showSplash ? (
          <SplashLoader
            config={config}
            onFinish={() => {
              setShowSplash(false);
            }}
          />
        ) : !currentUser ? (
          <AuthScreen
            config={config}
            onSuccess={(user) => {
              setCurrentUser(user);
            }}
          />
        ) : (
          <>
            {/* Main Header matching Screenshot 1 */}
            <Header
              user={currentUser}
              config={config}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onOpenWallet={() => handleOpenWalletWithTab('add_money')}
              onOpenNotifications={() => setNotificationsOpen(true)}
              onOpenAdminAuth={() => setAdminGateOpen(true)}
            />

            {/* Main Screen Content by Tab */}
            <main className="w-full pb-20">
              {currentTab === 'play' && (
                <PlayScreen
                  tournaments={tournaments}
                  currentUser={currentUser}
                  config={config}
                  onSelectTournament={(t) => setDetailsTournament(t)}
                  onOpenSupport={() => setSupportOpen(true)}
                  onOpenRefer={() => setReferOpen(true)}
                  onOpenShop={() => setShopOpen(true)}
                  onOpenSpin={() => setSpinOpen(true)}
                />
              )}

              {currentTab === 'my-matches' && (
                <MyMatchesScreen
                  tournaments={tournaments}
                  currentUser={currentUser}
                  onBrowseMatches={() => setCurrentTab('play')}
                  onNeedAuth={() => setAuthOpen(true)}
                />
              )}

              {currentTab === 'results' && (
                <ResultsScreen tournaments={tournaments} />
              )}

              {currentTab === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
                  config={config}
                  onOpenWallet={() => handleOpenWalletWithTab('add_money')}
                  onOpenWithdraw={() => handleOpenWalletWithTab('withdraw')}
                  onOpenHistory={() => setHistoryOpen(true)}
                  onOpenMyProfile={() => setMyProfileOpen(true)}
                  onOpenRules={() => setRulesOpen(true)}
                  onOpenTopPlayers={() => setTopPlayersOpen(true)}
                  onOpenAdminAuth={() => setAdminGateOpen(true)}
                  onOpenRefer={() => setReferOpen(true)}
                  onOpenShop={() => setShopOpen(true)}
                  onOpenSpin={() => setSpinOpen(true)}
                  onLogout={() => {
                    StorageService.logout();
                    setAuthOpen(true);
                  }}
                  onNeedAuth={() => setAuthOpen(true)}
                />
              )}
            </main>

            {/* Bottom Navigation matching Screenshot 1 & Floating Mascot */}
            <BottomNav
              currentTab={currentTab}
              onChangeTab={handleTabChange}
              onOpenSupport={() => setSupportOpen(true)}
            />
          </>
        )}

        {/* MODALS & PORTALS */}

        {/* Auth Modal */}
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          config={config}
          onSuccess={(user) => setCurrentUser(user)}
        />

        {/* Wallet & Add Money / Withdraw Modal */}
        <WalletModal
          isOpen={walletOpen}
          onClose={() => setWalletOpen(false)}
          currentUser={currentUser}
          config={config}
          initialTab={walletTab}
          onNeedAuth={() => { setWalletOpen(false); setAuthOpen(true); }}
          onSuccess={() => setWalletOpen(false)}
        />

        {/* Tournament Details & Join Modal */}
        <TournamentDetailsModal
          tournament={detailsTournament}
          currentUser={currentUser}
          onClose={() => setDetailsTournament(null)}
          onNeedAuth={() => { setDetailsTournament(null); setAuthOpen(true); }}
          onNeedWallet={() => { setDetailsTournament(null); handleOpenWalletWithTab('add_money'); }}
        />

        {/* Transaction History Modal */}
        <TransactionHistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          transactions={transactions}
          userEmail={currentUser?.email || ''}
        />

        {/* Rules Modal */}
        <RulesModal
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
          config={config}
        />

        {/* Top Players Modal */}
        <TopPlayersModal
          isOpen={topPlayersOpen}
          onClose={() => setTopPlayersOpen(false)}
          users={users}
        />



        {/* My Profile Modal */}
        <MyProfileModal
          isOpen={myProfileOpen}
          onClose={() => setMyProfileOpen(false)}
          currentUser={currentUser}
        />

        {/* Support Modal */}
        <SupportModal
          isOpen={supportOpen}
          onClose={() => setSupportOpen(false)}
          config={config}
        />

        {/* Notifications Modal */}
        <NotificationsModal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          config={config}
        />

        {/* Dynamic Feature: Refer & Earn Modal */}
        <ReferEarnModal
          isOpen={referOpen}
          onClose={() => setReferOpen(false)}
          currentUser={currentUser}
          config={config}
          onSuccess={() => {
            setCurrentUser(StorageService.getCurrentUser());
          }}
        />

        {/* Dynamic Feature: Diamond Shop Modal */}
        <ShopModal
          isOpen={shopOpen}
          onClose={() => setShopOpen(false)}
          currentUser={currentUser}
          config={config}
          onNeedWallet={() => {
            setShopOpen(false);
            handleOpenWalletWithTab('add_money');
          }}
          onSuccess={() => {
            setCurrentUser(StorageService.getCurrentUser());
            setShopOpen(false);
          }}
        />

        {/* Dynamic Feature: Daily Lucky Spin Modal */}
        <LuckySpinModal
          isOpen={spinOpen}
          onClose={() => setSpinOpen(false)}
          currentUser={currentUser}
          config={config}
          onSuccess={() => {
            setCurrentUser(StorageService.getCurrentUser());
          }}
        />

        {/* Master Admin Security Gate */}
        <AdminSecurityGate
          isOpen={adminGateOpen}
          onClose={() => setAdminGateOpen(false)}
          config={config}
          onSuccess={() => {
            setAdminGateOpen(false);
            setAdminPanelOpen(true);
          }}
        />

        {/* Complete Admin Panel */}
        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          config={config}
          tournaments={tournaments}
          transactions={transactions}
          users={users}
        />
      </div>
    </div>
  );
}
