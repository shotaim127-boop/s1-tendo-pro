export type MatchCategory = 
  | 'BR MATCH' 
  | 'BR SURVIVAL' 
  | 'Clash Squad' 
  | 'CS 2 VS 2' 
  | 'Lone Wolf 2v2' 
  | 'Lone Wolf 1 Vs 1';

export type MatchType = 'Solo' | 'Duo' | 'Squad' | '6v6' | '1v1' | '2v2';
export type MatchStatus = 'upcoming' | 'ongoing' | 'completed';

export interface JoinedPlayer {
  userId: string;
  userName: string;
  userEmail: string;
  ffUid: string;
  inGameName: string;
  phone: string;
  slotNumber: number;
  joinedAt: string;
}

export interface MatchWinner {
  rank: number;
  userId: string;
  userName: string;
  inGameName: string;
  ffUid: string;
  kills: number;
  prizeWon: number;
  userEmail?: string;
}

export interface Tournament {
  id: string;
  title: string;
  category: MatchCategory;
  matchType: MatchType;
  entryFee: number;
  winPrize: number;
  perKillPrize: number;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra' | 'Iron Cage';
  version: 'MOBILE' | 'ALL';
  schedule: string;
  totalSlots: number;
  bannerImage: string;
  status: MatchStatus;
  roomId?: string;
  roomPassword?: string;
  isRoomPublished?: boolean;
  joinedPlayers: JoinedPlayer[];
  winners?: MatchWinner[];
  rules?: string;
}

export type TransactionType = 'add_money' | 'withdraw' | 'tournament_entry' | 'tournament_win' | 'admin_adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'rejected';
export type PaymentMethod = 'bKash' | 'Nagad';

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  method?: PaymentMethod;
  senderNumber?: string;
  receiverNumber?: string;
  trxId?: string;
  tournamentId?: string;
  tournamentTitle?: string;
  createdAt: string;
  note?: string;
  adminNote?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  ffUid: string;
  inGameName: string;
  password?: string;
  balance: number;
  totalWon: number;
  matchesJoined: number;
  avatarUrl: string;
  createdAt: string;
  role: 'user' | 'admin';
  referralCode?: string;
  referredBy?: string;
  totalReferrals?: number;
  referralEarnings?: number;
  lastSpinDate?: string;
}

export interface AppFeatures {
  referAndEarn: boolean;
  referralBonus: number;
  shopTopUp: boolean;
  luckySpin: boolean;
  communityChat: boolean;
  leaderboard: boolean;
  maintenanceMode?: boolean;
  maintenanceNotice?: string;
  customFeatureName?: string;
  customFeatureDescription?: string;
}

export interface AppConfig {
  appName: string;
  appVersion: string;
  logoUrl: string;
  addMoneyNumber: string;
  bkashNumber: string;
  nagadNumber: string;
  adminPassword: string;
  telegramLink: string;
  supportPhone: string;
  noticeText: string;
  rulesText: string[];
  categoryImages?: Record<string, string>;
  features?: AppFeatures;
}
