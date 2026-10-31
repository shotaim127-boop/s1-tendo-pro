import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI client initialization
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for smart tournament & rule creation if API key is pending
function generateFallbackAiResponse(prompt: string, context: any) {
  const p = prompt.toLowerCase();
  
  // 0. Direct Add Money to User by Email Command (e.g. shotaim127@gmail.com এ ৫০০ টাকা এড করো)
  const emailMatch = prompt.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch && (p.includes('টাকা') || p.includes('এড') || p.includes('add') || p.includes('পাঠা') || p.includes('সেন্ড') || p.includes('ক্যাশ') || p.includes('bal') || p.includes('ক্রেডিট') || p.includes('bdt') || p.includes('tk'))) {
    const targetEmail = emailMatch[0].toLowerCase().trim();
    const numbersInPrompt = prompt.match(/\d+/g);
    let amount = 100;
    if (numbersInPrompt && numbersInPrompt.length > 0) {
      amount = parseInt(numbersInPrompt[0], 10);
    }
    return {
      success: true,
      data: {
        message: `💰 ${targetEmail} অ্যাকাউন্টে ৳${amount} এড মানি ব্যালেন্স পাঠানোর প্রস্তুত। কনফার্ম করলেই ব্যালেন্স জমা হবে!`,
        actionType: 'ADD_MONEY_TO_USER',
        targetEmail,
        amount,
      },
    };
  }
  
  // Feature toggles
  if (p.includes('রেফার') || p.includes('refer') || p.includes('referral')) {
    const isOff = p.includes('অফ') || p.includes('off') || p.includes('বন্ধ') || p.includes('disable');
    return {
      success: true,
      data: {
        message: isOff 
          ? '🚫 রেফার অ্যান্ড আর্ন (Refer & Earn) ফিচারটি অ্যাপে বন্ধ (OFF) করা হয়েছে।'
          : '🎉 রেফার অ্যান্ড আর্ন (Refer & Earn) ফিচারটি অ্যাপে অন (ON) করা হয়েছে! প্লেয়াররা এখন তাদের পার্সোনাল রেফার কোড বন্ধুদের শেয়ার করে প্রতি রেফারে ৳১০ ক্যাশ ইনকাম করতে পারবে।',
        actionType: 'TOGGLE_FEATURE',
        featureKey: 'referAndEarn',
        featureEnabled: !isOff,
        featureData: { referralBonus: 10 },
      },
    };
  }

  if (p.includes('শপ') || p.includes('shop') || p.includes('টপ আপ') || p.includes('টপআপ') || p.includes('topup') || p.includes('diamond') || p.includes('ডায়মন্ড')) {
    const isOff = p.includes('অফ') || p.includes('off') || p.includes('বন্ধ') || p.includes('disable');
    return {
      success: true,
      data: {
        message: isOff
          ? '🚫 ডায়মন্ড টপ-আপ শপ ফিচারটি সাময়িকভাবে বন্ধ (OFF) করা হয়েছে।'
          : '💎 ফ্রি ফায়ার ডায়মন্ড টপ-আপ শপ (Top-Up Shop) ফিচারটি অ্যাপে সফলভাবে লাইভ করা হয়েছে! প্লেয়াররা এখন ওয়ালেট দিয়ে সরাসরি ডায়মন্ড কিনতে পারবে।',
        actionType: 'TOGGLE_FEATURE',
        featureKey: 'shopTopUp',
        featureEnabled: !isOff,
      },
    };
  }

  if (p.includes('স্পিন') || p.includes('spin') || p.includes('লাকি')) {
    const isOff = p.includes('অফ') || p.includes('off') || p.includes('বন্ধ') || p.includes('disable');
    return {
      success: true,
      data: {
        message: isOff
          ? '🚫 ডেইলি লাকি স্পিন ফিচারটি বন্ধ করা হয়েছে।'
          : '🎡 ডেইলি লাকি স্পিন (Lucky Spin) ফিচারটি অন করা হয়েছে! প্লেয়াররা প্রতিদিন ১ বার বিনামূল্যে স্পিন করে ক্যাশ জিততে পারবে।',
        actionType: 'TOGGLE_FEATURE',
        featureKey: 'luckySpin',
        featureEnabled: !isOff,
      },
    };
  }

  if (p.includes('চ্যাট') || p.includes('chat') || p.includes('কমিউনিটি')) {
    const isOff = p.includes('অফ') || p.includes('off') || p.includes('বন্ধ');
    return {
      success: true,
      data: {
        message: isOff
          ? '🚫 কমিউনিটি চ্যাট ফিচারটি বন্ধ করা হয়েছে।'
          : '💬 প্লেয়ার লাইভ কমিউনিটি চ্যাট ও ডিসকাশন ফিচারটি অন করা হয়েছে!',
        actionType: 'TOGGLE_FEATURE',
        featureKey: 'communityChat',
        featureEnabled: !isOff,
      },
    };
  }

  if (p.includes('লিডারবোর্ড') || p.includes('leaderboard') || p.includes('সেরা খেলোয়াড়')) {
    const isOff = p.includes('অফ') || p.includes('off') || p.includes('বন্ধ');
    return {
      success: true,
      data: {
        message: isOff
          ? '🚫 লিডারবোর্ড ফিচারটি বন্ধ করা হয়েছে।'
          : '🏆 সেরা প্লেয়ারদের লিডারবোর্ড ও চ্যাম্পিয়ন তালিকা অন করা হয়েছে!',
        actionType: 'TOGGLE_FEATURE',
        featureKey: 'leaderboard',
        featureEnabled: !isOff,
      },
    };
  }

  // Update phone numbers or config
  const bdPhoneMatch = prompt.match(/01[3-9]\d{8}/);
  if (bdPhoneMatch && (p.includes('বিকাশ') || p.includes('নগদ') || p.includes('নাম্বার') || p.includes('number'))) {
    const newNum = bdPhoneMatch[0];
    const isBkash = p.includes('বিকাশ') || p.includes('bkash');
    const isNagad = p.includes('নগদ') || p.includes('nagad');
    return {
      success: true,
      data: {
        message: `📱 পেমেন্ট নাম্বার সফলভাবে পরিবর্তন করা হয়েছে: ${newNum}`,
        actionType: 'UPDATE_CONFIG',
        configUpdate: {
          ...(isBkash ? { bkashNumber: newNum } : {}),
          ...(isNagad ? { nagadNumber: newNum } : {}),
          ...(!isBkash && !isNagad ? { addMoneyNumber: newNum, bkashNumber: newNum, nagadNumber: newNum } : {}),
        },
      },
    };
  }

  if (p.includes('নোটিশ') || p.includes('notice') || p.includes('ঘোষণা')) {
    const text = '🔥 S1 TENDO PRO মেগা ধামাকা! আজ রাত ৯:০০ টায় স্পেশাল ৫০ টাকার CS 6v6 ক্যাশ টুর্নামেন্ট অনুষ্ঠিত হবে। দ্রুত স্লট বুকিং করুন!';
    return {
      success: true,
      data: {
        message: 'আমি আপনার অ্যাপের জন্য একটি চমৎকার নোটিশ তৈরি করেছি এবং সরাসরি প্রস্তুত করে দিয়েছি!',
        actionType: 'UPDATE_NOTICE',
        noticeText: text,
      },
    };
  }

  if (p.includes('নিয়ম') || p.includes('rule') || p.includes('হ্যাকার') || p.includes('এমুলেটর')) {
    const rule = '🚫 কঠোর অ্যান্টি-চিট নীতি: কোনো প্রকার হ্যাক, অটো-এম বা থার্ড-পার্টি টুল ব্যবহার করলে সরাসরি ব্যান ও জমা দেওয়া সমস্ত টাকা বাজেয়াপ্ত করা হবে।';
    return {
      success: true,
      data: {
        message: 'টুর্নামেন্টের ফেয়ার-প্লের জন্য নতুন অ্যান্টি-চিট নিয়ম তৈরি করা হয়েছে!',
        actionType: 'ADD_RULE',
        ruleText: rule,
      },
    };
  }

  if (p.includes('রুম') || p.includes('room') || p.includes('পাসওয়ার্ড') || p.includes('pass')) {
    const randomRoom = Math.floor(1000000 + Math.random() * 9000000).toString();
    const randomPass = Math.floor(1000 + Math.random() * 9000).toString();
    return {
      success: true,
      data: {
        message: `ফ্রি ফায়ার কাস্টম রুম আইডি ও পাসওয়ার্ড জেনারেট করা হয়েছে:\nরুম আইডি: ${randomRoom}\nপাসওয়ার্ড: ${randomPass}`,
        actionType: 'GENERATE_ROOM',
        roomId: randomRoom,
        roomPassword: randomPass,
      },
    };
  }

  // Default: Tournament creation
  const isCS = p.includes('cs') || p.includes('clash') || p.includes('ক্ল্যাশ');
  const isSquad = p.includes('squad') || p.includes('স্কোয়াড') || p.includes('4v4') || p.includes('6v6');
  const isDuo = p.includes('duo') || p.includes('ডুও');
  const isLoneWolf = p.includes('lone') || p.includes('উলফ') || p.includes('1v1');

  let category = 'BR MATCH';
  let matchType = 'Solo';
  let slots = 48;
  let entry = 20;
  let prize = 800;
  let kill = 10;
  let map = 'Bermuda';

  if (isCS) {
    category = 'CLASH SQUAD';
    matchType = 'Squad';
    slots = 12;
    entry = 50;
    prize = 500;
    kill = 0;
  } else if (isLoneWolf) {
    category = 'LONE WOLF 1v1';
    matchType = 'Solo';
    slots = 2;
    entry = 25;
    prize = 45;
    kill = 0;
    map = 'Iron Cage';
  } else if (isDuo) {
    matchType = 'Duo';
    slots = 24;
    entry = 30;
    prize = 650;
    kill = 15;
  }

  // Extract custom price or prize if mentioned
  const numbers = prompt.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    entry = parseInt(numbers[0], 10) || entry;
    if (numbers.length > 1) {
      prize = parseInt(numbers[1], 10) || prize;
    }
  }

  return {
    success: true,
    data: {
      message: `আপনার নির্দেশ অনুযায়ী "${isCS ? 'CS Clash Squad' : 'BR Battle Royale'}" টুর্নামেন্টের সম্পূর্ণ সেটআপ তৈরি করা হয়েছে। এক ক্লিকেই অ্যাপে যুক্ত করে দিন!`,
      actionType: 'CREATE_TOURNAMENT',
      tournamentData: {
        title: `${isCS ? 'CS 6v6' : 'BR Solo'} | AI Pro League [${entry} TK]`,
        category,
        matchType,
        entryFee: entry,
        winPrize: prize,
        perKillPrize: kill,
        map,
        schedule: 'আজ রাত ০৯:৩০ PM',
        totalSlots: slots,
        rules: '100% Mobile Only. Emulators are strictly prohibited. Record your gameplay for verification.',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      },
    },
  };
}

// AI Assistant endpoint for Admin Panel
app.post('/api/admin/ai', async (req, res) => {
  try {
    const { prompt, currentContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Refresh client if env var became available
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    if (!aiClient) {
      const fallback = generateFallbackAiResponse(prompt, currentContext);
      return res.json(fallback);
    }

    const systemInstruction = `You are the ultimate AI Co-Pilot for "S1 TENDO PRO" (Free Fire Esports tournament platform in Bangladesh).
The administrator will ask you in Bengali or English to create tournaments, write rules, craft notice texts, generate room info, or announce events.

You MUST respond strictly in JSON matching the schema.
Always provide a polite, natural Bengali message explaining what was prepared in 'message'.
Set actionType to one of:
- TOGGLE_FEATURE (when admin asks to add, enable, turn on/off features like Refer & Earn [referAndEarn], Diamond Shop [shopTopUp], Lucky Spin [luckySpin], Community Chat [communityChat], Leaderboard [leaderboard], Maintenance [maintenanceMode])
- UPDATE_CONFIG (when admin asks to change bkash/nagad number, support phone, telegram link, app name, etc.)
- CREATE_TOURNAMENT (when creating or adding a new tournament)
- UPDATE_NOTICE (when updating the live notice banner ticker)
- ADD_RULE (when adding anti-cheat or platform tournament rules)
- GENERATE_ROOM (when generating custom room credentials)
- NONE (pure Q&A or analysis)

For TOGGLE_FEATURE:
- featureKey: 'referAndEarn', 'shopTopUp', 'luckySpin', 'communityChat', 'leaderboard', or 'maintenanceMode'
- featureEnabled: boolean (true to add/enable, false to disable)

For CREATE_TOURNAMENT, include full tournamentData with realistic Free Fire esports parameters:
- title: catchy title in English/Bengali
- category: one of ["BR MATCH", "BR SURVIVAL", "CLASH SQUAD", "CS 2v2", "LONE WOLF 2v2", "LONE WOLF 1v1"]
- matchType: "Solo", "Duo", or "Squad"
- entryFee: number
- winPrize: number
- perKillPrize: number
- map: "Bermuda", "Purgatory", "Kalahari", "Alpine", "Nexterra", or "Iron Cage"
- schedule: e.g. "আজ রাত ১০:০০ PM"
- totalSlots: integer
- rules: clear Bengali rules
- bannerImage: working gaming banner image URL
`;

    const generatePromise = aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Admin Prompt: "${prompt}"\n\nCurrent System Context: ${JSON.stringify(currentContext || {})}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: 'Bengali explanation and response to the admin.',
            },
            actionType: {
              type: Type.STRING,
              description: 'One of ADD_MONEY_TO_USER, TOGGLE_FEATURE, UPDATE_CONFIG, CREATE_TOURNAMENT, UPDATE_NOTICE, ADD_RULE, GENERATE_ROOM, NONE.',
            },
            targetEmail: {
              type: Type.STRING,
              description: 'Target user email address to add money to.',
            },
            amount: {
              type: Type.NUMBER,
              description: 'Amount in BDT to add.',
            },
            featureKey: {
              type: Type.STRING,
              description: 'referAndEarn, shopTopUp, luckySpin, communityChat, leaderboard, maintenanceMode',
            },
            featureEnabled: {
              type: Type.BOOLEAN,
            },
            configUpdate: {
              type: Type.OBJECT,
              properties: {
                bkashNumber: { type: Type.STRING },
                nagadNumber: { type: Type.STRING },
                addMoneyNumber: { type: Type.STRING },
                noticeText: { type: Type.STRING },
                telegramLink: { type: Type.STRING },
                appName: { type: Type.STRING },
              },
            },
            tournamentData: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                matchType: { type: Type.STRING },
                entryFee: { type: Type.NUMBER },
                winPrize: { type: Type.NUMBER },
                perKillPrize: { type: Type.NUMBER },
                map: { type: Type.STRING },
                schedule: { type: Type.STRING },
                totalSlots: { type: Type.INTEGER },
                rules: { type: Type.STRING },
                bannerImage: { type: Type.STRING },
              },
            },
            noticeText: { type: Type.STRING },
            ruleText: { type: Type.STRING },
            roomId: { type: Type.STRING },
            roomPassword: { type: Type.STRING },
          },
          required: ['message', 'actionType'],
        },
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 4500)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error in /api/admin/ai:', err);
    const fallback = generateFallbackAiResponse(req.body?.prompt || '', req.body?.currentContext);
    return res.json(fallback);
  }
});

// Shared Server Database File Storage
const DB_FILE = path.resolve(__dirname, 'server_db.json');

function getDb(): {
  tournaments: any[];
  transactions: any[];
  users: any[];
  config: any;
} {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading server_db.json:', e);
  }
  return { tournaments: [], transactions: [], users: [], config: {} };
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing server_db.json:', e);
  }
}

// 1. Full state sync endpoint for all mobile devices & admin
app.get('/api/sync', (_req, res) => {
  const db = getDb();
  res.json({
    success: true,
    tournaments: db.tournaments || [],
    transactions: db.transactions || [],
    users: db.users || [],
    config: db.config || {},
  });
});

// 2. Add Money request from any user device
app.post('/api/transactions/request-add-money', (req, res) => {
  const { id, user, method, senderNumber, trxId, amount } = req.body;
  if (!user || !trxId || !amount) {
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }

  const db = getDb();
  const cleanTrx = String(trxId).toUpperCase().trim();
  const txId = id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const existingIndex = (db.transactions || []).findIndex((t: any) => t.id === txId || (t.trxId && t.trxId === cleanTrx && t.status === 'pending'));

  const newTx = {
    id: txId,
    userId: user.id || `u-${Date.now()}`,
    userEmail: user.email || 'user@gmail.com',
    userName: user.name || user.inGameName || 'Player',
    type: 'add_money',
    amount: Number(amount),
    status: 'pending',
    method: method || 'bKash',
    senderNumber: senderNumber || '',
    trxId: cleanTrx,
    note: 'এডমিন ভেরিফিকেশনের অপেক্ষায়',
    createdAt: new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }),
  };

  if (existingIndex >= 0) {
    db.transactions[existingIndex] = { ...db.transactions[existingIndex], ...newTx };
  } else {
    db.transactions = [newTx, ...(db.transactions || [])];
  }

  // Also ensure user exists in db.users
  const userIdx = (db.users || []).findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase());
  if (userIdx >= 0) {
    db.users[userIdx] = { ...db.users[userIdx], ...user };
  } else {
    db.users = [...(db.users || []), { ...user, balance: user.balance || 0 }];
  }

  saveDb(db);
  return res.json({ success: true, transaction: newTx });
});

// 3. Withdraw request from any user device
app.post('/api/transactions/request-withdraw', (req, res) => {
  const { id, user, method, receiverNumber, amount } = req.body;
  const db = getDb();
  const amt = Number(amount);

  // Deduct balance from user in server DB
  const userIdx = (db.users || []).findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase());
  if (userIdx >= 0) {
    if (db.users[userIdx].balance < amt) {
      return res.status(400).json({ success: false, message: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই।' });
    }
    db.users[userIdx].balance -= amt;
  }

  const txId = id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const existingIndex = (db.transactions || []).findIndex((t: any) => t.id === txId);

  const newTx = {
    id: txId,
    userId: user.id,
    userEmail: user.email,
    userName: user.name || user.inGameName || 'Player',
    type: 'withdraw',
    amount: amt,
    status: 'pending',
    method: method || 'bKash',
    receiverNumber: receiverNumber || '',
    note: 'এডমিন কর্তৃক প্রসেসিং হচ্ছে',
    createdAt: new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }),
  };

  if (existingIndex >= 0) {
    db.transactions[existingIndex] = { ...db.transactions[existingIndex], ...newTx };
  } else {
    db.transactions = [newTx, ...(db.transactions || [])];
  }

  saveDb(db);
  return res.json({ success: true, transaction: newTx });
});

// 4. Admin Approve Add Money
app.post('/api/transactions/approve-add-money', (req, res) => {
  const { transactionId } = req.body;
  const db = getDb();
  const tx = (db.transactions || []).find((t: any) => t.id === transactionId);
  if (!tx || tx.type !== 'add_money') {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  tx.status = 'completed';
  tx.adminNote = 'এডমিন কর্তৃক পেমেন্ট অনুমোদিত ও ব্যালেন্স যুক্ত হয়েছে';

  // Credit user by ID or trimmed email
  let user = (db.users || []).find((u: any) => 
    (tx.userId && u.id === tx.userId) || 
    (u.email && tx.userEmail && u.email.toLowerCase().trim() === tx.userEmail.toLowerCase().trim())
  );
  if (user) {
    user.balance = (user.balance || 0) + tx.amount;
  } else {
    user = {
      id: tx.userId || `u-${Date.now()}`,
      name: tx.userName || 'Player',
      email: tx.userEmail || '',
      balance: tx.amount,
      matchesJoined: 0,
      totalWon: 0,
      createdAt: new Date().toISOString(),
      role: 'user',
    };
    db.users = [...(db.users || []), user];
  }

  saveDb(db);
  return res.json({ success: true, transaction: tx, user });
});

// 5. Admin Reject Add Money
app.post('/api/transactions/reject-add-money', (req, res) => {
  const { transactionId, reason } = req.body;
  const db = getDb();
  const tx = (db.transactions || []).find((t: any) => t.id === transactionId);
  if (!tx || tx.type !== 'add_money') {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  tx.status = 'rejected';
  tx.adminNote = reason || 'ভুল TrxID বা টাকা পাওয়া যায়নি';

  saveDb(db);
  return res.json({ success: true, transaction: tx });
});

// 6. Admin Approve Withdraw
app.post('/api/transactions/approve-withdraw', (req, res) => {
  const { transactionId } = req.body;
  const db = getDb();
  const tx = (db.transactions || []).find((t: any) => t.id === transactionId);
  if (!tx || tx.type !== 'withdraw') {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  tx.status = 'completed';
  tx.adminNote = 'টাকা সফলভাবে বিকাশ/নগদে পাঠানো হয়েছে';

  saveDb(db);
  return res.json({ success: true, transaction: tx });
});

// 7. Admin Reject Withdraw (Refunds user)
app.post('/api/transactions/reject-withdraw', (req, res) => {
  const { transactionId, reason } = req.body;
  const db = getDb();
  const tx = (db.transactions || []).find((t: any) => t.id === transactionId);
  if (!tx || tx.type !== 'withdraw') {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  tx.status = 'rejected';
  tx.adminNote = reason || 'নাম্বার ভুল বা রিকোয়েস্ট বাতিল';

  // Refund user balance
  const user = (db.users || []).find((u: any) => u.email?.toLowerCase() === tx.userEmail?.toLowerCase());
  if (user) {
    user.balance = (user.balance || 0) + tx.amount;
  }

  saveDb(db);
  return res.json({ success: true, transaction: tx });
});

// 7b. General Transaction Create / Sync
app.post('/api/transactions/create', (req, res) => {
  const { transaction } = req.body;
  if (!transaction || !transaction.id) {
    return res.status(400).json({ success: false, error: 'Invalid transaction' });
  }
  const db = getDb();
  const existingIdx = (db.transactions || []).findIndex((t: any) => t.id === transaction.id);
  if (existingIdx >= 0) {
    db.transactions[existingIdx] = transaction;
  } else {
    db.transactions = [transaction, ...(db.transactions || [])];
  }
  saveDb(db);
  return res.json({ success: true, transaction });
});

// 8. Tournaments save/delete
app.post('/api/tournaments/save', (req, res) => {
  const { tournament } = req.body;
  if (!tournament || !tournament.id) {
    return res.status(400).json({ success: false, error: 'Invalid tournament data' });
  }
  const db = getDb();
  const idx = (db.tournaments || []).findIndex((t: any) => t.id === tournament.id);
  if (idx >= 0) {
    db.tournaments[idx] = tournament;
  } else {
    db.tournaments = [tournament, ...(db.tournaments || [])];
  }
  saveDb(db);
  return res.json({ success: true, tournament });
});

app.post('/api/tournaments/delete', (req, res) => {
  const { tournamentId } = req.body;
  const db = getDb();
  db.tournaments = (db.tournaments || []).filter((t: any) => t.id !== tournamentId);
  saveDb(db);
  return res.json({ success: true });
});

// 9. Config update
app.post('/api/config/update', (req, res) => {
  const { configUpdate } = req.body;
  const db = getDb();
  db.config = { ...db.config, ...configUpdate };
  saveDb(db);
  return res.json({ success: true, config: db.config });
});

// 10. User save
app.post('/api/users/save', (req, res) => {
  const { user } = req.body;
  if (!user || !user.email) return res.status(400).json({ success: false });
  const db = getDb();
  const idx = (db.users || []).findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase());
  if (idx >= 0) {
    db.users[idx] = { ...db.users[idx], ...user };
  } else {
    db.users = [...(db.users || []), user];
  }
  saveDb(db);
  return res.json({ success: true, user });
});

// Mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`S1 TENDO PRO server running on http://0.0.0.0:${port}`);
  });
}

startServer();
