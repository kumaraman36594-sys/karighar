import { TokenTransaction, Referral, ReferralTierInfo, UserSession } from '../types';

export const REFERRAL_TIERS: ReferralTierInfo[] = [
  {
    tier: 0,
    name: 'Bronze',
    nameHi: '🥉 Bronze',
    emoji: '🥉',
    minReferrals: 0,
    benefit: 'Basic tokens',
    benefitHi: 'बुनियादी टोकन रिवॉर्ड',
    color: '#cd7f32',
    bgLight: 'bg-amber-50 text-amber-900 border-amber-300',
    badgeBorder: 'border-amber-600',
  },
  {
    tier: 1,
    name: 'Silver',
    nameHi: '🥈 Silver',
    emoji: '🥈',
    minReferrals: 5,
    benefit: '+10% token earnings',
    benefitHi: '+10% अतिरिक्त टोकन कमाई',
    color: '#94a3b8',
    bgLight: 'bg-slate-100 text-slate-900 border-slate-300',
    badgeBorder: 'border-slate-500',
  },
  {
    tier: 2,
    name: 'Gold',
    nameHi: '🥇 Gold',
    emoji: '🥇',
    minReferrals: 15,
    benefit: '+25% tokens, priority support',
    benefitHi: '+25% टोकन और प्राथमिकता सहायता',
    color: '#eab308',
    bgLight: 'bg-yellow-50 text-yellow-900 border-yellow-300',
    badgeBorder: 'border-yellow-500',
  },
  {
    tier: 3,
    name: 'Platinum',
    nameHi: '💎 Platinum',
    emoji: '💎',
    minReferrals: 30,
    benefit: '+50% tokens, featured profile',
    benefitHi: '+50% टोकन और विशेष प्रोफाइल फीचर',
    color: '#06b6d4',
    bgLight: 'bg-cyan-50 text-cyan-900 border-cyan-300',
    badgeBorder: 'border-cyan-500',
  },
  {
    tier: 4,
    name: 'Diamond',
    nameHi: '👑 Diamond',
    emoji: '👑',
    minReferrals: 50,
    benefit: '+100% tokens, revenue share',
    benefitHi: '+100% टोकन और रेवेन्यू शेयर पार्टनरशिप',
    color: '#38bdf8',
    bgLight: 'bg-sky-50 text-sky-950 border-sky-300',
    badgeBorder: 'border-sky-500',
  },
];

export interface SpendOption {
  id: string;
  title: string;
  titleHi: string;
  cost: number;
  icon: string;
  desc: string;
  descHi: string;
  category: 'growth' | 'creative' | 'financial';
}

export const TOKEN_SPEND_OPTIONS: SpendOption[] = [
  {
    id: 'priority-listing',
    title: 'Priority listing in search',
    titleHi: '🔍 प्राथमिकता लिस्टिंग',
    cost: 20,
    icon: '🔍',
    desc: 'Search results show your craft at top for 7 days',
    descHi: 'खोज परिणामों में आपका उत्पाद 7 दिनों तक सबसे ऊपर दिखेगा',
    category: 'growth',
  },
  {
    id: 'photo-enhancement',
    title: 'Free AI photo enhancement',
    titleHi: '📷 मुफ्त फोटो सुधार',
    cost: 15,
    icon: '📷',
    desc: 'Studio lighting and background cleanup for 3 photos',
    descHi: '3 तस्वीरों की स्टूडियो लाइटिंग और बैकग्राउंड की डिजिटल सफाई',
    category: 'creative',
  },
  {
    id: 'desc-rewrite',
    title: 'Free description rewrite',
    titleHi: '✍️ मुफ्त विवरण रीराइट',
    cost: 10,
    icon: '✍️',
    desc: 'Boutique-grade storytelling tailored for metropolitan buyers',
    descHi: 'शहरी ग्राहकों के लिए आकर्षक और पेशेवर विवरण संपादन',
    category: 'creative',
  },
  {
    id: 'reduced-commission',
    title: 'Reduced commission (1% off)',
    titleHi: '💸 कम कमीशन (1% छूट)',
    cost: 50,
    icon: '💸',
    desc: 'Applies 1% discount to all cooperative fees for next 30 days',
    descHi: 'अगले 30 दिनों के लिए सहकारी फीस में 1% की छूट',
    category: 'financial',
  },
  {
    id: 'homepage-feature',
    title: 'Homepage feature (24 hours)',
    titleHi: '⭐ होमपेज फीचर (24 घंटे)',
    cost: 100,
    icon: '⭐',
    desc: 'Curated hero placement for 24 hours on buyer marketplace',
    descHi: 'खरीदार बाज़ार के मुख्य होमपेज पर 24 घंटे का मुख्य प्रदर्शन',
    category: 'growth',
  },
  {
    id: 'delivery-subsidy',
    title: 'Delivery subsidy',
    titleHi: '🚚 डिलीवरी सब्सिडी',
    cost: 75,
    icon: '🚚',
    desc: 'Subsidize shipping for outstation courier & express delivery',
    descHi: 'बाहरी कूरियर व पार्सल भेजने पर ₹75 की सीधी सब्सिडी',
    category: 'financial',
  },
  {
    id: 'cash-withdrawal',
    title: 'Cash withdrawal (₹1 = 1 token)',
    titleHi: '💵 नकद निकालें (₹100 नकद)',
    cost: 100,
    icon: '💵',
    desc: 'Direct UPI transfer to registered bank account or wallet (₹1 = 1 token)',
    descHi: 'पंजीकृत बैंक खाते या UPI में सीधा ₹100 का नकद ट्रांसफर (₹1 = 1 टोकन)',
    category: 'financial',
  },
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-1',
    referrerId: 'user-self',
    referredId: 'user-suresh',
    referredName: 'सुरेश (भाई)',
    relation: 'भाई',
    status: 'completed',
    totalEarned: 75,
    milestones: {
      firstArtistRegistered: true,
      firstSaleCompleted: true,
    },
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'ref-2',
    referrerId: 'user-self',
    referredId: 'user-priya',
    referredName: 'प्रिया (पड़ोसी)',
    relation: 'पड़ोसी',
    status: 'active',
    totalEarned: 25,
    milestones: {
      firstArtistRegistered: true,
      firstSaleCompleted: false,
    },
    createdAt: '2026-08-28T14:30:00.000Z',
  },
  {
    id: 'ref-3',
    referrerId: 'user-self',
    referredId: 'user-ajay',
    referredName: 'अजय (NGO वर्कर)',
    relation: 'NGO वर्कर',
    status: 'completed',
    totalEarned: 100,
    milestones: {
      firstArtistRegistered: true,
      firstSaleCompleted: true,
      fiveArtistsRegistered: true,
    },
    createdAt: '2026-09-02T09:15:00.000Z',
  },
];

export const STORAGE_KEYS = {
  REFERRALS: 'artisan_referrals',
};

export class TokenService {
  static calculateTier(referralCount: number): number {
    if (referralCount >= 50) return 4; // Diamond
    if (referralCount >= 30) return 3; // Platinum
    if (referralCount >= 15) return 2; // Gold
    if (referralCount >= 5) return 1;  // Silver
    return 0; // Bronze
  }

  static getTierInfo(tierLevel: number): ReferralTierInfo {
    const clamped = Math.max(0, Math.min(tierLevel, REFERRAL_TIERS.length - 1));
    return REFERRAL_TIERS[clamped];
  }

  static getNextTierInfo(referralCount: number): { nextTier: ReferralTierInfo | null; needed: number } {
    const currentTierIndex = this.calculateTier(referralCount);
    if (currentTierIndex >= REFERRAL_TIERS.length - 1) {
      return { nextTier: null, needed: 0 };
    }
    const next = REFERRAL_TIERS[currentTierIndex + 1];
    return {
      nextTier: next,
      needed: Math.max(0, next.minReferrals - referralCount),
    };
  }

  static generateReferralCode(name: string = 'RAMESH', userNumber: number = 123): string {
    const cleanedName = name.trim().toUpperCase().replace(/[^A-Z]/g, '') || 'RAMESH';
    return `KARIGHAR-${cleanedName}-${userNumber}`;
  }

  static validateReferralCode(code: string): boolean {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    // Valid format: KARIGHAR-[NAME]-[NUMBER]
    const pattern = /^KARIGHAR-[A-Z0-9]{2,15}-\d{2,6}$/;
    if (pattern.test(clean)) return true;

    // Also accept sample preset codes for testing convenience
    const acceptedPresets = [
      'KARIGHAR-RAMESH-123',
      'KARIGHAR-PRIYA-456',
      'KARIGHAR-AJAY-789',
      'KARIGHAR-SURESH-101',
      'KARIGHAR-ANANYA-202',
      'KARIGHAR-VILLAGE-500',
    ];
    return acceptedPresets.includes(clean);
  }

  static getStoredReferrals(): Referral[] {
    if (typeof window === 'undefined') return INITIAL_REFERRALS;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      if (!item) {
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(INITIAL_REFERRALS));
        return INITIAL_REFERRALS;
      }
      return JSON.parse(item);
    } catch {
      return INITIAL_REFERRALS;
    }
  }

  static getReferrals(): Referral[] {
    return this.getStoredReferrals();
  }

  static saveReferrals(referrals: Referral[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
    } catch (e) {
      console.error('Error saving referrals:', e);
    }
  }
}

export class ReferralService {
  static getShareMessage(code: string): string {
    return `कारीगर ऐप पर हस्तनिर्मित उत्पाद बेचें! मेरा कोड इस्तेमाल करें: ${code} आपको +25 टोकन मिलेंगे!`;
  }

  static async shareReferralCode(code: string): Promise<boolean> {
    const message = this.getShareMessage(code);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'कारीगर (Karighar) — हुनर से बाज़ार तक',
          text: message,
          url: window.location.origin,
        });
        return true;
      } catch (e) {
        // User cancelled or unsupported
      }
    }
    // Fallback: clipboard copy
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(message);
      return true;
    }
    return false;
  }
}
