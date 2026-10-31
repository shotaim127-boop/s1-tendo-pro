import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, LayoutDashboard, CreditCard, Banknote, Trophy, Users, Settings, 
  Check, XCircle, Plus, Edit2, Trash2, KeyRound, Sparkles, AlertTriangle, 
  Search, ShieldCheck, ArrowRight, Eye, Phone, RefreshCw, DollarSign,
  Upload, Image as ImageIcon, Camera, Bot, Wand2, Send, Zap, Copy, CheckCheck,
  Gift, Gem, ToggleRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppConfig, Tournament, Transaction, UserAccount, MatchCategory, MatchWinner, MatchType } from '../types';
import { StorageService } from '../services/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  tournaments: Tournament[];
  transactions: Transaction[];
  users: UserAccount[];
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  action?: {
    actionType: 'CREATE_TOURNAMENT' | 'UPDATE_NOTICE' | 'ADD_RULE' | 'GENERATE_ROOM' | 'TOGGLE_FEATURE' | 'UPDATE_CONFIG' | 'NONE';
    tournamentData?: any;
    noticeText?: string;
    ruleText?: string;
    roomId?: string;
    roomPassword?: string;
    featureKey?: string;
    featureEnabled?: boolean;
    featureData?: any;
    configUpdate?: any;
  };
  applied?: boolean;
  timestamp: string;
}

type AdminTab = 'dashboard' | 'ai_assistant' | 'add_money' | 'withdraw' | 'tournaments' | 'users' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  config,
  tournaments,
  transactions,
  users,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Settings form states
  const [appName, setAppName] = useState(config.appName);
  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [addMoneyNumber, setAddMoneyNumber] = useState(config.addMoneyNumber);
  const [bkashNumber, setBkashNumber] = useState(config.bkashNumber || config.addMoneyNumber);
  const [nagadNumber, setNagadNumber] = useState(config.nagadNumber || config.addMoneyNumber);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [noticeText, setNoticeText] = useState(config.noticeText);
  const [telegramLink, setTelegramLink] = useState(config.telegramLink);
  const [supportPhone, setSupportPhone] = useState(config.supportPhone);
  const [rulesInput, setRulesInput] = useState(config.rulesText.join('\n'));
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    config.categoryImages || {
      'BR MATCH': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
      'BR SURVIVAL': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
      'Clash Squad': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
      'CS 2 VS 2': 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
      'Lone Wolf 2v2': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
      'Lone Wolf 1 Vs 1': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    }
  );

  // Tournament Create/Edit Form State
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [tTitle, setTTitle] = useState('');
  const [tCategory, setTCategory] = useState<MatchCategory>('BR MATCH');
  const [tMatchType, setTMatchType] = useState<MatchType>('Solo');
  const [tEntryFee, setTEntryFee] = useState('20');
  const [tWinPrize, setTWinPrize] = useState('800');
  const [tPerKill, setTPerKill] = useState('10');
  const [tMap, setTMap] = useState<'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra' | 'Iron Cage'>('Bermuda');
  const [tSchedule, setTSchedule] = useState('আজ রাত ১০:০০ PM');
  const [tTotalSlots, setTTotalSlots] = useState('48');
  const [tBanner, setTBanner] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
  const [tRules, setTRules] = useState('No emulator. Only mobile players.');

  // Room ID/Pass Modal State
  const [roomModalTournament, setRoomModalTournament] = useState<Tournament | null>(null);
  const [mRoomId, setMRoomId] = useState('');
  const [mRoomPass, setMRoomPass] = useState('');
  const [mPublish, setMPublish] = useState(true);

  // Winner Declaration Modal State
  const [winnerModalTournament, setWinnerModalTournament] = useState<Tournament | null>(null);
  const [w1stPlayer, setW1stPlayer] = useState('');
  const [w1stKills, setW1stKills] = useState('5');
  const [w1stPrize, setW1stPrize] = useState('400');
  const [w2ndPlayer, setW2ndPlayer] = useState('');
  const [w2ndKills, setW2ndKills] = useState('3');
  const [w2ndPrize, setW2ndPrize] = useState('250');
  const [w3rdPlayer, setW3rdPlayer] = useState('');
  const [w3rdKills, setW3rdKills] = useState('1');
  const [w3rdPrize, setW3rdPrize] = useState('150');

  // User details & audit modal state
  const [selectedUserForAudit, setSelectedUserForAudit] = useState<UserAccount | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState('');
  const [balanceAdjustReason, setBalanceAdjustReason] = useState('এডমিন রিওয়ার্ড');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // AI Assistant State
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [autoApplyAi, setAutoApplyAi] = useState(true);
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-ai',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম এডমিন! আমি S1 TENDO PRO এর AI সহকারী। আপনি এখানে বাংলায় বা ইংরেজিতে যা আদেশ করবেন (যেমন: "আজ রাত ১০টায় ৫০ টাকার CS টুর্নামেন্ট বানিয়ে দাও" বা "নোটিশ বারে লিখে দাও আজ স্পেশাল ম্যাচ"), আমি নিমেষেই তা তৈরি করে সরাসরি অ্যাপে লাইভ করে দেব!',
      timestamp: 'এখন',
    },
  ]);

  // Execute AI Action directly into App Storage
  const executeAiAction = (msg: AiChatMessage) => {
    if (!msg.action || msg.applied) return;
    const { actionType, tournamentData, noticeText: newNotice, ruleText: newRule } = msg.action;

    if (actionType === 'CREATE_TOURNAMENT' && tournamentData) {
      const newTournament: Tournament = {
        id: `t-ai-${Date.now()}`,
        title: tournamentData.title || 'BR Solo | AI Pro Tournament',
        category: (tournamentData.category as MatchCategory) || 'BR MATCH',
        matchType: (tournamentData.matchType as MatchType) || 'Solo',
        entryFee: Number(tournamentData.entryFee) || 20,
        winPrize: Number(tournamentData.winPrize) || 800,
        perKillPrize: Number(tournamentData.perKillPrize) || 10,
        map: (tournamentData.map as any) || 'Bermuda',
        version: 'MOBILE',
        schedule: tournamentData.schedule || 'আজ রাত ১০:০০ PM',
        totalSlots: Number(tournamentData.totalSlots) || 48,
        bannerImage: tournamentData.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
        status: 'upcoming',
        rules: tournamentData.rules || '100% Mobile Only. Emulators strictly banned. Gameplay recording recommended.',
        joinedPlayers: [],
        roomId: '',
        roomPassword: '',
        isRoomPublished: false,
      };

      StorageService.saveTournament(newTournament);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch {}
      showToast(`🎉 "${newTournament.title}" সফলভাবে অ্যাপে যুক্ত ও লাইভ করা হয়েছে!`);
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    } else if (actionType === 'UPDATE_NOTICE' && newNotice) {
      StorageService.updateConfig({ noticeText: newNotice });
      setNoticeText(newNotice);
      showToast('📢 অ্যাপের নোটিশ বার সফলভাবে আপডেট করা হয়েছে!');
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    } else if (actionType === 'ADD_RULE' && newRule) {
      const updatedRules = [...config.rulesText, newRule];
      StorageService.updateConfig({ rulesText: updatedRules });
      setRulesInput(updatedRules.join('\n'));
      showToast('📜 টুর্নামেন্ট নীতিমালায় নতুন অ্যান্টি-চিট নিয়ম যুক্ত হয়েছে!');
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    } else if (actionType === 'GENERATE_ROOM' && msg.action.roomId) {
      showToast(`🔑 রুম আইডি: ${msg.action.roomId} ও পাসওয়ার্ড জেনারেট হয়েছে!`);
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    } else if (actionType === 'TOGGLE_FEATURE' && msg.action.featureKey) {
      const currentFeatures = config.features || {
        referAndEarn: true,
        referralBonus: 10,
        shopTopUp: false,
        luckySpin: false,
        communityChat: false,
        leaderboard: true,
      };
      const key = msg.action.featureKey;
      const isEnabled = msg.action.featureEnabled !== false;
      const updatedFeatures = {
        ...currentFeatures,
        [key]: isEnabled,
        ...(msg.action.featureData || {}),
      };
      StorageService.updateConfig({ features: updatedFeatures });
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch {}
      const featureNames: Record<string, string> = {
        referAndEarn: 'রেফার অ্যান্ড আর্ন (Refer & Earn)',
        shopTopUp: 'ডায়মন্ড টপ-আপ শপ (Top-Up Shop)',
        luckySpin: 'ডেইলি লাকি স্পিন (Lucky Spin)',
        communityChat: 'কমিউনিটি লাইভ চ্যাট',
        leaderboard: 'টপ প্লেয়ার লিডারবোর্ড',
        maintenanceMode: 'মেইনটেন্যান্স মোড',
      };
      const fName = featureNames[key] || key;
      showToast(`⚡ "${fName}" ফিচারটি সফলভাবে অ্যাপে ${isEnabled ? 'অন (ON)' : 'অফ (OFF)'} করা হয়েছে!`);
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    } else if (actionType === 'UPDATE_CONFIG' && msg.action.configUpdate) {
      StorageService.updateConfig(msg.action.configUpdate);
      if (msg.action.configUpdate.bkashNumber) setBkashNumber(msg.action.configUpdate.bkashNumber);
      if (msg.action.configUpdate.nagadNumber) setNagadNumber(msg.action.configUpdate.nagadNumber);
      if (msg.action.configUpdate.noticeText) setNoticeText(msg.action.configUpdate.noticeText);
      showToast('⚙️ অ্যাপের কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!');
      setAiMessages(prev => prev.map(m => m.id === msg.id ? { ...m, applied: true } : m));
    }
  };

  // Send Prompt to Gemini AI via server-side endpoint
  const handleSendAiPrompt = async (customPrompt?: string) => {
    const textToSend = (customPrompt || aiInput).trim();
    if (!textToSend || isAiLoading) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          currentContext: {
            appName: config.appName,
            activeTournamentsCount: tournaments.length,
            noticeText: config.noticeText,
            addMoneyNumber: config.addMoneyNumber,
          },
        }),
      });

      const resJson = await res.json();
      if (resJson && resJson.data) {
        const { 
          message, 
          actionType, 
          tournamentData, 
          noticeText: genNotice, 
          ruleText: genRule, 
          roomId, 
          roomPassword,
          featureKey,
          featureEnabled,
          featureData,
          configUpdate,
        } = resJson.data;

        const aiMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: message || 'আপনার অনুরোধ সফলভাবে সম্পন্ন করা হয়েছে!',
          action: {
            actionType: actionType || 'NONE',
            tournamentData,
            noticeText: genNotice,
            ruleText: genRule,
            roomId,
            roomPassword,
            featureKey,
            featureEnabled,
            featureData,
            configUpdate,
          },
          applied: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        if (autoApplyAi && actionType && actionType !== 'NONE') {
          // If autoApply is checked, automatically execute directly
          executeAiAction(aiMsg);
          aiMsg.applied = true;
        }

        setAiMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('No valid response data');
      }
    } catch (err: any) {
      console.error('AI Error:', err);
      const fallbackMsg: AiChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'আপনার অনুরোধটি প্রসেস করতে সাময়িক সমস্যা হয়েছে। আপনি কি নিচের দ্রুত প্রিসেট বাটনগুলো দিয়ে টুর্নামেন্ট বানাতে চান?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper to compress and convert file from device gallery to data URL
  const processGalleryImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void,
    maxWidth = 800,
    maxHeight = 600
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const isPng = file.type === 'image/png';
          const format = isPng ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(format, 0.9);
          onSuccess(compressed);
          showToast('গ্যালারি থেকে ছবি সফলভাবে যুক্ত হয়েছে!');
        } else {
          onSuccess(loadEvent.target?.result as string);
          showToast('গ্যালারি থেকে ছবি যুক্ত হয়েছে!');
        }
      };
      img.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Pending transactions
  const pendingAddMoney = transactions.filter(t => t.type === 'add_money' && t.status === 'pending');
  const pendingWithdraws = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');
  const activeTournaments = tournaments.filter(t => t.status !== 'completed');

  // Handlers for Add Money
  const handleApproveAddMoney = (txId: string) => {
    const success = StorageService.adminApproveAddMoney(txId);
    if (success) {
      showToast('পেমেন্ট সফলভাবে এপ্রুভ করা হয়েছে ও ইউজারের ব্যালেন্স যোগ হয়েছে!');
    }
  };

  const handleRejectAddMoney = (txId: string) => {
    const reason = prompt('বাতিল করার কারণ লিখুন:', 'ভুল TrxID বা পেমেন্ট পাওয়া যায়নি');
    if (reason !== null) {
      StorageService.adminRejectAddMoney(txId, reason);
      showToast('পেমেন্ট রিকোয়েস্ট বাতিল করা হয়েছে।');
    }
  };

  // Handlers for Withdraw
  const handleApproveWithdraw = (txId: string) => {
    const success = StorageService.adminApproveWithdraw(txId);
    if (success) {
      showToast('উইথড্র সফলভাবে অনুমোদিত হয়েছে!');
    }
  };

  const handleRejectWithdraw = (txId: string) => {
    const reason = prompt('উইথড্র বাতিল ও রিফান্ডের কারণ লিখুন:', 'নাম্বার ভুল');
    if (reason !== null) {
      StorageService.adminRejectWithdraw(txId, reason);
      showToast('উইথড্র বাতিল করা হয়েছে এবং ইউজারের ব্যালেন্স ফেরত দেওয়া হয়েছে।');
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePayload: Partial<AppConfig> = {
      appName,
      logoUrl,
      addMoneyNumber,
      bkashNumber,
      nagadNumber,
      noticeText,
      telegramLink,
      supportPhone,
      rulesText: rulesInput.split('\n').filter(r => r.trim().length > 0),
      categoryImages,
    };

    if (newAdminPassword.trim().length > 0) {
      updatePayload.adminPassword = newAdminPassword.trim();
      setNewAdminPassword('');
    }

    StorageService.updateConfig(updatePayload);
    showToast('অ্যাপ সেটিংস ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!');
  };

  // Open Create/Edit Tournament
  const handleOpenCreateTournament = () => {
    setEditingTournamentId(null);
    setTTitle('BR Solo | Booyah Master Pro');
    setTCategory('BR MATCH');
    setTMatchType('Solo');
    setTEntryFee('20');
    setTWinPrize('800');
    setTPerKill('10');
    setTMap('Bermuda');
    setTSchedule('আজ রাত ১০:০০ PM');
    setTTotalSlots('48');
    setTBanner('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
    setTRules('No emulator. Only mobile players.');
    setShowTournamentModal(true);
  };

  const handleOpenEditTournament = (t: Tournament) => {
    setEditingTournamentId(t.id);
    setTTitle(t.title);
    setTCategory(t.category);
    setTMatchType(t.matchType);
    setTEntryFee(String(t.entryFee));
    setTWinPrize(String(t.winPrize));
    setTPerKill(String(t.perKillPrize));
    setTMap(t.map);
    setTSchedule(t.schedule);
    setTTotalSlots(String(t.totalSlots));
    setTBanner(t.bannerImage);
    setTRules(t.rules || '');
    setShowTournamentModal(true);
  };

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const tournamentData: Tournament = {
      id: editingTournamentId || `t-${Date.now()}`,
      title: tTitle,
      category: tCategory,
      matchType: tMatchType,
      entryFee: parseFloat(tEntryFee) || 10,
      winPrize: parseFloat(tWinPrize) || 100,
      perKillPrize: parseFloat(tPerKill) || 0,
      map: tMap,
      version: 'MOBILE',
      schedule: tSchedule,
      totalSlots: parseInt(tTotalSlots) || 48,
      bannerImage: tBanner,
      status: 'upcoming',
      rules: tRules,
      joinedPlayers: editingTournamentId 
        ? tournaments.find(t => t.id === editingTournamentId)?.joinedPlayers || [] 
        : [],
      roomId: editingTournamentId 
        ? tournaments.find(t => t.id === editingTournamentId)?.roomId || '' 
        : '',
      roomPassword: editingTournamentId 
        ? tournaments.find(t => t.id === editingTournamentId)?.roomPassword || '' 
        : '',
      isRoomPublished: editingTournamentId 
        ? tournaments.find(t => t.id === editingTournamentId)?.isRoomPublished || false 
        : false,
    };

    StorageService.saveTournament(tournamentData);
    setShowTournamentModal(false);
    showToast(editingTournamentId ? 'টুর্নামেন্ট আপডেট করা হয়েছে!' : 'নতুন টুর্নামেন্ট সফলভাবে ছাড়া হয়েছে!');
  };

  const handleDeleteTournament = (id: string) => {
    StorageService.deleteTournament(id);
    showToast('টুর্নামেন্ট সফলভাবে মুছে ফেলা হয়েছে।');
  };

  // Room details update
  const handleOpenRoomModal = (t: Tournament) => {
    setRoomModalTournament(t);
    setMRoomId(t.roomId || '');
    setMRoomPass(t.roomPassword || '');
    setMPublish(t.isRoomPublished || false);
  };

  const handleSaveRoomDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomModalTournament) return;
    StorageService.adminSetRoomDetails({
      tournamentId: roomModalTournament.id,
      roomId: mRoomId,
      roomPassword: mRoomPass,
      isRoomPublished: mPublish,
    });
    setRoomModalTournament(null);
    showToast('রুম আইডি ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে! এনরোল্ড প্লেয়াররা এটি দেখতে পাবে।');
  };

  // Declare Winners
  const handleOpenWinnerModal = (t: Tournament) => {
    setWinnerModalTournament(t);
    const p1 = t.joinedPlayers[0]?.userId || '';
    const p2 = t.joinedPlayers[1]?.userId || '';
    const p3 = t.joinedPlayers[2]?.userId || '';
    setW1stPlayer(p1);
    setW2ndPlayer(p2);
    setW3rdPlayer(p3);
    setW1stPrize(String(Math.round(t.winPrize * 0.5)));
    setW2ndPrize(String(Math.round(t.winPrize * 0.3)));
    setW3rdPrize(String(Math.round(t.winPrize * 0.2)));
  };

  const handleSaveWinners = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winnerModalTournament) return;

    const winners: MatchWinner[] = [];

    if (w1stPlayer) {
      const p = winnerModalTournament.joinedPlayers.find(jp => jp.userId === w1stPlayer);
      if (p) {
        winners.push({
          rank: 1,
          userId: p.userId,
          userName: p.userName,
          inGameName: p.inGameName,
          ffUid: p.ffUid,
          kills: parseInt(w1stKills) || 0,
          prizeWon: parseFloat(w1stPrize) || 0,
        });
      }
    }

    if (w2ndPlayer) {
      const p = winnerModalTournament.joinedPlayers.find(jp => jp.userId === w2ndPlayer);
      if (p) {
        winners.push({
          rank: 2,
          userId: p.userId,
          userName: p.userName,
          inGameName: p.inGameName,
          ffUid: p.ffUid,
          kills: parseInt(w2ndKills) || 0,
          prizeWon: parseFloat(w2ndPrize) || 0,
        });
      }
    }

    if (w3rdPlayer) {
      const p = winnerModalTournament.joinedPlayers.find(jp => jp.userId === w3rdPlayer);
      if (p) {
        winners.push({
          rank: 3,
          userId: p.userId,
          userName: p.userName,
          inGameName: p.inGameName,
          ffUid: p.ffUid,
          kills: parseInt(w3rdKills) || 0,
          prizeWon: parseFloat(w3rdPrize) || 0,
        });
      }
    }

    StorageService.adminDeclareWinners(winnerModalTournament.id, winners);
    setWinnerModalTournament(null);
    try {
      confetti({ particleCount: 100, spread: 80 });
    } catch {}
    showToast('বিজয়ী নির্বাচন সম্পন্ন হয়েছে এবং বিজয়ীদের ওয়ালেটে প্রাইজমানি অটোমেটিক ক্রেডিট হয়েছে!');
  };

  // Adjust User Balance
  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAudit) return;
    const delta = parseFloat(balanceAdjustAmount);
    if (isNaN(delta)) return;

    StorageService.adminAdjustBalance(selectedUserForAudit.email, delta, balanceAdjustReason);
    setBalanceAdjustAmount('');
    showToast(`ইউজারের ব্যালেন্স ${delta >= 0 ? '+' : ''}${delta} ৳ আপডেট করা হয়েছে!`);
    
    // Refresh selected user
    const updated = StorageService.findUserByEmail(selectedUserForAudit.email);
    if (updated) setSelectedUserForAudit(updated);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.ffUid.includes(userSearchQuery) ||
    u.phone.includes(userSearchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] text-gray-100"
      >
        {/* Admin Master Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white font-heading tracking-wide">
                  {config.appName} • সুপার এডমিন কন্ট্রোল
                </h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold px-2 py-0.5 rounded border border-rose-500/30">
                  ROOT
                </span>
              </div>
              <p className="text-xs text-gray-400">
                পেমেন্ট রিকোয়েস্ট, উইথড্র, টুর্নামেন্ট, ইউজার অডিট ও সিস্টেম কনফিগারেশন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex bg-slate-950/80 border-b border-slate-800 px-3 py-2 gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'dashboard' as AdminTab, label: 'ড্যাশবোর্ড', icon: LayoutDashboard, badge: null, isAi: false },
            { id: 'ai_assistant' as AdminTab, label: '🤖 AI সহকারী (Bot)', icon: Sparkles, badge: 'AUTO', isAi: true },
            { id: 'add_money' as AdminTab, label: 'এড মানি রিকোয়েস্ট', icon: CreditCard, badge: pendingAddMoney.length, isAi: false },
            { id: 'withdraw' as AdminTab, label: 'উইথড্র রিকোয়েস্ট', icon: Banknote, badge: pendingWithdraws.length, isAi: false },
            { id: 'tournaments' as AdminTab, label: 'টুর্নামেন্ট নিয়ন্ত্রণ', icon: Trophy, badge: activeTournaments.length, isAi: false },
            { id: 'users' as AdminTab, label: 'ইউজার ও হিস্ট্রি', icon: Users, badge: users.length, isAi: false },
            { id: 'settings' as AdminTab, label: 'অ্যাপ সেটিংস ও পাসওয়ার্ড', icon: Settings, badge: null, isAi: false },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? tab.isAi
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/50'
                      : 'bg-blue-600 text-white shadow-sm'
                    : tab.isAi
                      ? 'text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/60'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.isAi ? 'text-amber-300 animate-pulse' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-extrabold ${
                    tab.isAi
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : tab.id === 'add_money' || tab.id === 'withdraw'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-700 text-gray-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Toast Alert */}
        {feedback && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs px-4 py-2 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-gray-400 block">মোট নিবন্ধিত ইউজার</span>
                  <span className="text-2xl font-black font-mono text-white mt-1 block">
                    {users.length}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-0.5 block">সক্রিয় প্লেয়ার</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50">
                  <span className="text-[11px] font-semibold text-amber-300 block">পেন্ডিং এড মানি</span>
                  <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
                    {pendingAddMoney.length}
                  </span>
                  <span className="text-[10px] text-amber-400/80 mt-0.5 block">
                    মোট: ৳{pendingAddMoney.reduce((acc, t) => acc + t.amount, 0)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50">
                  <span className="text-[11px] font-semibold text-rose-300 block">পেন্ডিং উইথড্র</span>
                  <span className="text-2xl font-black font-mono text-rose-400 mt-1 block">
                    {pendingWithdraws.length}
                  </span>
                  <span className="text-[10px] text-rose-400/80 mt-0.5 block">
                    মোট: ৳{pendingWithdraws.reduce((acc, t) => acc + t.amount, 0)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50">
                  <span className="text-[11px] font-semibold text-blue-300 block">লাইভ টুর্নামেন্ট</span>
                  <span className="text-2xl font-black font-mono text-blue-400 mt-1 block">
                    {activeTournaments.length}
                  </span>
                  <span className="text-[10px] text-blue-400/80 mt-0.5 block">স্লট বুকিং চলছে</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('ai_assistant')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/25 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>🤖 AI দিয়ে কিছু তৈরি / এড করুন</span>
                </button>
                <button
                  onClick={handleOpenCreateTournament}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> নতুন টুর্নামেন্ট ছাড়ুন
                </button>
                <button
                  onClick={() => setActiveTab('add_money')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <CreditCard className="w-4 h-4" /> পেন্ডিং এড মানি ({pendingAddMoney.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <KeyRound className="w-4 h-4" /> এডমিন পাসওয়ার্ড ও নাম্বার পরিবর্তন
                </button>
              </div>

              {/* Recent Activity Ledger */}
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  সাম্প্রতিক লেনদেন লগ
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {transactions.slice(0, 8).map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-200">
                          {tx.userName} ({tx.userEmail})
                        </span>
                        <p className="text-[10px] text-gray-400">
                          {tx.type} • {tx.trxId ? `TrxID: ${tx.trxId}` : tx.tournamentTitle || tx.note} • {tx.createdAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-gray-200">
                          ৳{tx.amount}
                        </span>
                        <span className={`block text-[10px] font-bold ${
                          tx.status === 'completed' ? 'text-emerald-400' : tx.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD MONEY REQUESTS (পেমেন্ট রিকোয়েস্ট এক্সেপ্ট/রিজেক্ট) */}
          {activeTab === 'add_money' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    এড মানি রিকোয়েস্ট তালিকা ({pendingAddMoney.length} টি পেন্ডিং)
                  </h3>
                  <p className="text-xs text-gray-400">
                    ইউজারের TrxID যাচাই করে কনফার্ম করুন। কনফার্ম করার সাথে সাথে ইউজারের ওয়ালেটে ব্যালেন্স যুক্ত হবে।
                  </p>
                </div>
              </div>

              {pendingAddMoney.length === 0 ? (
                <div className="p-8 bg-slate-800/40 rounded-2xl text-center border border-slate-700 text-gray-400 text-xs">
                  বর্তমানে কোনো পেন্ডিং এড মানি রিকোয়েস্ট নেই।
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingAddMoney.map(tx => (
                    <div
                      key={tx.id}
                      className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.method === 'bKash' ? 'bg-pink-500/20 text-pink-300' : 'bg-orange-500/20 text-orange-300'
                          }`}>
                            {tx.method}
                          </span>
                          <span className="font-bold text-sm text-white">
                            ৳{tx.amount} টাকা
                          </span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono">
                            PENDING
                          </span>
                        </div>

                        <div className="text-xs text-gray-300 space-y-0.5">
                          <p>
                            ইউজার: <strong>{tx.userName}</strong> ({tx.userEmail})
                          </p>
                          <p>
                            প্রেরক নাম্বার: <strong className="font-mono text-amber-300">{tx.senderNumber}</strong>
                          </p>
                          <p>
                            TrxID: <strong className="font-mono text-cyan-300 uppercase tracking-wider">{tx.trxId}</strong>
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            সময়: {tx.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveAddMoney(tx.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>কনফার্ম করুন (+৳{tx.amount})</span>
                        </button>
                        <button
                          onClick={() => handleRejectAddMoney(tx.id)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>বাতিল</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WITHDRAW REQUESTS */}
          {activeTab === 'withdraw' && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  উইথড্র রিকোয়েস্ট তালিকা ({pendingWithdraws.length} টি পেন্ডিং)
                </h3>
                <p className="text-xs text-gray-400">
                  ইউজারের বিকাশ বা নগদ নাম্বারে টাকা পাঠিয়ে 'পরিশোধ সম্পন্ন' বাটনে ক্লিক করুন।
                </p>
              </div>

              {pendingWithdraws.length === 0 ? (
                <div className="p-8 bg-slate-800/40 rounded-2xl text-center border border-slate-700 text-gray-400 text-xs">
                  বর্তমানে কোনো পেন্ডিং উইথড্র রিকোয়েস্ট নেই।
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingWithdraws.map(tx => (
                    <div
                      key={tx.id}
                      className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.method === 'bKash' ? 'bg-pink-500/20 text-pink-300' : 'bg-orange-500/20 text-orange-300'
                          }`}>
                            {tx.method}
                          </span>
                          <span className="font-bold text-sm text-white">
                            ৳{tx.amount} টাকা
                          </span>
                        </div>

                        <div className="text-xs text-gray-300 space-y-0.5">
                          <p>ইউজার: <strong>{tx.userName}</strong> ({tx.userEmail})</p>
                          <p>
                            যে নাম্বারে টাকা পাঠাতে হবে: <strong className="font-mono text-emerald-400 text-sm">{tx.receiverNumber}</strong>
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">রিকোয়েস্ট সময়: {tx.createdAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleApproveWithdraw(tx.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>পরিশোধ সম্পন্ন</span>
                        </button>
                        <button
                          onClick={() => handleRejectWithdraw(tx.id)}
                          className="flex-1 sm:flex-none px-3 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>বাতিল ও রিফান্ড</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TOURNAMENTS MANAGER */}
          {activeTab === 'tournaments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    টুর্নামেন্ট নিয়ন্ত্রণ ও রুম আইডি/পাসওয়ার্ড
                  </h3>
                  <p className="text-xs text-gray-400">
                    নতুন টুর্নামেন্ট তৈরি করুন, রুম পাসওয়ার্ড দিন এবং বিজয়ী নির্ধারণ করুন
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateTournament}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> নতুন টুর্নামেন্ট
                </button>
              </div>

              <div className="space-y-3">
                {tournaments.map(t => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-slate-800/70 rounded-2xl border border-slate-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={t.bannerImage}
                            alt={t.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.2 rounded font-mono">
                              {t.category} • {t.matchType}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              t.status === 'completed'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {t.status === 'completed' ? 'সমাপ্ত' : 'চলমান/আসন্ন'}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white mt-1">
                            {t.title}
                          </h4>
                          <p className="text-xs text-rose-400 font-semibold">
                            {t.schedule} • ম্যাপ: {t.map}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditTournament(t)}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats & Enrolled Roster preview */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-900/60 p-2 rounded-xl">
                      <div>
                        <span className="text-[10px] text-gray-400">এন্ট্রি ফি</span>
                        <p className="font-mono font-bold text-emerald-400">৳{t.entryFee}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400">উইন প্রাইজ</span>
                        <p className="font-mono font-bold text-amber-400">৳{t.winPrize}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400">পার কিল</span>
                        <p className="font-mono font-bold text-white">৳{t.perKillPrize}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400">স্লট বুকিং</span>
                        <p className="font-mono font-bold text-indigo-400">{t.joinedPlayers.length}/{t.totalSlots}</p>
                      </div>
                    </div>

                    {/* Control Buttons: Room ID/Pass & Winners */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-700/60">
                      {/* Set Room Details Button */}
                      <button
                        onClick={() => handleOpenRoomModal(t)}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>
                          {t.roomId ? `রুম: ${t.roomId} (পাস: ${t.roomPassword || 'None'})` : 'রুম আইডি ও পাসওয়ার্ড সেট করুন'}
                        </span>
                        {t.isRoomPublished ? (
                          <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold">
                            প্রকাশিত
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-700 text-gray-300 px-1.5 py-0.2 rounded">
                            অপ্রকাশিত
                          </span>
                        )}
                      </button>

                      {/* Declare Winners Button */}
                      {t.status !== 'completed' && (
                        <button
                          onClick={() => handleOpenWinnerModal(t)}
                          disabled={t.joinedPlayers.length === 0}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                            t.joinedPlayers.length === 0
                              ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>বিজয়ী নির্বাচন ও প্রাইজ দিন</span>
                        </button>
                      )}

                      {t.status === 'completed' && (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-4 h-4" /> ফলাফল সমাপ্ত ও প্রাইজ দেওয়া হয়েছে
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USERS & TRANSACTION AUDIT */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    ইউজার প্রোফাইল ও ট্রানজেকশন হিস্ট্রি অডিট
                  </h3>
                  <p className="text-xs text-gray-400">
                    সকল রেজিস্টার্ড ইউজারের ব্যালেন্স, জেতা টাকা ও লেনদেন বিস্তারিত
                  </p>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="নাম, ইমেইল বা UID সার্চ"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Users Table / List */}
              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <div
                    key={u.id}
                    className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white">
                            {u.inGameName || u.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            UID: {u.ffUid || 'N/A'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 font-mono">
                          {u.email} • {u.phone || 'No phone'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-sm text-emerald-400 block">
                          ৳{u.balance}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          জিতেছেন: ৳{u.totalWon || 0}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedUserForAudit(u)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        হিস্ট্রি ও এডজাস্ট
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & BRANDING */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-white">
                  অ্যাপ কনফিগারেশন, ব্র্যান্ডিং ও সিকিউরিটি
                </h3>
                <p className="text-xs text-gray-400">
                  অ্যাপের নাম, লোগো, এড মানি নাম্বার ও এডমিন মাস্টার পাসওয়ার্ড পরিবর্তন করুন
                </p>
              </div>

              {/* Master Password Setting as requested */}
              <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-800/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <KeyRound className="w-4 h-4" />
                  <span>এডমিন মাস্টার পাসওয়ার্ড সেট/পরিবর্তন করুন</span>
                </div>
                <input
                  type="text"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder={`নতুন পাসওয়ার্ড দিন (বর্তমান: ${config.adminPassword || '271030'})`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-gray-400">
                  * পরিবর্তন না করতে চাইলে খালি রাখুন। এটি দিয়ে সিকিউরিটি গেট আনলক হবে।
                </p>
              </div>

              {/* App Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  টুর্নামেন্ট অ্যাপের নাম *
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold"
                />
              </div>

              {/* App Logo with Direct Device Gallery Upload & Live Preview */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      অ্যাপের লোগো (App Logo)
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      সরাসরি আপনার মোবাইল বা কম্পিউটারের গ্যালারি থেকে ছবি আপলোড করুন
                    </p>
                  </div>

                  {/* Live Logo Preview */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-500/50 p-0.5 shrink-0 shadow-md flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-xl">⚡</span>
                    )}
                  </div>
                </div>

                {/* Direct Gallery File Upload Button */}
                <div>
                  <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-[0.98]">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>গ্যালারি থেকে লোগো সিলেক্ট করুন (Choose from Gallery)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => processGalleryImage(e, (dataUrl) => setLogoUrl(dataUrl), 400, 400)}
                    />
                  </label>
                </div>

                {/* Or paste link */}
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">
                    অথবা সরাসরি ছবির লিঙ্ক দিতে চাইলে:
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://... বা গ্যালারি থেকে ছবি দিন"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-gray-300 font-mono"
                  />
                </div>

                {/* One-click Esports Presets */}
                <div>
                  <span className="block text-[10px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">
                    অথবা তৈরি প্রিসেট থেকে বেছে নিন:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { name: 'টাইগার ম্যাসকট', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80' },
                      { name: 'ফায়ার স্কোয়াড', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80' },
                      { name: 'সাইবার ওল্ফ', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&auto=format&fit=crop&q=80' },
                      { name: 'গোল্ডেন স্কাল', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80' },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => { setLogoUrl(preset.url); showToast(`${preset.name} লোগো সিলেক্ট হয়েছে!`); }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-[10px] font-semibold text-gray-300 whitespace-nowrap flex items-center gap-1 transition-colors"
                      >
                        <span>🎮</span>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Money Numbers (bKash & Nagad) as requested */}
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-amber-400">
                  এড মানি পেমেন্ট নাম্বার কনফিগারেশন:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-pink-400 mb-1">
                      বিকাশ পার্সোনাল নাম্বার (Send Money) *
                    </label>
                    <input
                      type="tel"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-orange-400 mb-1">
                      নগদ পার্সোনাল নাম্বার (Send Money) *
                    </label>
                    <input
                      type="tel"
                      value={nagadNumber}
                      onChange={(e) => setNagadNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Notice Bar Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  হোম স্ক্রিন নোটিশ বার টেক্সট
                </label>
                <input
                  type="text"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Support Telegram Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    টেলিগ্রাম সাপোর্ট গ্রুপ/চ্যানেল লিংক
                  </label>
                  <input
                    type="text"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    কাস্টমার সাপোর্ট ফোন নাম্বার
                  </label>
                  <input
                    type="tel"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Category Mode Images Customization (Direct Gallery Upload with object-cover fitting) */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white">
                    মোড ও ক্যাটাগরি ছবি পরিবর্তন (Direct Gallery Upload)
                  </h4>
                </div>
                <p className="text-[11px] text-gray-400">
                  হোম স্ক্রিনে প্রদর্শিত ৬টি গেম মোডের ছবি সরাসরি ফোনের গ্যালারি থেকে সিলেক্ট করুন। ছবি অটো-ফিট হয়ে সুন্দরভাবে থাকবে, কোনো প্রকার distortion বা নষ্ট হবে না।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'BR MATCH',
                    'BR SURVIVAL',
                    'Clash Squad',
                    'CS 2 VS 2',
                    'Lone Wolf 2v2',
                    'Lone Wolf 1 Vs 1',
                  ].map((catName) => (
                    <div key={catName} className="p-3 bg-slate-900 rounded-xl border border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 font-mono">
                          {catName}
                        </span>
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                          <img
                            src={categoryImages[catName] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80'}
                            alt={catName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer flex-1 py-1.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all">
                          <Upload className="w-3 h-3" />
                          <span>গ্যালারি থেকে ছবি দিন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => processGalleryImage(e, (dataUrl) => {
                              setCategoryImages(prev => ({ ...prev, [catName]: dataUrl }));
                            }, 600, 400)}
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        value={categoryImages[catName] || ''}
                        onChange={(e) => setCategoryImages(prev => ({ ...prev, [catName]: e.target.value }))}
                        placeholder="বা ছবির URL দিন"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-gray-300 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable Rules Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  টুর্নামেন্টের সকল নিয়মাবলী (প্রতি লাইনে একটি করে নিয়ম লিখুন)
                </label>
                <textarea
                  rows={6}
                  value={rulesInput}
                  onChange={(e) => setRulesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white leading-relaxed font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                সকল সেটিংস সেভ করুন
              </button>
            </form>
          )}

          {/* TAB 7: AI ASSISTANT (AI সহকারী - তাৎক্ষণিক টুর্নামেন্ট, নোটিশ ও রুলস মেকার) */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-4">
              {/* AI Co-Pilot Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                          <span>S1 TENDO PRO • AI সহকারী</span>
                        </h3>
                        <span className="text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                          GEMINI 3.8 FLASH
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-0.5">
                        আপনি বাংলায় যা করতে বলবেন, AI তা তৈরি করে মুহূর্তের মধ্যে অ্যাপে যুক্ত করে দেবে!
                      </p>
                    </div>
                  </div>

                  {/* Auto Apply Toggle */}
                  <div className="flex items-center gap-2 bg-slate-950/70 border border-purple-500/30 px-3 py-1.5 rounded-xl self-stretch sm:self-auto justify-between">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-gray-200 block">
                        ⚡ সরাসরি অটো-এড (Auto Apply)
                      </span>
                      <span className="text-[9px] text-gray-400 block">
                        {autoApplyAi ? 'তৈরি হওয়ামাত্রই অ্যাপে লাইভ হবে' : 'রিভিউ করে ম্যানুয়ালি এড করবেন'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoApplyAi}
                        onChange={(e) => setAutoApplyAi(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {/* Quick Prompts Carousel */}
                <div className="mt-4 pt-3 border-t border-purple-500/20">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-2">
                    ⚡ এক ক্লিকে কমান্ড দিন (ক্লিক করলেই AI তৈরি শুরু করবে):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      {
                        label: '🎁 রেফার অন করো',
                        prompt: 'এপে রেফার অন করো',
                      },
                      {
                        label: '💎 ডায়মন্ড শপ অন করো',
                        prompt: 'এপে ডায়মন্ড শপ অন করো',
                      },
                      {
                        label: '🎡 লাকি স্পিন অন করো',
                        prompt: 'এপে লাকি স্পিন অন করো',
                      },
                      {
                        label: '📱 বিকাশ ও নগদ নাম্বার সেট',
                        prompt: 'বিকাশ ও নগদ নাম্বার 01712345678 তে সেট করো',
                      },
                      {
                        label: '🎮 CS 6v6 টুর্নামেন্ট',
                        prompt: 'আজ রাত ৯টায় ৫০ টাকার নতুন CS 6v6 ক্যাশ টুর্নামেন্ট বানিয়ে অ্যাপে এড করো',
                      },
                      {
                        label: '🏆 BR Booyah টুর্নামেন্ট',
                        prompt: 'আজ রাত ১০টায় ১০০ টাকার মেগা BR Booyah টুর্নামেন্ট তৈরি করো, উইন প্রাইজ ১০০০ টাকা ও পার কিল ২০ টাকা',
                      },
                      {
                        label: '🐺 Lone Wolf 1v1 ম্যাচ',
                        prompt: 'আজ রাত ৮টায় ২৫ টাকার Lone Wolf 1v1 ফাস্ট ক্যাশ ম্যাচ বানিয়ে অ্যাপে যুক্ত করো',
                      },
                      {
                        label: '📢 স্পেশাল নোটিশ বার',
                        prompt: 'অ্যাপের নোটিশ বারে আকর্ষণীয় ভাষায় লিখে দাও যে আজ রাতের টুর্নামেন্টে জয়েন করলে বিশেষ বোনাস রয়েছে',
                      },
                      {
                        label: '🚫 অ্যান্টি-চিট নতুন নিয়ম',
                        prompt: 'হ্যাকার, স্ক্রিপ্ট ও এমুলেটর সম্পূর্ণ নিষিদ্ধ করার জন্য টুর্নামেন্ট নীতিমালায় নতুন কঠোর নিয়ম যুক্ত করো',
                      },
                      {
                        label: '🔑 রুম আইডি ও পাসওয়ার্ড',
                        prompt: 'ফ্রি ফায়ার কাস্টম ম্যাচের জন্য একটি নতুন রুম আইডি ও ৪ সংখ্যার পাসওয়ার্ড তৈরি করো',
                      },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendAiPrompt(item.prompt)}
                        disabled={isAiLoading}
                        className="px-3 py-1.5 bg-slate-900/90 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 rounded-xl text-xs text-gray-200 whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <Wand2 className="w-3 h-3 text-amber-300" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat & Generation Log */}
              <div className="space-y-3 min-h-[300px] max-h-[460px] overflow-y-auto p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      {msg.sender === 'ai' ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[9px] text-white font-bold">
                            AI
                          </div>
                          <span className="text-[10px] font-bold text-purple-400">S1 TENDO কো-পাইলট</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">আপনি (এডমিন)</span>
                      )}
                      <span className="text-[9px] text-gray-500">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-purple-500/30 text-gray-200 rounded-tl-none space-y-3'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Render Interactive Action Card if AI prepared an asset */}
                      {msg.action && msg.action.actionType === 'CREATE_TOURNAMENT' && msg.action.tournamentData && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" />
                              টুর্নামেন্ট প্রিভিউ
                            </span>
                            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                              {msg.action.tournamentData.category} • {msg.action.tournamentData.matchType}
                            </span>
                          </div>

                          <div className="flex gap-2.5 items-center">
                            {msg.action.tournamentData.bannerImage && (
                              <img
                                src={msg.action.tournamentData.bannerImage}
                                alt="Banner"
                                className="w-16 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                              />
                            )}
                            <div>
                              <h5 className="font-extrabold text-white text-xs">
                                {msg.action.tournamentData.title}
                              </h5>
                              <p className="text-[10px] text-gray-400">
                                শিডিউল: {msg.action.tournamentData.schedule} • ম্যাপ: {msg.action.tournamentData.map}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-900 rounded-lg text-center font-mono">
                            <div>
                              <span className="text-[9px] text-gray-400 block">এন্ট্রি ফি</span>
                              <span className="text-xs font-bold text-white">৳{msg.action.tournamentData.entryFee}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-emerald-400 block">উইন প্রাইজ</span>
                              <span className="text-xs font-bold text-emerald-300">৳{msg.action.tournamentData.winPrize}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-amber-400 block">পার কিল</span>
                              <span className="text-xs font-bold text-amber-300">৳{msg.action.tournamentData.perKillPrize}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 block">মোট স্লট</span>
                              <span className="text-xs font-bold text-gray-200">{msg.action.tournamentData.totalSlots}</span>
                            </div>
                          </div>

                          {msg.applied ? (
                            <div className="w-full py-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCheck className="w-4 h-4 text-emerald-400" />
                              <span>অ্যাপে সফলভাবে যুক্ত ও লাইভ হয়েছে!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => executeAiAction(msg)}
                              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                            >
                              <Zap className="w-4 h-4 text-amber-300" />
                              <span>⚡ অ্যাপে অবিলম্বে যুক্ত করুন (Apply Now)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render Interactive Notice Update Card */}
                      {msg.action && msg.action.actionType === 'UPDATE_NOTICE' && msg.action.noticeText && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                          <span className="text-[11px] font-bold text-amber-400 block">
                            📢 নোটিশ বার টেক্সট:
                          </span>
                          <p className="p-2 bg-slate-950/80 rounded-lg text-xs font-semibold text-gray-200 border border-slate-800">
                            {msg.action.noticeText}
                          </p>
                          {msg.applied ? (
                            <div className="w-full py-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>নোটিশ বার আপডেট করা হয়েছে!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => executeAiAction(msg)}
                              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>নোটিশ বারে এখনই সেট করুন</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render Interactive Rule Addition Card */}
                      {msg.action && msg.action.actionType === 'ADD_RULE' && msg.action.ruleText && (
                        <div className="mt-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                          <span className="text-[11px] font-bold text-rose-300 block">
                            📜 নতুন অ্যান্টি-চিট নিয়ম:
                          </span>
                          <p className="p-2 bg-slate-950/80 rounded-lg text-xs text-gray-200 border border-slate-800">
                            {msg.action.ruleText}
                          </p>
                          {msg.applied ? (
                            <div className="w-full py-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>নিয়মাবলীতে সফলভাবে যুক্ত হয়েছে!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => executeAiAction(msg)}
                              className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>নীতিমালায় এখনই যুক্ত করুন</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render Room Info Card */}
                      {msg.action && msg.action.actionType === 'GENERATE_ROOM' && msg.action.roomId && (
                        <div className="mt-2 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/40 space-y-2">
                          <span className="text-[11px] font-bold text-indigo-300 block">
                            🔑 তৈরি করা ফ্রি ফায়ার রুম ডিটেইলস:
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-center font-mono">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                              <span className="text-[9px] text-gray-400 block">ROOM ID</span>
                              <span className="text-sm font-bold text-amber-400">{msg.action.roomId}</span>
                            </div>
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                              <span className="text-[9px] text-gray-400 block">PASSWORD</span>
                              <span className="text-sm font-bold text-emerald-400">{msg.action.roomPassword}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Room ID: ${msg.action?.roomId} | Password: ${msg.action?.roomPassword}`);
                              setCopiedActionId(msg.id);
                              setTimeout(() => setCopiedActionId(null), 2000);
                              showToast('রুম আইডি ও পাসওয়ার্ড কপি করা হয়েছে!');
                            }}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            {copiedActionId === msg.id ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>কপি সম্পন্ন!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>আইডি ও পাসওয়ার্ড কপি করুন</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Render Interactive Feature Toggle Card */}
                      {msg.action && msg.action.actionType === 'TOGGLE_FEATURE' && msg.action.featureKey && (
                        <div className="mt-2 p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              ফিচার কনফিগারেশন
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              msg.action.featureEnabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {msg.action.featureEnabled !== false ? 'অন (ACTIVE)' : 'অফ (DISABLED)'}
                            </span>
                          </div>

                          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {msg.action.featureKey === 'referAndEarn' ? (
                                <Gift className="w-5 h-5 text-orange-400" />
                              ) : msg.action.featureKey === 'shopTopUp' ? (
                                <Gem className="w-5 h-5 text-cyan-400" />
                              ) : (
                                <Sparkles className="w-5 h-5 text-purple-400" />
                              )}
                              <div>
                                <span className="text-xs font-bold text-white block">
                                  {msg.action.featureKey === 'referAndEarn' ? 'রেফার ও আয় (Refer & Earn)' :
                                   msg.action.featureKey === 'shopTopUp' ? 'ডায়মন্ড টপ-আপ শপ (Top-Up Shop)' :
                                   msg.action.featureKey === 'luckySpin' ? 'ডেইলি লাকি স্পিন (Lucky Spin)' :
                                   msg.action.featureKey === 'communityChat' ? 'কমিউনিটি চ্যাট (Live Chat)' :
                                   msg.action.featureKey === 'leaderboard' ? 'প্লেয়ার লিডারবোর্ড (Leaderboard)' : msg.action.featureKey}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  অ্যাপে ব্যবহারকারীদের জন্য {msg.action.featureEnabled !== false ? 'উপলব্ধ ও কার্যকর হবে' : 'লুকিয়ে ফেলা হবে'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {msg.applied ? (
                            <div className="w-full py-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCheck className="w-4 h-4 text-emerald-400" />
                              <span>অ্যাপে সফলভাবে প্রয়োগ করা হয়েছে!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => executeAiAction(msg)}
                              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                            >
                              <Zap className="w-4 h-4 text-amber-300" />
                              <span>⚡ অ্যাপে এখনই চালু/বন্ধ করুন (Apply Now)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render Interactive Config Update Card */}
                      {msg.action && msg.action.actionType === 'UPDATE_CONFIG' && msg.action.configUpdate && (
                        <div className="mt-2 p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-2.5">
                          <span className="text-[11px] font-bold text-blue-300 block">
                            ⚙️ অ্যাপ কনফিগারেশন পরিবর্তন:
                          </span>
                          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                            {msg.action.configUpdate.bkashNumber && (
                              <p className="text-pink-300">বিকাশ: {msg.action.configUpdate.bkashNumber}</p>
                            )}
                            {msg.action.configUpdate.nagadNumber && (
                              <p className="text-orange-300">নগদ: {msg.action.configUpdate.nagadNumber}</p>
                            )}
                            {msg.action.configUpdate.noticeText && (
                              <p className="text-amber-300 font-sans">নোটিশ: {msg.action.configUpdate.noticeText}</p>
                            )}
                          </div>
                          {msg.applied ? (
                            <div className="w-full py-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCheck className="w-4 h-4 text-emerald-400" />
                              <span>কনফিগারেশন আপডেট সফলভাবে প্রয়োগ হয়েছে!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => executeAiAction(msg)}
                              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                              <Zap className="w-4 h-4 text-amber-300" />
                              <span>⚡ এখনই আপডেট প্রয়োগ করুন (Apply Now)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex items-center gap-2 p-3 bg-purple-950/30 rounded-2xl border border-purple-500/30 text-purple-300 text-xs animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI আপনার নির্দেশনা প্রসেস করে টুর্নামেন্ট ও কনফিগারেশন তৈরি করছে...</span>
                  </div>
                )}
              </div>

              {/* Prompt Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiPrompt();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="AI কে বাংলায় নির্দেশ দিন... যেমন: 'আজ রাত ৯টায় ৪০ টাকার ডুও ম্যাচ এড করো'"
                  disabled={isAiLoading}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-purple-500/40 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 shadow-inner"
                />

                <button
                  type="submit"
                  disabled={!aiInput.trim() || isAiLoading}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 disabled:opacity-40 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">তৈরি করুন</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>

      {/* MODAL 1: Create or Edit Tournament */}
      <AnimatePresence>
        {showTournamentModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm">
                  {editingTournamentId ? 'টুর্নামেন্ট সম্পাদনা' : 'নতুন টুর্নামেন্ট যুক্ত করুন'}
                </h3>
                <button onClick={() => setShowTournamentModal(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveTournament} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">টুর্নামেন্টের নাম / টাইটেল *</label>
                  <input
                    type="text"
                    value={tTitle}
                    onChange={(e) => setTTitle(e.target.value)}
                    required
                    placeholder="যেমন: Duo Time | Mobile | Regular"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-gray-300 mb-1">ক্যাটাগরি *</label>
                    <select
                      value={tCategory}
                      onChange={(e) => setTCategory(e.target.value as MatchCategory)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="BR MATCH">BR MATCH</option>
                      <option value="BR SURVIVAL">BR SURVIVAL</option>
                      <option value="Clash Squad">Clash Squad</option>
                      <option value="CS 2 VS 2">CS 2 VS 2</option>
                      <option value="Lone Wolf 2v2">Lone Wolf 2v2</option>
                      <option value="Lone Wolf 1 Vs 1">Lone Wolf 1 Vs 1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">ম্যাচ টাইপ *</label>
                    <select
                      value={tMatchType}
                      onChange={(e) => setTMatchType(e.target.value as MatchType)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Duo">Duo</option>
                      <option value="Squad">Squad</option>
                      <option value="6v6">6v6</option>
                      <option value="1v1">1v1</option>
                      <option value="2v2">2v2</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-300 mb-1">এন্ট্রি ফি (TK) *</label>
                    <input
                      type="number"
                      value={tEntryFee}
                      onChange={(e) => setTEntryFee(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">উইন প্রাইজ (TK) *</label>
                    <input
                      type="number"
                      value={tWinPrize}
                      onChange={(e) => setTWinPrize(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">পার কিল (TK)</label>
                    <input
                      type="number"
                      value={tPerKill}
                      onChange={(e) => setTPerKill(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-300 mb-1">ম্যাপ *</label>
                    <select
                      value={tMap}
                      onChange={(e) => setTMap(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="Bermuda">Bermuda</option>
                      <option value="Purgatory">Purgatory</option>
                      <option value="Kalahari">Kalahari</option>
                      <option value="Alpine">Alpine</option>
                      <option value="Nexterra">Nexterra</option>
                      <option value="Iron Cage">Iron Cage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">মোট স্লট *</label>
                    <input
                      type="number"
                      value={tTotalSlots}
                      onChange={(e) => setTTotalSlots(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">ম্যাচ শিডিউল *</label>
                    <input
                      type="text"
                      value={tSchedule}
                      onChange={(e) => setTSchedule(e.target.value)}
                      placeholder="যেমন: আজ রাত ১০:০০ PM"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                {/* Tournament Banner Photo with Direct Gallery Upload */}
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-gray-200 font-bold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        টুর্নামেন্টের ব্যানার ছবি (Tournament Photo)
                      </span>
                      <p className="text-[10px] text-gray-400">
                        আপনার ফোন বা ডিভাইসের গ্যালারি থেকে যেকোনো ছবি সরাসরি আপলোড করুন
                      </p>
                    </div>

                    {/* Live Preview */}
                    <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-900 border border-amber-500/40 shrink-0">
                      {tBanner ? (
                        <img src={tBanner} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-500 flex items-center justify-center h-full">No image</span>
                      )}
                    </div>
                  </div>

                  {/* Direct Gallery Upload Button */}
                  <div>
                    <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-[0.98]">
                      <Upload className="w-4 h-4" />
                      <span>গ্যালারি থেকে ছবি আপলোড করুন (Upload from Gallery)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => processGalleryImage(e, (dataUrl) => setTBanner(dataUrl), 800, 500)}
                      />
                    </label>
                  </div>

                  {/* Or enter URL */}
                  <div>
                    <input
                      type="url"
                      value={tBanner}
                      onChange={(e) => setTBanner(e.target.value)}
                      placeholder="অথবা ছবির লিংক পেস্ট করুন..."
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-gray-300 font-mono"
                    />
                  </div>

                  {/* Preset Free Fire Banner Options */}
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {[
                      { label: 'BR Bermuda', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Solo Booyah', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Clash Squad', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80' },
                      { label: 'Lone Wolf', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80' },
                    ].map(preset => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => { setTBanner(preset.url); showToast(`${preset.label} ছবি সেট হয়েছে!`); }}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-semibold text-gray-300 whitespace-nowrap"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">ম্যাচ স্পেশাল রুলস</label>
                  <input
                    type="text"
                    value={tRules}
                    onChange={(e) => setTRules(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2"
                >
                  {editingTournamentId ? 'টুর্নামেন্ট আপডেট করুন' : 'টুর্নামেন্ট প্রকাশ করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Room ID & Password Setting */}
      <AnimatePresence>
        {roomModalTournament && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="font-bold text-sm">রুম আইডি ও পাসওয়ার্ড নির্ধারণ</h3>
                </div>
                <button onClick={() => setRoomModalTournament(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-xs text-gray-400">
                {roomModalTournament.title}
              </p>

              <form onSubmit={handleSaveRoomDetails} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 font-bold">Room ID *</label>
                  <input
                    type="text"
                    value={mRoomId}
                    onChange={(e) => setMRoomId(e.target.value)}
                    required
                    placeholder="যেমন: 8947291"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-bold">Room Password *</label>
                  <input
                    type="text"
                    value={mRoomPass}
                    onChange={(e) => setMRoomPass(e.target.value)}
                    required
                    placeholder="যেমন: 1234"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white"
                  />
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-gray-300">
                    খেলোয়াড়দের জন্য উন্মুক্ত করুন
                  </span>
                  <input
                    type="checkbox"
                    checked={mPublish}
                    onChange={(e) => setMPublish(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </div>

                <p className="text-[10px] text-amber-300/80">
                  * শুধুমাত্র যারা এই টুর্নামেন্টের স্লট কিনেছে তারাই এই রুম আইডি ও পাসওয়ার্ড দেখতে পাবে।
                </p>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  রুম তথ্য সেভ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Winner Declaration */}
      <AnimatePresence>
        {winnerModalTournament && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 text-white max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Trophy className="w-5 h-5" />
                  <h3 className="font-bold text-sm">বিজয়ী নির্বাচন ও প্রাইজমানি ডিস্ট্রিবিউট</h3>
                </div>
                <button onClick={() => setWinnerModalTournament(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-xs text-gray-300">
                টুর্নামেন্ট: <strong className="text-white">{winnerModalTournament.title}</strong>
              </p>

              <form onSubmit={handleSaveWinners} className="space-y-3.5 text-xs">
                {/* 1st Place */}
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-amber-400 font-bold">
                    <span>🥇 ১ম স্থান (1st Place)</span>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">প্লেয়ার সিলেক্ট করুন:</label>
                    <select
                      value={w1stPlayer}
                      onChange={(e) => setW1stPlayer(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {winnerModalTournament.joinedPlayers.map(p => (
                        <option key={p.userId} value={p.userId}>
                          {p.inGameName} (UID: {p.ffUid}) - স্লট #{p.slotNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-400">কিল সংখ্যা:</label>
                      <input
                        type="number"
                        value={w1stKills}
                        onChange={(e) => setW1stKills(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400">প্রাইজমানি (TK):</label>
                      <input
                        type="number"
                        value={w1stPrize}
                        onChange={(e) => setW1stPrize(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2nd Place */}
                <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-2">
                  <div className="text-gray-300 font-bold">
                    <span>🥈 ২য় স্থান (2nd Place) - ঐচ্ছিক</span>
                  </div>
                  <select
                    value={w2ndPlayer}
                    onChange={(e) => setW2ndPlayer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="">প্রয়োজন না হলে ফাঁকা রাখুন</option>
                    {winnerModalTournament.joinedPlayers.map(p => (
                      <option key={p.userId} value={p.userId}>
                        {p.inGameName} (UID: {p.ffUid}) - স্লট #{p.slotNumber}
                      </option>
                    ))}
                  </select>
                  {w2ndPlayer && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-400">কিল:</label>
                        <input
                          type="number"
                          value={w2ndKills}
                          onChange={(e) => setW2ndKills(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400">প্রাইজ (TK):</label>
                        <input
                          type="number"
                          value={w2ndPrize}
                          onChange={(e) => setW2ndPrize(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-bold font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3rd Place */}
                <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-2xl space-y-2">
                  <div className="text-gray-300 font-bold">
                    <span>🥉 ৩য় স্থান (3rd Place) - ঐচ্ছিক</span>
                  </div>
                  <select
                    value={w3rdPlayer}
                    onChange={(e) => setW3rdPlayer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="">প্রয়োজন না হলে ফাঁকা রাখুন</option>
                    {winnerModalTournament.joinedPlayers.map(p => (
                      <option key={p.userId} value={p.userId}>
                        {p.inGameName} (UID: {p.ffUid}) - স্লট #{p.slotNumber}
                      </option>
                    ))}
                  </select>
                  {w3rdPlayer && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-400">কিল:</label>
                        <input
                          type="number"
                          value={w3rdKills}
                          onChange={(e) => setW3rdKills(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400">প্রাইজ (TK):</label>
                        <input
                          type="number"
                          value={w3rdPrize}
                          onChange={(e) => setW3rdPrize(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-bold font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-emerald-950/40 rounded-xl text-[11px] text-emerald-300 border border-emerald-800">
                  ⚡ সাবমিট করার সাথে সাথে বিজয়ীদের একাউন্ট ব্যালেন্সে টাকা যুক্ত হবে এবং ম্যাচটি সমাপ্ত হিসেবে রেজাল্ট ট্যাবে চলে যাবে।
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold rounded-xl shadow-md text-xs uppercase tracking-wider"
                >
                  কনফার্ম বিজয়ী ঘোষণা ও প্রাইজ ক্রেডিট
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: User Profile & Transaction Ledger Audit */}
      <AnimatePresence>
        {selectedUserForAudit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 text-white max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm">ইউজার অডিট ও ট্রানজেকশন খতিয়ান</h3>
                </div>
                <button onClick={() => setSelectedUserForAudit(null)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* User Overview */}
              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {selectedUserForAudit.name} ({selectedUserForAudit.inGameName})
                  </h4>
                  <p className="text-gray-300 font-mono mt-0.5">
                    {selectedUserForAudit.email} • FF UID: {selectedUserForAudit.ffUid}
                  </p>
                  <p className="text-gray-400 font-mono mt-0.5">
                    মোবাইল: {selectedUserForAudit.phone || 'N/A'} • জয়েন করেছেন: {selectedUserForAudit.matchesJoined} টি ম্যাচ
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">বর্তমান ব্যালেন্স</span>
                  <span className="font-mono font-black text-xl text-emerald-400">
                    ৳{selectedUserForAudit.balance}
                  </span>
                  <span className="text-[10px] text-amber-400 block font-mono">
                    মোট জয়: ৳{selectedUserForAudit.totalWon || 0}
                  </span>
                </div>
              </div>

              {/* Adjust Balance Form */}
              <form onSubmit={handleAdjustBalance} className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <h5 className="font-bold text-gray-300">এডমিন ম্যানুয়াল ব্যালেন্স অ্যাডজাস্ট (+ বা - ৳)</h5>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={balanceAdjustAmount}
                    onChange={(e) => setBalanceAdjustAmount(e.target.value)}
                    placeholder="টাকার পরিমাণ (যেমন: +50 বা -20)"
                    required
                    className="w-36 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                  <input
                    type="text"
                    value={balanceAdjustReason}
                    onChange={(e) => setBalanceAdjustReason(e.target.value)}
                    placeholder="কারণ"
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                  >
                    আপডেট
                  </button>
                </div>
              </form>

              {/* Full Transaction History */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                  এই ইউজারের সম্পূর্ণ ট্রানজেকশন হিস্ট্রি ({transactions.filter(t => t.userEmail === selectedUserForAudit.email).length})
                </h5>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {transactions
                    .filter(t => t.userEmail.toLowerCase().trim() === selectedUserForAudit.email.toLowerCase().trim())
                    .map(tx => (
                      <div
                        key={tx.id}
                        className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-gray-200">
                            {tx.type} {tx.method ? `(${tx.method})` : ''}
                          </span>
                          <p className="text-[10px] text-gray-400">
                            {tx.trxId ? `TrxID: ${tx.trxId}` : tx.tournamentTitle || tx.note} • {tx.createdAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-white">
                            ৳{tx.amount}
                          </span>
                          <span className={`block text-[10px] font-bold ${
                            tx.status === 'completed' ? 'text-emerald-400' : tx.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
