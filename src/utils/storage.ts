import { 
  UserSession, 
  Artist, 
  Product, 
  TokenTransaction, 
  Inquiry, 
  Order, 
  CartItem,
  Language,
  CraftType
} from '../types';
import { 
  INITIAL_ARTISTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TOKENS 
} from '../data/mockData';

const STORAGE_KEYS = {
  SESSION: 'artisan_user_session',
  ARTISTS: 'artisan_artists',
  PRODUCTS: 'artisan_products',
  GUEST_PRODUCTS: 'karighar_guest_products',
  TOKENS: 'artisan_tokens',
  INQUIRIES: 'artisan_inquiries',
  ORDERS: 'artisan_orders',
  CART: 'karighar_cart',
  LANGUAGE: 'language',
  ALT_LANGUAGE: 'artisan_language',
  FIRST_LAUNCH: 'artisan_first_launch',
  LAST_ARTIST_ID: 'artisan_last_artist_id',
};

// Safe localStorage access
const getJson = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

const setJson = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

export const getStoredSession = (): UserSession | null => {
  return getJson<UserSession | null>(STORAGE_KEYS.SESSION, null);
};

export const setStoredSession = (session: UserSession | null): void => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    setJson(STORAGE_KEYS.SESSION, session);
    if (session.activeArtistId) {
      localStorage.setItem(STORAGE_KEYS.LAST_ARTIST_ID, session.activeArtistId);
    }
  }
};

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'hi';
  const stored = (localStorage.getItem(STORAGE_KEYS.LANGUAGE) || localStorage.getItem(STORAGE_KEYS.ALT_LANGUAGE)) as Language;
  if (stored && ['hi', 'en', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'mai', 'bho', 'or', 'pa'].includes(stored)) {
    return stored;
  }
  return 'hi';
};

export const setStoredLanguage = (lang: Language): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  localStorage.setItem(STORAGE_KEYS.ALT_LANGUAGE, lang);
  const session = getJson<UserSession | null>(STORAGE_KEYS.SESSION, null);
  if (session) {
    session.language = lang;
    session.hasSelectedLanguage = true;
    setJson(STORAGE_KEYS.SESSION, session);
  }
};

export const getStoredArtists = (): Artist[] => {
  const artists = getJson<Artist[]>(STORAGE_KEYS.ARTISTS, INITIAL_ARTISTS);
  if (!Array.isArray(artists) || artists.length === 0 || !artists.some(a => a.id === 'artist-1')) {
    setJson(STORAGE_KEYS.ARTISTS, INITIAL_ARTISTS);
    return INITIAL_ARTISTS;
  }
  return artists;
};

export const saveArtist = (artist: Artist): Artist[] => {
  const artists = getStoredArtists();
  const existingIndex = Array.isArray(artists) ? artists.findIndex(a => a.id === artist.id) : -1;
  if (existingIndex >= 0) {
    artists[existingIndex] = artist;
  } else {
    artists.unshift(artist);
  }
  setJson(STORAGE_KEYS.ARTISTS, artists);
  return artists;
};

export const deleteArtist = (artistId: string): void => {
  const artists = getStoredArtists();
  const filtered = Array.isArray(artists) ? artists.filter(a => a.id !== artistId) : [];
  setJson(STORAGE_KEYS.ARTISTS, filtered);
};

export const getStoredProducts = (): Product[] => {
  const products = getJson<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (!Array.isArray(products) || products.length === 0 || !products.some(p => p.id === 'prod_001')) {
    setJson(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return products;
};

export const getStoredGuestProducts = (): Product[] => {
  const products = getJson<Product[]>(STORAGE_KEYS.GUEST_PRODUCTS, []);
  return Array.isArray(products) ? products : [];
};

export const saveGuestProduct = (product: Product): Product[] => {
  const products = getStoredGuestProducts();
  const index = products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  setJson(STORAGE_KEYS.GUEST_PRODUCTS, products);
  return products;
};

export const saveProduct = (product: Product): Product[] => {
  const products = getStoredProducts();
  const index = Array.isArray(products) ? products.findIndex(p => p.id === product.id) : -1;
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  setJson(STORAGE_KEYS.PRODUCTS, products);

  // Also update artist's productIds
  const artists = getStoredArtists();
  const artist = Array.isArray(artists) ? artists.find(a => a?.id === product.artistId) : undefined;
  if (artist && Array.isArray(artist.productIds) && !artist.productIds.includes(product.id)) {
    artist.productIds.push(product.id);
    saveArtist(artist);
  }
  return products;
};

export const getStoredTokens = (): TokenTransaction[] => {
  const tokens = getJson<TokenTransaction[]>(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  if (!Array.isArray(tokens) || tokens.length === 0) {
    setJson(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
    return INITIAL_TOKENS;
  }
  return tokens;
};

export const addTokenReward = (artistId: string, amount: number, description: string, source: 'sale' | 'listing' | 'onboarding' = 'sale'): void => {
  const tokens = getStoredTokens();
  const newTx: TokenTransaction = {
    id: `tok-${Date.now()}`,
    artistId,
    amount,
    source,
    description,
    timestamp: new Date().toISOString(),
  };
  tokens.unshift(newTx);
  setJson(STORAGE_KEYS.TOKENS, tokens);

  // Update artist earnings
  const artists = getStoredArtists();
  const artist = Array.isArray(artists) ? artists.find(a => a?.id === artistId) : undefined;
  if (artist) {
    artist.totalEarned = (artist.totalEarned || 0) + (amount * 50); // ₹50 value equivalent per token
    saveArtist(artist);
  }
};

export const getStoredInquiries = (): Inquiry[] => {
  return getJson<Inquiry[]>(STORAGE_KEYS.INQUIRIES, [
    {
      id: 'inq-1',
      productId: 'prod-1',
      productTitle: 'Handmade Blue Pottery Vase',
      productPrice: 550,
      productImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
      artistId: 'artist-1',
      quantity: 25,
      neededBy: '2026-10-15',
      message: 'Need 25 pieces for corporate festive gift hampers in Delhi. Can we customize the motif?',
      buyerName: 'Priya Sharma (FabIndia)',
      buyerMobile: '+91 98765 43210',
      createdAt: '2026-09-11T16:00:00.000Z',
    }
  ]);
};

export const saveInquiry = (inquiry: Inquiry): void => {
  const inquiries = getStoredInquiries();
  inquiries.unshift(inquiry);
  setJson(STORAGE_KEYS.INQUIRIES, inquiries);
};

export const getStoredOrders = (): Order[] => {
  return getJson<Order[]>(STORAGE_KEYS.ORDERS, [
    {
      id: 'ord-101',
      productId: 'prod-1',
      productTitle: 'Handmade Blue Pottery Vase',
      productPrice: 550,
      productImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
      artistId: 'artist-1',
      quantity: 1,
      totalPrice: 550,
      buyerName: 'Ananya Gupta',
      buyerMobile: '+91 98111 22334',
      shippingAddress: 'Flat 402, Lotus Heights, Saket, New Delhi 110017',
      status: 'delivered',
      createdAt: '2026-09-10T12:20:00.000Z',
    }
  ]);
};

export const saveOrder = (order: Order): void => {
  const orders = getStoredOrders();
  orders.unshift(order);
  setJson(STORAGE_KEYS.ORDERS, orders);

  // Automatically credit 5 tokens per successful sale as stated in Section 5 & Flowchart
  addTokenReward(order.artistId, 5, `Order #${order.id.slice(-4)} (${order.productTitle.slice(0, 18)}...) → +5 tokens`, 'sale');
};

export const getStoredCart = (): CartItem[] => {
  return getJson<CartItem[]>(STORAGE_KEYS.CART, []);
};

export const saveCart = (cart: CartItem[]): void => {
  setJson(STORAGE_KEYS.CART, cart);
};

export const resetAllData = (): void => {
  localStorage.clear();
  setJson(STORAGE_KEYS.ARTISTS, INITIAL_ARTISTS);
  setJson(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setJson(STORAGE_KEYS.GUEST_PRODUCTS, []);
  setJson(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  setJson(STORAGE_KEYS.CART, []);
};

export const DEFAULT_SESSION = {
  accessMode: 'guest' as const,
  role: 'seller' as 'seller' | 'buyer',
  hasCompletedOnboarding: false,
  hasSelectedLanguage: false,
  language: 'hi' as Language,
  isAudioMuted: false,
  tokenBalance: 0,
  totalTokens: 0,
  referralCount: 0,
};

export const StorageService = {
  getSession: () => {
    const raw = getJson<any>(STORAGE_KEYS.SESSION, null);
    const storedLang = getStoredLanguage();
    if (!raw) return { ...DEFAULT_SESSION, language: storedLang };
    return {
      ...DEFAULT_SESSION,
      ...raw,
      accessMode: raw.accessMode || (raw.userId || raw.loginTime ? 'authenticated' : 'guest'),
      language: raw.language || storedLang,
    };
  },
  saveSession: (session: any) => {
    if (session?.language && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, session.language);
    }
    setJson(STORAGE_KEYS.SESSION, session);
  },
  getArtists: getStoredArtists,
  saveArtist,
  deleteArtist,
  getProducts: getStoredProducts,
  saveProduct,
  getGuestProducts: getStoredGuestProducts,
  saveGuestProduct,
  getCart: getStoredCart,
  saveCart,
  getOrders: getStoredOrders,
  saveOrder,
  getTransactions: getStoredTokens,
  addTransaction: (tx: TokenTransaction) => {
    const tokens = getStoredTokens();
    tokens.unshift(tx);
    setJson(STORAGE_KEYS.TOKENS, tokens);
    return tokens;
  },
  resetToDefaults: resetAllData,
};
