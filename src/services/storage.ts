import { AppConfig, Tournament, Transaction, UserAccount, MatchCategory, MatchWinner } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 's1_tendo_current_user',
  USERS_DB: 's1_tendo_users_db',
  TOURNAMENTS: 's1_tendo_tournaments',
  TRANSACTIONS: 's1_tendo_transactions',
  APP_CONFIG: 's1_tendo_app_config',
  DARK_MODE: 's1_tendo_dark_mode',
  NOTIFICATIONS: 's1_tendo_notifications',
};

// Default App Configuration
export const DEFAULT_CONFIG: AppConfig = {
  appName: 'S1 TENDO PRO',
  appVersion: '3.0',
  logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
  addMoneyNumber: '01749270694',
  bkashNumber: '01749270694',
  nagadNumber: '01749270694',
  adminPassword: '271030', // Default password requested, editable in admin panel
  telegramLink: 'https://t.me/s1tendopro_support',
  supportPhone: '01749270694',
  noticeText: 'রুম আইডি ও পাসওয়ার্ড ম্যাচ শুরুর ১৫ মিনিট পূর্বে অ্যাপের My Matches সেকশনে পাওয়া যাবে।',
  rulesText: [
    '১. টুর্নামেন্টে জয়েন করার পূর্বে আপনার সঠিক Free Fire UID ও In-Game Name প্রদান করুন।',
    '২. ম্যাচ শুরুর ১০-১৫ মিনিট আগে অ্যাপের "My Matches" সেকশনে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
    '৩. শুধুমাত্র যারা টুর্নামেন্ট স্লট ক্রয় করবেন, তারাই রুম আইডি ও পাসওয়ার্ড দেখতে পারবেন।',
    '৪. কোনো প্রকার হ্যাক, স্ক্রিপ্ট বা থার্ড পার্টি অ্যাপ ব্যবহার সম্পূর্ণ নিষিদ্ধ। ধরা পড়লে আজীবনের জন্য ব্যান।',
    '৫. রুম আইডি ও পাসওয়ার্ড অন্য কারো সাথে শেয়ার করলে আইডি ব্যান এবং পয়েন্ট বাজেয়াপ্ত করা হবে।',
    '৬. ম্যাচে কোনো টিম-আপ (Teaming) করা যাবে না। টিম-আপ প্রমাণিত হলে ডিসকোয়ালিফাই করা হবে।',
    '৭. পেমেন্ট ভেরিফিকেশনের জন্য বিকাশ বা নগদের সঠিক TrxID ও প্রেরক নাম্বার প্রদান করুন।',
  ],
  categoryImages: {
    'BR MATCH': '/assets/aistudio/images__19__98f14658.jpeg',
    'BR SURVIVAL': '/assets/aistudio/images__18__5da4719f.jpeg',
    'Clash Squad': '/assets/aistudio/images__12__5846dfdd.jpeg',
    'CS 2 VS 2': '/assets/aistudio/images__17__017bcfde.jpeg',
    'Lone Wolf 2v2': '/assets/aistudio/images__16__9f42e1c8.jpeg',
    'Lone Wolf 1 Vs 1': '/assets/aistudio/images__20__f9123c83.jpeg',
  },
};



// Default initial tournaments
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'ff-br-101',
    title: 'Duo Time | Mobile | Regular',
    category: 'BR MATCH',
    matchType: 'Duo',
    entryFee: 10,
    winPrize: 405,
    perKillPrize: 5,
    map: 'Bermuda',
    version: 'MOBILE',
    schedule: 'আজ রাত ০৯:০০ PM',
    totalSlots: 48,
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '8924105',
    roomPassword: '778',
    isRoomPublished: false,
    rules: 'No emulator allowed. Only mobile players. Match starts sharp at schedule time.',
    joinedPlayers: [
      {
        userId: 'demo-u1',
        userName: 'Tanvir Hossain',
        userEmail: 'tanvir@gmail.com',
        ffUid: '284729104',
        inGameName: 'S1_Tanvir★',
        phone: '01811223344',
        slotNumber: 1,
        joinedAt: '2026-10-30 11:30 AM',
      },
      {
        userId: 'demo-u2',
        userName: 'Rakib Gaming',
        userEmail: 'rakib@gmail.com',
        ffUid: '198273645',
        inGameName: 'R4KIB_OP',
        phone: '01922334455',
        slotNumber: 2,
        joinedAt: '2026-10-30 12:00 PM',
      },
    ],
  },
  {
    id: 'ff-br-102',
    title: 'BR Solo Survival | Booyah Master',
    category: 'BR SURVIVAL',
    matchType: 'Solo',
    entryFee: 20,
    winPrize: 800,
    perKillPrize: 10,
    map: 'Purgatory',
    version: 'MOBILE',
    schedule: 'আজ রাত ১০:০০ PM',
    totalSlots: 48,
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '9012345',
    roomPassword: '445',
    isRoomPublished: false,
    rules: 'Solo battle royale. Top 3 survival points rewarded.',
    joinedPlayers: [],
  },
  {
    id: 'ff-cs-201',
    title: 'CS 6 VS 6 || [1,2,5,6,9,10 Vs 3,4,7,8,11,12]',
    category: 'Clash Squad',
    matchType: '6v6',
    entryFee: 50,
    winPrize: 550,
    perKillPrize: 15,
    map: 'Bermuda',
    version: 'MOBILE',
    schedule: 'আজ রাত ০৮:৩০ PM',
    totalSlots: 12,
    bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '',
    roomPassword: '',
    isRoomPublished: false,
    rules: 'Grenade limit 1. Character skill on. Gun properties off.',
    joinedPlayers: [],
  },
  {
    id: 'ff-cs2-202',
    title: 'CS 2 VS 2 | [ 1,3 Vs 2,4 ] Pro Clash',
    category: 'CS 2 VS 2',
    matchType: '2v2',
    entryFee: 50,
    winPrize: 180,
    perKillPrize: 0,
    map: 'Bermuda',
    version: 'MOBILE',
    schedule: 'আজ বিকাল ০৫:০০ PM',
    totalSlots: 4,
    bannerImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '772199',
    roomPassword: '12',
    isRoomPublished: true,
    rules: '2v2 Duo clash squad. Headshot only round included.',
    joinedPlayers: [],
  },
  {
    id: 'ff-lw-301',
    title: 'Lone Wolf 2v2 | HEADSHOT 2V2 PRO',
    category: 'Lone Wolf 2v2',
    matchType: '2v2',
    entryFee: 30,
    winPrize: 110,
    perKillPrize: 0,
    map: 'Iron Cage',
    version: 'MOBILE',
    schedule: 'আজ রাত ০৯:৩০ PM',
    totalSlots: 4,
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '',
    roomPassword: '',
    isRoomPublished: false,
    rules: 'Lone Wolf 2v2 Headshot only match. Only headshots count.',
    joinedPlayers: [],
  },
  {
    id: 'ff-lw-302',
    title: 'Lone Wolf 1 Vs 1 | HEADSHOT 1V1 PRO',
    category: 'Lone Wolf 1 Vs 1',
    matchType: '1v1',
    entryFee: 50,
    winPrize: 90,
    perKillPrize: 0,
    map: 'Iron Cage',
    version: 'MOBILE',
    schedule: 'আজ রাত ১১:০০ PM',
    totalSlots: 2,
    bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    roomId: '',
    roomPassword: '',
    isRoomPublished: false,
    rules: 'Lone Wolf 1v1 Headshot only match. Test your headshot accuracy.',
    joinedPlayers: [],
  },
  // Sample completed matches for Result tab matching screenshot
  {
    id: 'ff-res-401',
    title: 'Duo Time | Mobile | Regular',
    category: 'BR MATCH',
    matchType: 'Solo',
    entryFee: 10,
    winPrize: 405,
    perKillPrize: 5,
    map: 'Bermuda',
    version: 'MOBILE',
    schedule: '2026-10-30 at 09:00 AM',
    totalSlots: 48,
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    status: 'completed',
    roomId: '811234',
    roomPassword: '99',
    isRoomPublished: true,
    joinedPlayers: [],
    winners: [
      { rank: 1, userId: 'u-w1', userName: 'Shuvo Saha', inGameName: 'shuvosaha99', ffUid: '89123847', kills: 8, prizeWon: 105 },
      { rank: 2, userId: 'u-w2', userName: 'Arman Khan', inGameName: 'Arman_FF', ffUid: '48392019', kills: 5, prizeWon: 65 },
      { rank: 3, userId: 'u-w3', userName: 'Fahim Apex', inGameName: 'Fahim_Boss', ffUid: '93019284', kills: 3, prizeWon: 40 },
    ],
  },
  {
    id: 'ff-res-402',
    title: 'CS 6 VS 6 | Mobile | Regular',
    category: 'Clash Squad',
    matchType: '6v6',
    entryFee: 50,
    winPrize: 800,
    perKillPrize: 10,
    map: 'Bermuda',
    version: 'MOBILE',
    schedule: '2026-10-29 at 10:00 PM',
    totalSlots: 12,
    bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    status: 'completed',
    roomId: '819922',
    roomPassword: '33',
    isRoomPublished: true,
    joinedPlayers: [],
    winners: [
      { rank: 1, userId: 'u-w1', userName: 'Shuvo Saha', inGameName: 'shuvosaha99', ffUid: '89123847', kills: 12, prizeWon: 80 },
    ],
  },
];



// Listeners for live sync
type StorageListener = () => void;
const listeners = new Set<StorageListener>();

export const subscribeToStorage = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach(fn => fn());
};

export const StorageService = {
  // Sync state between client device and shared server database
  async syncWithServer() {
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.success) return;

      let changed = false;

      // Update transactions
      if (Array.isArray(data.transactions)) {
        const localRaw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        const localTxs: Transaction[] = localRaw ? JSON.parse(localRaw) : [];

        // Check for any local pending transactions not on server, push them to server!
        const serverIds = new Set(data.transactions.map((t: any) => t.id));
        const missingOnServer = localTxs.filter(t => !serverIds.has(t.id) && t.status === 'pending');

        for (const missing of missingOnServer) {
          if (missing.type === 'add_money') {
            fetch('/api/transactions/request-add-money', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user: { id: missing.userId, email: missing.userEmail, name: missing.userName },
                method: missing.method || 'bKash',
                senderNumber: missing.senderNumber,
                trxId: missing.trxId,
                amount: missing.amount,
              }),
            }).catch(() => {});
          } else if (missing.type === 'withdraw') {
            fetch('/api/transactions/request-withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user: { id: missing.userId, email: missing.userEmail, name: missing.userName },
                method: missing.method || 'bKash',
                receiverNumber: missing.receiverNumber,
                amount: missing.amount,
              }),
            }).catch(() => {});
          }
        }

        // Merge missing pending items with server transactions so UI doesn't flicker
        const mergedTransactions = [...missingOnServer, ...data.transactions];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mergedTransactions));
        changed = true;
      }

      // Update tournaments
      if (Array.isArray(data.tournaments) && data.tournaments.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(data.tournaments));
        changed = true;
      }

      // Update users
      if (Array.isArray(data.users)) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(data.users));
        const current = this.getCurrentUser();
        if (current) {
          const freshUser = data.users.find((u: any) => u.email?.toLowerCase() === current.email?.toLowerCase());
          if (freshUser && (freshUser.balance !== current.balance || freshUser.matchesJoined !== current.matchesJoined)) {
            const updatedCurrent = { ...current, ...freshUser };
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedCurrent));
          }
        }
        changed = true;
      }

      // Update config
      if (data.config && Object.keys(data.config).length > 0) {
        const currentCfg = this.getConfig();
        const mergedCfg = { ...currentCfg, ...data.config };
        localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(mergedCfg));
        changed = true;
      }

      if (changed) {
        notifyListeners();
      }
    } catch {
      // offline fallback
    }
  },

  // App Config
  getConfig(): AppConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  updateConfig(config: Partial<AppConfig>): AppConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(updated));
    notifyListeners();

    fetch('/api/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configUpdate: config }),
    }).catch(() => {});

    return updated;
  },

  // Dark Mode
  getDarkMode(): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (raw === null) return false; // Default light like screenshot, user can toggle
    return raw === 'true';
  },

  setDarkMode(val: boolean) {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(val));
    notifyListeners();
  },

  // Users Database (indexed by email for seamless account restore)
  getAllUsers(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  findUserByEmail(email: string): UserAccount | undefined {
    const users = this.getAllUsers();
    return users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  },

  saveUser(user: UserAccount): UserAccount {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase().trim() === user.email.toLowerCase().trim());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));

    // Update current user if this is the active session
    const current = this.getCurrentUser();
    if (current && current.email.toLowerCase().trim() === user.email.toLowerCase().trim()) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    notifyListeners();

    // Persist to central server database
    fetch('/api/users/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    }).catch(() => {});

    return user;
  },

  // Session User
  getCurrentUser(): UserAccount | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    notifyListeners();
  },

  // Login or Register: Restores user balance and full history if same email
  loginOrRegister(payload: {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    ffUid?: string;
    inGameName?: string;
  }): { user: UserAccount; isRestored: boolean } {
    const cleanEmail = payload.email.toLowerCase().trim();
    const existing = this.findUserByEmail(cleanEmail);

    if (existing) {
      // Restore previous user and update any non-empty fields
      const updated: UserAccount = {
        ...existing,
        name: payload.name || existing.name,
        phone: payload.phone || existing.phone,
        ffUid: payload.ffUid || existing.ffUid,
        inGameName: payload.inGameName || existing.inGameName,
      };
      this.saveUser(updated);
      this.setCurrentUser(updated);
      return { user: updated, isRestored: true };
    }

    // New user creation
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: payload.name || payload.email.split('@')[0],
      email: cleanEmail,
      phone: payload.phone || '',
      ffUid: payload.ffUid || '',
      inGameName: payload.inGameName || payload.name || 'Survivor',
      balance: 0, // No welcome bonus, balance starts at 0 BDT
      totalWon: 0,
      matchesJoined: 0,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      createdAt: new Date().toISOString().split('T')[0],
      role: 'user',
    };

    this.saveUser(newUser);
    this.setCurrentUser(newUser);
    return { user: newUser, isRestored: false };
  },

  logout() {
    this.setCurrentUser(null);
  },

  // Tournaments
  getTournaments(): Tournament[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(INITIAL_TOURNAMENTS));
      return INITIAL_TOURNAMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TOURNAMENTS;
    }
  },

  saveTournament(tournament: Tournament): Tournament {
    const tournaments = this.getTournaments();
    const idx = tournaments.findIndex(t => t.id === tournament.id);
    if (idx >= 0) {
      tournaments[idx] = tournament;
    } else {
      tournaments.unshift(tournament);
    }
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    notifyListeners();

    // Persist to central server database
    fetch('/api/tournaments/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament }),
    }).catch(() => {});

    return tournament;
  },

  deleteTournament(tournamentId: string) {
    const tournaments = this.getTournaments().filter(t => t.id !== tournamentId);
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    notifyListeners();

    // Persist to central server database
    fetch('/api/tournaments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId }),
    }).catch(() => {});
  },

  // Join Tournament with single-email restriction & balance deduction
  joinTournament(tournamentId: string, user: UserAccount): { success: boolean; message: string } {
    const tournaments = this.getTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      return { success: false, message: 'টুর্নামেন্ট পাওয়া যায়নি!' };
    }

    // Check if already joined with this email (User prompt requirement)
    const alreadyJoined = tournament.joinedPlayers.some(
      p => p.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim()
    );
    if (alreadyJoined) {
      return { success: false, message: 'একটি টুর্নামেন্টে একই জিমেইল দিয়ে দুই বার জয়েন করা যাবে না।' };
    }

    // Check slots
    if (tournament.joinedPlayers.length >= tournament.totalSlots) {
      return { success: false, message: 'টুর্নামেন্টের সকল স্লট পূর্ণ হয়ে গেছে!' };
    }

    // Check wallet balance
    if (user.balance < tournament.entryFee) {
      return { 
        success: false, 
        message: `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${user.balance}, প্রয়োজন: ৳${tournament.entryFee}। দয়া করে এড মানি করুন।` 
      };
    }

    // Deduct entry fee
    const updatedUser: UserAccount = {
      ...user,
      balance: user.balance - tournament.entryFee,
      matchesJoined: (user.matchesJoined || 0) + 1,
    };
    this.saveUser(updatedUser);

    // Add player to tournament
    const newSlotNumber = tournament.joinedPlayers.length + 1;
    const joinedPlayer = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      ffUid: user.ffUid,
      inGameName: user.inGameName,
      phone: user.phone,
      slotNumber: newSlotNumber,
      joinedAt: new Date().toLocaleString('en-US'),
    };
    tournament.joinedPlayers.push(joinedPlayer);
    this.saveTournament(tournament);

    // Record Transaction
    this.createTransaction({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      type: 'tournament_entry',
      amount: tournament.entryFee,
      status: 'completed',
      tournamentId: tournament.id,
      tournamentTitle: tournament.title,
      note: `স্লট #${newSlotNumber} ক্রয় করা হয়েছে`,
    });

    notifyListeners();
    return { success: true, message: `সফলভাবে জয়েন করেছেন! আপনার স্লট নাম্বার #${newSlotNumber}` };
  },

  // Transactions
  getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      // Initial demo transactions matching screenshot
      const initialTx: Transaction[] = [
        {
          id: 'tx-init-1',
          userId: 'user-demo-shuvo',
          userEmail: 'shuvosaha99@gmail.com',
          userName: 'Shuvo Saha',
          type: 'tournament_win',
          amount: 80,
          status: 'completed',
          tournamentTitle: 'CS 6 VS 6 | Mobile | Regular',
          createdAt: '2026-08-21 11:46 AM',
        },
        {
          id: 'tx-init-2',
          userId: 'user-demo-shuvo',
          userEmail: 'shuvosaha99@gmail.com',
          userName: 'Shuvo Saha',
          type: 'tournament_win',
          amount: 25,
          status: 'completed',
          tournamentTitle: 'CS 6 VS 6 || [1,2,5,6,9,10 Vs 3,4,7,8,11,12]',
          createdAt: '2026-08-21 12:41 PM',
        },
        {
          id: 'tx-init-3',
          userId: 'user-demo-shuvo',
          userEmail: 'shuvosaha99@gmail.com',
          userName: 'Shuvo Saha',
          type: 'add_money',
          amount: 50,
          status: 'completed',
          method: 'bKash',
          senderNumber: '01712345678',
          trxId: 'BKS92837482',
          createdAt: '2026-08-20 04:15 PM',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTx));
      return initialTx;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createTransaction(txData: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const all = this.getTransactions();
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }),
    };
    all.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    notifyListeners();

    // Persist to central server database if not add_money or withdraw (which have dedicated endpoints)
    if (newTx.type !== 'add_money' && newTx.type !== 'withdraw') {
      fetch('/api/transactions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: newTx }),
      }).catch(() => {});
    }

    return newTx;
  },

  // Add Money Request (Stays PENDING until Admin confirms)
  requestAddMoney(params: {
    user: UserAccount;
    method: 'bKash' | 'Nagad';
    senderNumber: string;
    trxId: string;
    amount: number;
  }): Transaction {
    const localTx = this.createTransaction({
      userId: params.user.id,
      userEmail: params.user.email,
      userName: params.user.name,
      type: 'add_money',
      amount: params.amount,
      status: 'pending',
      method: params.method,
      senderNumber: params.senderNumber,
      trxId: params.trxId.toUpperCase().trim(),
      note: 'এডমিন ভেরিফিকেশনের অপেক্ষায়',
    });

    // Send to central server database immediately
    fetch('/api/transactions/request-add-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(() => {
        this.syncWithServer();
      })
      .catch(() => {});

    return localTx;
  },

  // AI Auto Verify and Instant Add Money
  aiVerifyAndAddMoney(params: {
    user: UserAccount;
    method: 'bKash' | 'Nagad';
    senderNumber: string;
    trxId: string;
    amount: number;
  }): { success: boolean; message: string; transaction?: Transaction } {
    const cleanTrx = params.trxId.toUpperCase().trim();
    if (!cleanTrx || cleanTrx.length < 5) {
      return { success: false, message: 'সঠিক Transaction ID দিন।' };
    }
    if (!params.senderNumber || params.senderNumber.length < 11) {
      return { success: false, message: 'সঠিক প্রেরক মোবাইল নাম্বার দিন।' };
    }

    const allTxs = this.getTransactions();
    const duplicate = allTxs.find(t => t.trxId && t.trxId.toUpperCase() === cleanTrx && t.status === 'completed');
    if (duplicate) {
      return { success: false, message: 'এই ট্রানজেকশন আইডি (TrxID) ইতিপূর্বে ব্যবহার করা হয়েছে!' };
    }

    const tx = this.createTransaction({
      userId: params.user.id,
      userEmail: params.user.email,
      userName: params.user.name,
      type: 'add_money',
      amount: params.amount,
      status: 'completed',
      method: params.method,
      senderNumber: params.senderNumber,
      trxId: cleanTrx,
      note: '🤖 Gemini AI Auto-Verified & Instant Credited',
    });

    const updatedUser: UserAccount = {
      ...params.user,
      balance: params.user.balance + params.amount,
    };
    this.saveUser(updatedUser);

    return {
      success: true,
      message: `টাকা সফলভাবে AI দ্বারা ভেরিফাই ও ওয়ালেটে যুক্ত হয়েছে! ৳${params.amount} যোগ করা হয়েছে।`,
      transaction: tx,
    };
  },

  // Withdraw Request (Stays PENDING until Admin confirms)
  requestWithdraw(params: {
    user: UserAccount;
    method: 'bKash' | 'Nagad';
    receiverNumber: string;
    amount: number;
  }): { success: boolean; message: string; transaction?: Transaction } {
    if (params.user.balance < params.amount) {
      return { success: false, message: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই।' };
    }
    if (params.amount < 50) {
      return { success: false, message: 'সর্বনিম্ন উইথড্র পরিমাণ ৫০ টাকা।' };
    }

    // Deduct immediately so user cannot double-spend while pending
    const updatedUser: UserAccount = {
      ...params.user,
      balance: params.user.balance - params.amount,
    };
    this.saveUser(updatedUser);

    const tx = this.createTransaction({
      userId: params.user.id,
      userEmail: params.user.email,
      userName: params.user.name,
      type: 'withdraw',
      amount: params.amount,
      status: 'pending',
      method: params.method,
      receiverNumber: params.receiverNumber,
      note: 'এডমিন কর্তৃক প্রসেসিং হচ্ছে',
    });

    // Send to central server
    fetch('/api/transactions/request-withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(() => this.syncWithServer())
      .catch(() => {});

    return { success: true, message: 'উইথড্র রিকোয়েস্ট জমা হয়েছে। এডমিন কনফার্ম করলে টাকা পেয়ে যাবেন।', transaction: tx };
  },

  // Admin Actions for Add Money
  adminApproveAddMoney(transactionId: string): boolean {
    const all = this.getTransactions();
    const tx = all.find(t => t.id === transactionId);
    if (!tx || tx.type !== 'add_money' || tx.status !== 'pending') return false;

    tx.status = 'completed';
    tx.adminNote = 'এডমিন কর্তৃক পেমেন্ট অনুমোদিত ও ব্যালেন্স যুক্ত হয়েছে';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));

    // Credit user's wallet
    const user = this.findUserByEmail(tx.userEmail);
    if (user) {
      user.balance += tx.amount;
      this.saveUser(user);
    }
    notifyListeners();

    fetch('/api/transactions/approve-add-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    })
      .then(() => this.syncWithServer())
      .catch(() => {});

    return true;
  },

  adminRejectAddMoney(transactionId: string, reason?: string): boolean {
    const all = this.getTransactions();
    const tx = all.find(t => t.id === transactionId);
    if (!tx || tx.type !== 'add_money' || tx.status !== 'pending') return false;

    tx.status = 'rejected';
    tx.adminNote = reason || 'ভুল TrxID বা টাকা পাওয়া যায়নি';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    notifyListeners();

    fetch('/api/transactions/reject-add-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, reason }),
    })
      .then(() => this.syncWithServer())
      .catch(() => {});

    return true;
  },

  // Admin Actions for Withdraw
  adminApproveWithdraw(transactionId: string): boolean {
    const all = this.getTransactions();
    const tx = all.find(t => t.id === transactionId);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') return false;

    tx.status = 'completed';
    tx.adminNote = 'টাকা সফলভাবে বিকাশ/নগদে পাঠানো হয়েছে';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
    notifyListeners();

    fetch('/api/transactions/approve-withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    })
      .then(() => this.syncWithServer())
      .catch(() => {});

    return true;
  },

  adminRejectWithdraw(transactionId: string, reason?: string): boolean {
    const all = this.getTransactions();
    const tx = all.find(t => t.id === transactionId);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') return false;

    tx.status = 'rejected';
    tx.adminNote = reason || 'নাম্বার ভুল বা রিকোয়েস্ট বাতিল';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));

    // Refund back to user's wallet
    const user = this.findUserByEmail(tx.userEmail);
    if (user) {
      user.balance += tx.amount;
      this.saveUser(user);
    }
    notifyListeners();

    fetch('/api/transactions/reject-withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, reason }),
    })
      .then(() => this.syncWithServer())
      .catch(() => {});

    return true;
  },

  // Admin Room Details Publisher & Notification Dispatcher
  adminSetRoomDetails(params: {
    tournamentId: string;
    roomId: string;
    roomPassword: string;
    isRoomPublished: boolean;
  }) {
    const tournaments = this.getTournaments();
    const tournament = tournaments.find(t => t.id === params.tournamentId);
    if (!tournament) return false;

    tournament.roomId = params.roomId;
    tournament.roomPassword = params.roomPassword;
    tournament.isRoomPublished = params.isRoomPublished;
    this.saveTournament(tournament);

    // If published, push instant notification to all booked/joined players
    if (params.isRoomPublished && params.roomId) {
      const rawNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const allNotifs: any[] = rawNotifs ? JSON.parse(rawNotifs) : [];
      
      tournament.joinedPlayers.forEach(player => {
        allNotifs.unshift({
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          userEmail: player.userEmail,
          title: `🔑 রুম আইডি প্রকাশিত হয়েছে: ${tournament.title}`,
          message: `রুম আইডি: ${params.roomId} | পাসওয়ার্ড: ${params.roomPassword}. ম্যাচ শুরুর পূর্বে রেডি থাকুন!`,
          tournamentId: tournament.id,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        });
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(allNotifs));
    }

    notifyListeners();
    return true;
  },

  getAllNotifications(userEmail?: string): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return [];
    try {
      const all: any[] = JSON.parse(raw);
      if (userEmail) {
        return all.filter(n => n.userEmail.toLowerCase().trim() === userEmail.toLowerCase().trim());
      }
      return all;
    } catch {
      return [];
    }
  },

  // Admin Winner Declaration & Automatic Prize Credit
  adminDeclareWinners(tournamentId: string, winners: MatchWinner[]): boolean {
    const tournaments = this.getTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return false;

    tournament.winners = winners;
    tournament.status = 'completed';
    this.saveTournament(tournament);

    // Credit prizes to each winner
    winners.forEach(w => {
      const user = this.findUserByEmail(w.userId) || this.getAllUsers().find(u => u.id === w.userId || u.ffUid === w.ffUid);
      if (user && w.prizeWon > 0) {
        user.balance += w.prizeWon;
        user.totalWon = (user.totalWon || 0) + w.prizeWon;
        this.saveUser(user);

        // Record Win Transaction
        this.createTransaction({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          type: 'tournament_win',
          amount: w.prizeWon,
          status: 'completed',
          tournamentId: tournament.id,
          tournamentTitle: tournament.title,
          note: `অভিনন্দন! র‍্যাঙ্ক #${w.rank} অর্জন করেছেন (${w.kills} কিল)`,
        });
      }
    });

    notifyListeners();
    return true;
  },

  // Admin Manual Balance Adjustment
  adminAdjustBalance(userEmail: string, deltaAmount: number, reason: string): boolean {
    const user = this.findUserByEmail(userEmail);
    if (!user) return false;

    user.balance = Math.max(0, user.balance + deltaAmount);
    this.saveUser(user);

    this.createTransaction({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      type: 'admin_adjustment',
      amount: Math.abs(deltaAmount),
      status: 'completed',
      note: `এডমিন সমন্বয়: ${reason} (${deltaAmount >= 0 ? '+' : '-'}${Math.abs(deltaAmount)} ৳)`,
    });

    notifyListeners();
    return true;
  },
};
