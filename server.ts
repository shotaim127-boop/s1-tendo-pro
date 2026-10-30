import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

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
- CREATE_TOURNAMENT (when creating or adding a new tournament)
- UPDATE_NOTICE (when updating the live notice banner ticker)
- ADD_RULE (when adding anti-cheat or platform tournament rules)
- GENERATE_ROOM (when generating custom room credentials)
- NONE (pure Q&A or analysis)

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
              description: 'One of CREATE_TOURNAMENT, UPDATE_NOTICE, ADD_RULE, GENERATE_ROOM, NONE.',
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
