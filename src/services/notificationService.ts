export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  url?: string;
}

export const BrowserNotificationService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermissionState(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.sendNotification({
          title: '🔔 S1 TENDO PRO নোটিফিকেশন চালু হয়েছে!',
          body: 'টুর্নামেন্ট ম্যাচ শুরুর রুম আইডি, পাসওয়ার্ড ও ফলাফলের সাথে সাথে সরাসরি ব্রাউজার নোটিফিকেশন পাবেন।',
          icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
          tag: 'welcome-notification',
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  sendNotification(payload: PushNotificationPayload): boolean {
    if (!this.isSupported()) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80',
        tag: payload.tag || `s1-notif-${Date.now()}`,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch {
      return false;
    }
  },

  // Preset triggers for Esports Events
  notifyMatchRoomPublished(tournamentTitle: string, roomId: string, roomPass: string) {
    this.sendNotification({
      title: `🔑 কাস্টম রুম আইডি প্রস্তুত: ${tournamentTitle}`,
      body: `রুম আইডি: ${roomId} | পাসওয়ার্ড: ${roomPass || 'None'}। এখনই Free Fire গেমে প্রবেশ করুন ও স্লটে জয়েন করুন!`,
      tag: `room-published-${tournamentTitle}`,
    });
  },

  notifyMatchResultsPosted(tournamentTitle: string, topWinnerName?: string, prizeWon?: number) {
    const bodyText = prizeWon && prizeWon > 0
      ? `অভিনন্দন! ${tournamentTitle} ম্যাচে আপনি ৳${prizeWon} প্রাইজমানি জিতেছেন!`
      : topWinnerName 
        ? `${tournamentTitle} টুর্নামেন্টের বিজয়ী ঘোষণা সম্পন্ন হয়েছে। ১ম স্থান: ${topWinnerName}`
        : `${tournamentTitle} টুর্নামেন্টের সম্পূর্ণ রেজাল্ট শিট ও বিজয়ী তালিকা প্রকাশ করা হয়েছে।`;

    this.sendNotification({
      title: `🏆 টুর্নামেন্ট রেজাল্ট প্রকাশিত হয়েছে!`,
      body: bodyText,
      tag: `results-posted-${tournamentTitle}`,
    });
  },

  notifyAddMoneyStatus(status: 'approved' | 'rejected', amount: number, reason?: string) {
    if (status === 'approved') {
      this.sendNotification({
        title: `✅ এড মানি সফল হয়েছে!`,
        body: `আপনার ওয়ালেটে ৳${amount} টাকা সফলভাবে জমা হয়েছে। টুর্নামেন্ট স্লট ক্রয় করুন!`,
        tag: `add-money-approved-${Date.now()}`,
      });
    } else {
      this.sendNotification({
        title: `❌ এড মানি বাতিল করা হয়েছে`,
        body: `৳${amount} এড মানি রিকোয়েস্ট বাতিল করা হয়েছে। কারণ: ${reason || 'ভুল TrxID বা পেমেন্ট পাওয়া যায়নি'}`,
        tag: `add-money-rejected-${Date.now()}`,
      });
    }
  },

  notifyWithdrawStatus(status: 'approved' | 'rejected', amount: number, reason?: string) {
    if (status === 'approved') {
      this.sendNotification({
        title: `💸 উইথড্র সম্পন্ন হয়েছে!`,
        body: `আপনার ৳${amount} উইথড্র রিকোয়েস্ট অনুমোদিত হয়েছে এবং বিকাশ/নগদে টাকা পাঠানো হয়েছে।`,
        tag: `withdraw-approved-${Date.now()}`,
      });
    } else {
      this.sendNotification({
        title: `❌ উইথড্র রিকোয়েস্ট বাতিল`,
        body: `৳${amount} উইথড্র বাতিল করা হয়েছে এবং ওয়ালেট ব্যালেন্স রিফান্ড করা হয়েছে। কারণ: ${reason || 'নাম্বার ভুল'}`,
        tag: `withdraw-rejected-${Date.now()}`,
      });
    }
  },
};
