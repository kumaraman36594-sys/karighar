import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Artist, 
  Product, 
  ScreenName, 
  DeviceMode,
  TokenTransaction,
  Referral,
  CartItem,
  Order,
  BuyerTab
} from './types';
import { 
  StorageService, 
  DEFAULT_SESSION,
  setStoredLanguage
} from './utils/storage';
import { TokenService } from './utils/tokenService';
import { 
  SAMPLE_CAPTURE_PREVIEWS, 
  MOCK_PRODUCTS, 
  INITIAL_ARTISTS,
  MARKET_PRICING_DATA 
} from './data/mockData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sparkles } from 'lucide-react';

// Common Components
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';

// Buyer Components & Screens (Amazon Style)
import { BuyerHeader } from './components/buyer/BuyerHeader';
import { BuyerBottomNav } from './components/buyer/BuyerBottomNav';
import { BuyerHomeScreen } from './components/screens/BuyerHomeScreen';
import { BuyerSearchScreen } from './components/screens/BuyerSearchScreen';
import { BuyerCategoriesScreen } from './components/screens/BuyerCategoriesScreen';
import { BuyerCartScreen } from './components/screens/BuyerCartScreen';
import { BuyerCheckoutScreen } from './components/screens/BuyerCheckoutScreen';
import { BuyerOrdersScreen } from './components/screens/BuyerOrdersScreen';
import { BuyerProfileScreen } from './components/screens/BuyerProfileScreen';

// Seller & Common Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { LanguageSelectScreen } from './components/screens/LanguageSelectScreen';
import { RoleSelectScreen } from './components/screens/RoleSelectScreen';
import { SellerLoginScreen } from './components/screens/SellerLoginScreen';
import { OtpVerifyScreen } from './components/screens/OtpVerifyScreen';
import { ReferralEntryScreen } from './components/screens/ReferralEntryScreen';
import { ArtistRegisterScreen } from './components/screens/ArtistRegisterScreen';
import { CameraMainScreen } from './components/screens/CameraMainScreen';
import { CameraCaptureScreen } from './components/screens/CameraCaptureScreen';
import { AiProcessingScreen } from './components/screens/AiProcessingScreen';
import { VoiceQaScreen } from './components/screens/VoiceQaScreen';
import { ReviewListingScreen } from './components/screens/ReviewListingScreen';
import { SuccessScreen } from './components/screens/SuccessScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { ArtisanPublicProfileScreen } from './components/screens/ArtisanPublicProfileScreen';
import { ArtistSwitcherScreen } from './components/screens/ArtistSwitcherScreen';
import { TokenDashboardScreen } from './components/screens/TokenDashboardScreen';
import { ReferralDashboardScreen } from './components/screens/ReferralDashboardScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { MyListingsScreen } from './components/screens/MyListingsScreen';

// Modals
import { SendInquiryModal } from './components/screens/SendInquiryModal';
import { BuyCheckoutModal } from './components/screens/BuyCheckoutModal';

function KarigharMain() {
  const { language, setLanguage, t } = useLanguage();

  // Session & Preferences
  const [session, setSession] = useState(() => {
    const s = StorageService.getSession() || DEFAULT_SESSION;
    return s;
  });

  const [artists, setArtists] = useState<Artist[]>(() => {
    const list = StorageService.getArtists();
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_ARTISTS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const list = StorageService.getProducts();
    return Array.isArray(list) && list.length > 0 ? list : MOCK_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<TokenTransaction[]>(() => {
    const list = StorageService.getTransactions();
    return Array.isArray(list) ? list : [];
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    return TokenService.getReferrals();
  });

  // Cart & Orders
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const c = StorageService.getCart();
    if (Array.isArray(c) && c.length > 0) return c;
    // Pre-populate with 1 authentic craft so cart is ready to test
    return [
      { product: MOCK_PRODUCTS[0], quantity: 1 }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return StorageService.getOrders();
  });

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    try {
      const storedLang = localStorage.getItem('karighar_language');
      if (!storedLang) {
        return 'language_select';
      }
    } catch {
      // ignore
    }
    return 'splash';
  });

  const [activeTab, setActiveTab] = useState<string>('camera');
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('home');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');
  const [buyerSearchQuery, setBuyerSearchQuery] = useState<string>('');

  // Temporary flow data
  const [tempMobile, setTempMobile] = useState<string>('');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Modals
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Active Artist
  const activeArtist = (Array.isArray(artists) ? artists.find(a => a?.id === session?.activeArtistId) : undefined) 
    || artists?.[0] 
    || INITIAL_ARTISTS[0];

  const getArtistForProduct = (artistId?: string) => {
    if (!artistId || !Array.isArray(artists)) return activeArtist;
    return artists.find(a => a?.id === artistId) || activeArtist;
  };

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Sync session changes to storage
  const updateSession = (partial: Partial<typeof session>) => {
    const updated = { ...session, ...partial };
    setSession(updated);
    StorageService.saveSession(updated);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (idx > -1) {
        updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
      } else {
        updated = [...prev, { product, quantity }];
      }
      StorageService.saveCart(updated);
      return updated;
    });
    showToast(`${product.title} ${t('addedToCart')}`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      StorageService.saveCart(updated);
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      StorageService.saveCart(updated);
      return updated;
    });
    showToast('Removed item from Cart');
  };

  const handleOrderPlaced = (newOrder: Order) => {
    StorageService.saveOrder(newOrder);
    setOrders(StorageService.getOrders());
    setCartItems([]);
    StorageService.saveCart([]);

    // Credit tokens to seller for the sale
    const isFirstSale = !transactions.some(t => t.source === 'sale');
    const rewardTokens = isFirstSale ? 25 : 5;
    const nextBal = (session.tokenBalance || 245) + rewardTokens;
    updateSession({ tokenBalance: nextBal, totalTokens: (session.totalTokens || 245) + rewardTokens });

    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: rewardTokens,
      type: 'credit',
      source: 'sale',
      description: `${newOrder.productTitle || 'उत्पाद'} बिका (ऑर्डर #${newOrder.id.slice(-5)})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast('Order Placed Successfully! Track your shipment below.');
    setBuyerTab('orders');
    setCurrentScreen('buyer_orders');
  };

  // 1. Splash finished
  const handleSplashFinish = () => {
    try {
      const storedLang = localStorage.getItem('karighar_language');
      if (!storedLang && !session.hasSelectedLanguage) {
        setCurrentScreen('language_select');
        return;
      }
    } catch {
      // ignore
    }

    if (!session.hasCompletedOnboarding) {
      setCurrentScreen('role_select');
    } else if (session.role === 'buyer') {
      setCurrentScreen('buyer_home');
      setBuyerTab('home');
    } else {
      setCurrentScreen('camera_main');
      setActiveTab('camera');
    }
  };

  // 1b. Language Select
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setStoredLanguage(lang);
    updateSession({ language: lang, hasSelectedLanguage: true });
    
    if (!session.hasCompletedOnboarding) {
      setCurrentScreen('role_select');
    } else if (session.role === 'buyer') {
      setCurrentScreen('buyer_home');
      setBuyerTab('home');
    } else {
      setCurrentScreen('camera_main');
      setActiveTab('camera');
    }
  };

  // 2. Role Select
  const handleSelectRole = (role: UserRole) => {
    updateSession({ role });
    if (role === 'buyer') {
      updateSession({ hasCompletedOnboarding: true });
      setCurrentScreen('buyer_home');
      setBuyerTab('home');
    } else {
      setCurrentScreen('seller_login');
    }
  };

  // 3. Send OTP
  const handleSendOtp = (mobile: string) => {
    setTempMobile(mobile);
    setCurrentScreen('otp_verify');
  };

  // 4. OTP verified
  const handleOtpVerified = () => {
    updateSession({ mobileNumber: tempMobile });
    if (!session.hasCompletedOnboarding) {
      setCurrentScreen('referral_entry');
    } else {
      setCurrentScreen('camera_main');
      setActiveTab('camera');
    }
  };

  // 4b. Apply Referral Code
  const handleApplyReferralCode = (code: string) => {
    const curBal = session.tokenBalance || 245;
    const curTot = session.totalTokens || 245;
    const nextBal = curBal + 25;
    const nextTot = curTot + 25;

    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: 25,
      type: 'credit',
      source: 'referral',
      description: `रेफरल कोड बोनस (${code}) लागू किया`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    updateSession({
      referredBy: code,
      tokenBalance: nextBal,
      totalTokens: nextTot,
    });

    showToast('+25 टोकन मिले! रेफरल बोनस सफलतापूर्वक लागू।');
    setCurrentScreen('artist_register');
  };

  const handleSkipReferral = () => {
    setCurrentScreen('artist_register');
  };

  // 5. Artist registered
  const handleSaveArtist = (newArtist: Artist) => {
    const isFirstArtist = artists.length === 0;
    const rewardTokens = isFirstArtist ? 10 : 5;
    const updatedArtists = StorageService.saveArtist(newArtist);
    setArtists(updatedArtists);
    
    const nextBal = (session.tokenBalance || 245) + rewardTokens;
    const nextTot = (session.totalTokens || 245) + rewardTokens;

    updateSession({ 
      activeArtistId: newArtist.id,
      hasCompletedOnboarding: true,
      tokenBalance: nextBal,
      totalTokens: nextTot,
    });
    
    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: rewardTokens,
      type: 'credit',
      source: 'onboarding',
      description: isFirstArtist 
        ? `पहला कारीगर जोड़ा (${newArtist.name})` 
        : `नया कारीगर जोड़ा (${newArtist.name})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast(`+${rewardTokens} टोकन मिले! (${newArtist.name} पंजीकृत)`);
    setCurrentScreen('camera_main');
    setActiveTab('camera');
  };

  // 6. Camera Photo Captured
  const handlePhotosCaptured = (photoUrls: string[]) => {
    setCapturedPhotos(photoUrls);
    setCurrentScreen('ai_processing');
  };

  // 7. AI processing complete
  const handleAiProcessingComplete = () => {
    setCurrentScreen('voice_qa');
  };

  // 8. Voice QA finished
  const handleFinishVoiceQa = (answers: {
    category: string;
    material: string;
    dimensions: string;
    makingTime: string;
    stock: number;
  }) => {
    const catLower = answers.category.toLowerCase();
    const market = MARKET_PRICING_DATA[catLower] || MARKET_PRICING_DATA.pottery;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: `Handmade ${answers.category} Craft`,
      description: `Exquisitely handcrafted ${answers.category.toLowerCase()} crafted from ${answers.material.toLowerCase()}. Meticulously shaped using heritage techniques from ${activeArtist?.village || 'Bagru'}. Durable, authentic, and direct from village artisan.`,
      category: answers.category,
      material: answers.material,
      price: market.recommended || 550,
      dimensions: answers.dimensions,
      makingTime: answers.makingTime,
      stock: answers.stock,
      imagePaths: capturedPhotos.length > 0 ? capturedPhotos : SAMPLE_CAPTURE_PREVIEWS.map(p => p.url),
      artistId: activeArtist?.id || 'artist-1',
      tags: [answers.category.toLowerCase(), 'handmade', 'artisan', 'heritage'],
      confidence: {
        title: 0.92,
        description: 0.78,
        category: 0.95,
        material: 0.88,
        price: 0.65,
      },
      createdAt: new Date().toISOString(),
    };

    setPendingProduct(newProd);
    setCurrentScreen('review_listing');
  };

  // 9. Approve & Publish
  const handleApprovePublish = (approvedProduct: Product) => {
    const updatedProducts = StorageService.saveProduct(approvedProduct);
    setProducts(updatedProducts);

    if (activeArtist) {
      const updatedArtist = {
        ...activeArtist,
        productIds: [...activeArtist.productIds, approvedProduct.id],
      };
      setArtists(StorageService.saveArtist(updatedArtist));
    }

    const nextBal = (session.tokenBalance || 245) + 5;
    updateSession({ tokenBalance: nextBal, totalTokens: (session.totalTokens || 245) + 5 });
    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: 5,
      type: 'credit',
      source: 'listing',
      description: `उत्पाद लिस्टिंग पूर्ण (फ़ोटो + आवाज़): ${approvedProduct.title}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast('+5 टोकन मिले! (उत्पाद लिस्टिंग पूर्ण)');
    setPendingProduct(approvedProduct);
    setCurrentScreen('success');
  };

  // 10. Redeem tokens
  const handleRedeemTokens = (cost: number, perkTitle: string) => {
    const nextBal = (session.tokenBalance || 0) - cost;
    updateSession({ tokenBalance: nextBal });

    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: cost,
      type: 'debit',
      source: 'spend',
      description: `Redeemed: ${perkTitle}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));
  };

  // 11. Tab Change for Seller side
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'camera') setCurrentScreen('camera_main');
    else if (tabId === 'marketplace') {
      updateSession({ role: 'buyer' });
      setCurrentScreen('buyer_home');
      setBuyerTab('home');
    }
    else if (tabId === 'listings') setCurrentScreen('my_listings');
    else if (tabId === 'tokens') setCurrentScreen('tokens');
    else if (tabId === 'my-artists') setCurrentScreen('artist_switcher');
    else if (tabId === 'profile') setCurrentScreen('profile');
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      StorageService.resetToDefaults();
      setSession(StorageService.getSession());
      setArtists(StorageService.getArtists());
      setProducts(StorageService.getProducts());
      setTransactions(StorageService.getTransactions());
      setCartItems([]);
      setOrders(StorageService.getOrders());
      setCurrentScreen('role_select');
      showToast('Demo data reset successfully!');
    }
  };

  // Logout
  const handleLogout = () => {
    updateSession({
      hasCompletedOnboarding: false,
      mobileNumber: undefined,
    });
    setCurrentScreen('role_select');
  };

  // Container styling for Seller mode
  const getDeviceContainerClass = () => {
    switch (deviceMode) {
      case 'phone':
        return 'max-w-md mx-auto min-h-screen bg-[#FDFBF7] shadow-lg border-x border-stone-200 relative';
      case 'tablet':
        return 'max-w-4xl mx-auto min-h-screen bg-[#FDFBF7] shadow-md border-x border-stone-200 relative';
      case 'laptop':
        return 'w-full max-w-7xl mx-auto min-h-screen bg-[#FDFBF7]';
      case 'auto':
      default:
        return 'w-full min-h-screen bg-[#FDFBF7]';
    }
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onFinish={handleSplashFinish}
          />
        );

      case 'language_select':
        return (
          <LanguageSelectScreen
            onSelectLanguage={handleSelectLanguage}
            currentLanguage={session.language}
            isAudioMuted={session.isAudioMuted}
          />
        );

      case 'role_select':
        return (
          <RoleSelectScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onSelectRole={handleSelectRole}
            onChangeLanguage={() => setCurrentScreen('language_select')}
          />
        );

      case 'seller_login':
        return (
          <SellerLoginScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen('role_select')}
            onSendOtp={handleSendOtp}
          />
        );

      case 'otp_verify':
        return (
          <OtpVerifyScreen
            mobileNumber={tempMobile || '+91 9876543210'}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen('seller_login')}
            onVerified={handleOtpVerified}
          />
        );

      case 'referral_entry':
        return (
          <ReferralEntryScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen('otp_verify')}
            onApplyCode={handleApplyReferralCode}
            onSkip={handleSkipReferral}
          />
        );

      case 'artist_register':
        return (
          <ArtistRegisterScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onSaveArtist={handleSaveArtist}
          />
        );

      case 'camera_capture':
        return (
          <CameraCaptureScreen
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onCancel={() => setCurrentScreen('camera_main')}
            onPhotosCaptured={handlePhotosCaptured}
          />
        );

      case 'ai_processing':
        return (
          <AiProcessingScreen
            photoUrl={capturedPhotos[0] || SAMPLE_CAPTURE_PREVIEWS[0].url}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onComplete={handleAiProcessingComplete}
          />
        );

      case 'voice_qa':
        return (
          <VoiceQaScreen
            language={session.language}
            detectedCategory="Pottery"
            isAudioMuted={session.isAudioMuted}
            onFinishQa={handleFinishVoiceQa}
          />
        );

      case 'review_listing':
        return pendingProduct ? (
          <ReviewListingScreen
            initialProduct={pendingProduct}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onPublish={handleApprovePublish}
          />
        ) : null;

      case 'success':
        return pendingProduct ? (
          <SuccessScreen
            product={pendingProduct}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onViewInMarketplace={() => {
              updateSession({ role: 'buyer' });
              setCurrentScreen('buyer_home');
              setBuyerTab('home');
            }}
            onCreateAnother={() => {
              setCurrentScreen('camera_main');
              setActiveTab('camera');
            }}
          />
        ) : null;

      // Buyer Specific Screens
      case 'buyer_home':
      case 'marketplace':
        return (
          <BuyerHomeScreen
            products={products}
            artists={artists}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
            onSelectArtist={(art) => {
              setSelectedArtist(art);
              setCurrentScreen('artisan_profile');
            }}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onOpenSearch={() => setCurrentScreen('buyer_search')}
          />
        );

      case 'buyer_search':
        return (
          <BuyerSearchScreen
            products={products}
            initialQuery={buyerSearchQuery}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            onBack={() => {
              setCurrentScreen('buyer_home');
              setBuyerTab('home');
            }}
          />
        );

      case 'buyer_categories':
        return (
          <BuyerCategoriesScreen
            onSelectCategory={(catId) => {
              setBuyerSearchQuery(catId);
              setCurrentScreen('buyer_search');
            }}
          />
        );

      case 'buyer_cart':
        return (
          <BuyerCartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => setCurrentScreen('buyer_checkout')}
            onContinueShopping={() => {
              setCurrentScreen('buyer_home');
              setBuyerTab('home');
            }}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
          />
        );

      case 'buyer_checkout':
        return (
          <BuyerCheckoutScreen
            cartItems={cartItems}
            onBack={() => setCurrentScreen('buyer_cart')}
            onOrderPlaced={handleOrderPlaced}
          />
        );

      case 'buyer_orders':
        return (
          <BuyerOrdersScreen
            orders={orders}
            onContinueShopping={() => {
              setCurrentScreen('buyer_home');
              setBuyerTab('home');
            }}
          />
        );

      case 'buyer_profile':
        return (
          <BuyerProfileScreen
            session={session}
            onNavigateOrders={() => {
              setBuyerTab('orders');
              setCurrentScreen('buyer_orders');
            }}
            onSwitchToSeller={() => {
              updateSession({ role: 'seller' });
              setCurrentScreen('camera_main');
              setActiveTab('camera');
            }}
            onLogout={handleLogout}
          />
        );

      case 'product_detail':
        return selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            artist={getArtistForProduct(selectedProduct.artistId)}
            similarProducts={products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)}
            onBack={() => {
              if (session.role === 'seller') {
                setCurrentScreen('my_listings');
              } else {
                setCurrentScreen('buyer_home');
              }
            }}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
            onBuyNow={(prod, qty) => {
              handleAddToCart(prod, qty);
              setCurrentScreen('buyer_checkout');
            }}
            onViewArtist={(art) => {
              setSelectedArtist(art);
              setCurrentScreen('artisan_profile');
            }}
            onSelectSimilarProduct={(prod) => {
              setSelectedProduct(prod);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : null;

      case 'artisan_profile':
        return selectedArtist ? (
          <ArtisanPublicProfileScreen
            artist={selectedArtist}
            products={products}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => {
              if (selectedProduct) {
                setCurrentScreen('product_detail');
              } else {
                setCurrentScreen(session.role === 'buyer' ? 'buyer_home' : 'camera_main');
              }
            }}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
            onContactArtisan={(art) => {
              const prod = products.find(p => p.artistId === art.id) || products[0];
              setSelectedProduct(prod);
              setIsInquiryOpen(true);
            }}
          />
        ) : null;

      case 'artist_switcher':
        return (
          <ArtistSwitcherScreen
            artists={artists}
            activeArtistId={session.activeArtistId}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen('camera_main')}
            onSelectArtist={(artistId) => {
              updateSession({ activeArtistId: artistId });
              setCurrentScreen('camera_main');
              showToast(`Switched active artisan.`);
            }}
            onAddNewArtist={() => setCurrentScreen('artist_register')}
            onDeleteArtist={(artistId) => {
              const updated = StorageService.deleteArtist(artistId);
              setArtists(updated);
              if (session.activeArtistId === artistId) {
                updateSession({ activeArtistId: updated[0]?.id });
              }
              showToast('Artisan profile deleted.');
            }}
          />
        );

      case 'token_dashboard':
      case 'tokens':
        return (
          <TokenDashboardScreen
            session={session}
            transactions={transactions}
            artistsCount={artists.length}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen(session.role === 'buyer' ? 'buyer_home' : 'camera_main')}
            onOpenReferrals={() => setCurrentScreen('referral_dashboard')}
            onRedeemTokens={handleRedeemTokens}
          />
        );

      case 'referral_dashboard':
        return (
          <ReferralDashboardScreen
            session={session}
            referrals={referrals}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => setCurrentScreen('token_dashboard')}
            onShareLink={(code) => {
              if (navigator.share) {
                navigator.share({
                  title: 'Join Karighar (कारीगर)',
                  text: `Join Karighar using my referral code ${code} and get +25 bonus tokens!`,
                  url: window.location.origin,
                });
              } else {
                navigator.clipboard?.writeText(code);
                showToast('Referral code copied to clipboard!');
              }
            }}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            session={session}
            artists={artists}
            activeArtist={activeArtist}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            deviceMode={deviceMode}
            onUpdateSession={updateSession}
            onSwitchArtist={() => setCurrentScreen('artist_switcher')}
            onOpenTokens={() => setCurrentScreen('token_dashboard')}
            onOpenReferrals={() => setCurrentScreen('referral_dashboard')}
            onChangeLanguage={() => setCurrentScreen('language_select')}
            onResetDemoData={handleResetData}
            onLogout={handleLogout}
          />
        );

      case 'my_listings':
      case 'listings':
        return (
          <MyListingsScreen
            products={products}
            artists={artists}
            activeArtistId={session.activeArtistId}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onAddNewProduct={() => {
              setCurrentScreen('camera_main');
              setActiveTab('camera');
            }}
            onViewProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
          />
        );

      case 'camera_main':
      default:
        return (
          <CameraMainScreen
            activeArtist={activeArtist}
            recentProducts={products.slice(0, 3)}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onTakePhoto={() => setCurrentScreen('camera_capture')}
            onUploadFromGallery={() => {
              setCapturedPhotos(SAMPLE_CAPTURE_PREVIEWS.map(s => s.url));
              setCurrentScreen('ai_processing');
            }}
            onSwitchArtist={() => setCurrentScreen('artist_switcher')}
            onViewProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
            onViewAllListings={() => {
              setCurrentScreen('my_listings');
              setActiveTab('listings');
            }}
          />
        );
    }
  };

  // Screens that should not display the chrome
  const isDedicatedBuyerScreen = session.role === 'buyer' && [
    'buyer_home',
    'marketplace',
    'buyer_search',
    'buyer_categories',
    'buyer_cart',
    'buyer_checkout',
    'buyer_orders',
    'buyer_profile',
    'product_detail',
    'artisan_profile'
  ].includes(currentScreen);

  const hideChromeScreens: ScreenName[] = [
    'splash', 
    'language_select',
    'role_select', 
    'seller_login', 
    'otp_verify', 
    'referral_entry',
    'artist_register', 
    'camera_capture', 
    'ai_processing', 
    'success'
  ];
  const shouldShowChrome = !hideChromeScreens.includes(currentScreen);

  // If Buyer Mode: Render Full-Width Amazon-style marketplace!
  if (isDedicatedBuyerScreen) {
    return (
      <div className="min-h-screen bg-white text-[#111111] font-sans antialiased flex flex-col justify-between">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
            <div className="bg-[#111111] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Amazon-style Sticky Header */}
        <BuyerHeader
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          activeTab={buyerTab}
          onNavigateTab={(tab) => {
            setBuyerTab(tab);
            if (tab === 'home') setCurrentScreen('buyer_home');
            else if (tab === 'categories') setCurrentScreen('buyer_categories');
            else if (tab === 'cart') setCurrentScreen('buyer_cart');
            else if (tab === 'orders') setCurrentScreen('buyer_orders');
            else if (tab === 'profile') setCurrentScreen('buyer_profile');
          }}
          onOpenSearch={() => setCurrentScreen('buyer_search')}
          searchQuery={buyerSearchQuery}
          onSearchChange={setBuyerSearchQuery}
          onSearchSubmit={(q) => {
            setBuyerSearchQuery(q);
            setCurrentScreen('buyer_search');
          }}
          onSwitchToSeller={() => {
            updateSession({ role: 'seller' });
            setCurrentScreen('camera_main');
            setActiveTab('camera');
          }}
        />

        {/* Full-width screen body */}
        <main className="flex-1 w-full bg-white">
          {renderCurrentScreen()}
        </main>

        {/* Amazon-style Bottom Navigation (5 tabs) */}
        <BuyerBottomNav
          activeTab={buyerTab}
          onTabChange={(tab) => {
            setBuyerTab(tab);
            if (tab === 'home') setCurrentScreen('buyer_home');
            else if (tab === 'categories') setCurrentScreen('buyer_categories');
            else if (tab === 'cart') setCurrentScreen('buyer_cart');
            else if (tab === 'orders') setCurrentScreen('buyer_orders');
            else if (tab === 'profile') setCurrentScreen('buyer_profile');
          }}
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        />
      </div>
    );
  }

  // Seller Mode & Onboarding Screens
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-stone-900/95 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10 backdrop-blur-md">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className={getDeviceContainerClass()}>
        {shouldShowChrome && (
          <Header
            role={session.role}
            language={session.language}
            activeArtist={activeArtist}
            tokenBalance={session.tokenBalance}
            isAudioMuted={session.isAudioMuted}
            deviceMode={deviceMode}
            onSwitchRole={(newRole) => {
              updateSession({ role: newRole });
              if (newRole === 'buyer') {
                setCurrentScreen('buyer_home');
                setBuyerTab('home');
              } else {
                setCurrentScreen('camera_main');
                setActiveTab('camera');
              }
            }}
            onChangeLanguage={(lang) => {
              setLanguage(lang);
              updateSession({ language: lang });
            }}
            onToggleAudio={() => updateSession({ isAudioMuted: !session.isAudioMuted })}
            onSwitchArtist={() => setCurrentScreen('artist_switcher')}
            onChangeDeviceMode={setDeviceMode}
            onOpenTokens={() => {
              setCurrentScreen('tokens');
              setActiveTab('tokens');
            }}
          />
        )}

        {/* Layout with Side Navigation for Tablet/Laptop and Bottom Bar for Phone */}
        <div className={shouldShowChrome ? 'flex flex-col md:flex-row' : ''}>
          {shouldShowChrome && (
            <Navigation
              role={session.role}
              activeTab={activeTab}
              language={session.language}
              onTabChange={handleTabChange}
              tokenCount={session.tokenBalance}
            />
          )}

          <main className={`flex-1 ${shouldShowChrome ? 'p-3 sm:p-6' : ''}`}>
            {renderCurrentScreen()}
          </main>
        </div>
      </div>

      {/* Inquiry Modal */}
      {selectedProduct && (
        <SendInquiryModal
          isOpen={isInquiryOpen}
          product={selectedProduct}
          artist={getArtistForProduct(selectedProduct.artistId)}
          onClose={() => setIsInquiryOpen(false)}
          onSubmit={() => {
            showToast(`Inquiry sent to ${activeArtist.name}!`);
          }}
        />
      )}

      {/* Buy Checkout Modal */}
      {selectedProduct && (
        <BuyCheckoutModal
          isOpen={isBuyModalOpen}
          product={selectedProduct}
          artist={getArtistForProduct(selectedProduct.artistId)}
          onClose={() => setIsBuyModalOpen(false)}
          onOrderSuccess={(orderInfo) => {
            handleOrderPlaced({
              id: `ord-${Date.now()}`,
              totalPrice: orderInfo.totalAmount,
              buyerName: orderInfo.buyerName,
              buyerMobile: '+91 98111 22334',
              shippingAddress: 'Saket, New Delhi',
              productTitle: orderInfo.product.title,
              productPrice: orderInfo.product.price,
              productImage: orderInfo.product.image || orderInfo.product.imagePaths?.[0] || '',
              artistId: orderInfo.product.artistId,
              status: 'in_transit',
              createdAt: new Date().toISOString(),
            });
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <KarigharMain />
    </LanguageProvider>
  );
}
