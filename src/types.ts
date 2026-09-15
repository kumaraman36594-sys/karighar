export type UserRole = 'seller' | 'buyer';
export type AccessMode = 'guest' | 'authenticated';

export type Language = 
  | 'hi' 
  | 'en' 
  | 'ta' 
  | 'te' 
  | 'bn' 
  | 'mr' 
  | 'gu' 
  | 'kn' 
  | 'mai' 
  | 'bho' 
  | 'or' 
  | 'pa';

export type CraftType = 
  | 'Pottery'
  | 'Textile'
  | 'Jewelry'
  | 'Woodwork'
  | 'Painting'
  | 'Food'
  | 'Other';

export interface UserSession {
  userId?: string;
  accessMode: AccessMode;
  role: UserRole;
  activeArtistId?: string;
  token?: string;
  loginTime?: string;
  mobileNumber?: string;
  hasCompletedOnboarding?: boolean;
  hasSelectedLanguage?: boolean;
  language: Language;
  isAudioMuted?: boolean;
  tokenBalance?: number;
  referralCode?: string;      // KARIGHAR-[NAME]-[NUMBER]
  referredBy?: string;        // Referrer's code or id
  referralTier?: number;      // 0=Bronze, 1=Silver, 2=Gold, 3=Platinum, 4=Diamond
  referralCount?: number;     // Number of successful referrals
  totalTokens?: number;       // Lifetime tokens earned
}

export interface Artist {
  id: string;
  name: string;
  village: string;
  district: string;
  craft: CraftType | string;
  language: Language;
  relationship: 'self' | 'helper';
  productIds: string[];
  createdAt: string;
  avatar?: string;
  banner?: string;
  totalEarned?: number;
  rating?: number;
  reviewsCount?: number;
  bio?: string;
  generation?: string;
  salesCount?: number;
}

export type DeviceMode = 'auto' | 'phone' | 'tablet' | 'laptop';

export interface ProductConfidence {
  title: number;
  description: number;
  category: number;
  material: number;
  price: number;
}

export interface Product {
  id: string;
  artistId: string;
  title: string;
  description: string;
  category: string;
  material: string;
  price: number;
  tags: string[];
  imagePaths: string[];
  image?: string;
  artistName?: string;
  artistLocation?: string;
  craft?: string;
  size?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: [number, number];
  region?: string;
  status?: 'draft' | 'published';
  createdAt: string;
  dimensions?: string;
  makingTime?: string;
  stock?: number;
  confidence?: ProductConfidence;
  featured?: boolean;
}

export interface TokenTransaction {
  id: string;
  userId?: string;
  artistId?: string;
  amount: number;
  source: 'sale' | 'referral' | 'onboarding' | 'listing' | 'milestone' | 'spend' | 'bonus';
  type?: 'credit' | 'debit';
  referredUserId?: string;
  description: string;
  timestamp: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referredName: string;
  relation?: string;
  status: 'pending' | 'active' | 'completed';
  totalEarned: number;
  milestones: {
    firstArtistRegistered?: boolean;
    firstSaleCompleted?: boolean;
    fiveArtistsRegistered?: boolean;
  };
  createdAt: string;
}

export interface ReferralTierInfo {
  tier: number; // 0 to 4
  name: string;
  nameHi: string;
  emoji: string;
  minReferrals: number;
  benefit: string;
  benefitHi: string;
  color: string;
  bgLight: string;
  badgeBorder: string;
}

export interface Inquiry {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  artistId: string;
  quantity: number;
  neededBy: string;
  message: string;
  buyerName?: string;
  buyerMobile?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Order {
  id: string;
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  artistId?: string;
  quantity?: number;
  totalPrice: number;
  buyerName: string;
  buyerMobile: string;
  shippingAddress: string;
  paymentMethod?: 'UPI' | 'Card' | 'COD';
  items?: CartItem[];
  status: 'confirmed' | 'in_transit' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export interface MarketPriceInfo {
  category: string;
  basePrice: number;
  range: [number, number];
  recommended: number;
  region: string;
  note: string;
}

export type BuyerTab = 'home' | 'categories' | 'cart' | 'orders' | 'profile';

export type ScreenName =
  | 'language_select'
  | 'splash'
  | 'role_select'
  | 'seller_login'
  | 'otp_verify'
  | 'referral_entry'
  | 'artist_register'
  | 'camera_main'
  | 'camera_capture'
  | 'ai_processing'
  | 'voice_qa'
  | 'review_listing'
  | 'publish_success'
  | 'success'
  | 'buyer_home'
  | 'buyer_search'
  | 'buyer_categories'
  | 'buyer_cart'
  | 'buyer_checkout'
  | 'buyer_orders'
  | 'buyer_profile'
  | 'marketplace'
  | 'product_detail'
  | 'artisan_profile'
  | 'artist_switcher'
  | 'token_dashboard'
  | 'tokens'
  | 'referral_dashboard'
  | 'my_listings'
  | 'profile';
