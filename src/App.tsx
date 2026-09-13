import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Artist, 
  Product, 
  ScreenName, 
  DeviceMode,
  TokenTransaction,
  Referral 
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
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';

// Screens
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
import { BuyerHomeScreen } from './components/screens/BuyerHomeScreen';
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

export default function App() {
  // Session & Preferences
  const [session, setSession] = useState(() => StorageService.getSession() || DEFAULT_SESSION);
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
  
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [activeTab, setActiveTab] = useState<string>('camera');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');

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

  // Helper to show notification
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

  // 1. Splash finished handler
  const handleSplashFinish = () => {
    if (!session.hasSelectedLanguage) {
      setCurrentScreen('language_select');
    } else if (!session.hasCompletedOnboarding) {
      setCurrentScreen('role_select');
    } else if (session.role === 'buyer') {
      setCurrentScreen('marketplace');
      setActiveTab('marketplace');
    } else {
      setCurrentScreen('camera_main');
      setActiveTab('camera');
    }
  };

  // 1b. Language Select handler
  const handleSelectLanguage = (lang: Language) => {
    setStoredLanguage(lang);
    updateSession({ language: lang, hasSelectedLanguage: true });
    if (!session.hasCompletedOnboarding) {
      setCurrentScreen('role_select');
    } else if (session.role === 'buyer') {
      setCurrentScreen('marketplace');
      setActiveTab('marketplace');
    } else {
      setCurrentScreen('camera_main');
      setActiveTab('camera');
    }
  };

  // 2. Role Select handler
  const handleSelectRole = (role: UserRole) => {
    updateSession({ role });
    if (role === 'buyer') {
      updateSession({ hasCompletedOnboarding: true });
      setCurrentScreen('marketplace');
      setActiveTab('marketplace');
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
    // If no artist created yet or onboarding incomplete, prompt referral code first
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
      description: `🎁 रेफरल कोड बोनस (${code}) लागू किया`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    updateSession({
      referredBy: code,
      tokenBalance: nextBal,
      totalTokens: nextTot,
    });

    showToast('🎁 +25 टोकन मिले! रेफरल बोनस सफलतापूर्वक लागू।');
    setCurrentScreen('artist_register');
  };

  const handleSkipReferral = () => {
    setCurrentScreen('artist_register');
  };

  // 5. Artist registered
  const handleSaveArtist = (newArtist: Artist) => {
    const isFirstArtist = artists.length === 0;
    const rewardTokens = isFirstArtist ? 10 : 5; // +10 for first, +5 for additional
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
    
    // Add token tx
    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: rewardTokens,
      type: 'credit',
      source: 'onboarding',
      description: isFirstArtist 
        ? `✅ पहला कारीगर जोड़ा (${newArtist.name})` 
        : `✅ नया कारीगर जोड़ा (${newArtist.name})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast(`💰 +${rewardTokens} टोकन मिले! (${newArtist.name} पंजीकृत)`);
    setCurrentScreen('camera_main');
    setActiveTab('camera');
  };

  // 6. Camera Photo Captured
  const handlePhotosCaptured = (photoUrls: string[]) => {
    setCapturedPhotos(photoUrls);
    setCurrentScreen('ai_processing');
  };

  // 7. AI processing finished
  const handleAiProcessingComplete = () => {
    setCurrentScreen('voice_qa');
  };

  // 8. Voice QA finished -> Create pending product draft
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
        price: 0.65, // Low confidence warning as per Section 10
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

    // Update artist product list
    if (activeArtist) {
      const updatedArtist = {
        ...activeArtist,
        productIds: [...activeArtist.productIds, approvedProduct.id],
      };
      setArtists(StorageService.saveArtist(updatedArtist));
    }

    // Award +5 tokens for completing artist listing (photo + voice)
    const nextBal = (session.tokenBalance || 245) + 5;
    updateSession({ tokenBalance: nextBal, totalTokens: (session.totalTokens || 245) + 5 });
    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: 5,
      type: 'credit',
      source: 'listing',
      description: `✅ उत्पाद लिस्टिंग पूर्ण (फ़ोटो + आवाज़): ${approvedProduct.title}`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast('💰 +5 टोकन मिले! (उत्पाद लिस्टिंग पूर्ण)');
    setPendingProduct(approvedProduct);
    setCurrentScreen('success');
  };

  // 10. Buy order success
  const handleOrderSuccess = (orderInfo: { product: Product; buyerName: string; totalAmount: number }) => {
    const isFirstSale = !transactions.some(t => t.source === 'sale');
    const rewardTokens = isFirstSale ? 25 : 5; // +20 first sale bonus + 5 sale
    const nextBal = (session.tokenBalance || 245) + rewardTokens;
    updateSession({ tokenBalance: nextBal, totalTokens: (session.totalTokens || 245) + rewardTokens });

    const newTx: TokenTransaction = {
      id: `tx-${Date.now()}`,
      amount: rewardTokens,
      type: 'credit',
      source: 'sale',
      description: isFirstSale 
        ? `🏆 पहली बिक्री बोनस (+20) एवं बिक्री (+5): ${orderInfo.product.title}`
        : `✅ ${orderInfo.product.title} बिका (क्रेता: ${orderInfo.buyerName})`,
      timestamp: new Date().toISOString(),
    };
    setTransactions(StorageService.addTransaction(newTx));

    showToast(isFirstSale 
      ? `🏆 +${rewardTokens} टोकन! (पहली बिक्री का विशेष रिवॉर्ड)` 
      : `💰 +5 टोकन मिले! (${orderInfo.product.title} बिका)`
    );
  };

  // 11. Redeem tokens
  const handleRedeemTokens = (cost: number, perkTitle: string) => {
    const nextBal = session.tokenBalance - cost;
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

  // 12. Switch tab from navigation
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'camera') setCurrentScreen('camera_main');
    else if (tabId === 'marketplace') setCurrentScreen('marketplace');
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

  // Responsive device container wrapper styles
  const getDeviceContainerClass = () => {
    switch (deviceMode) {
      case 'phone':
        return 'max-w-[420px] mx-auto min-h-screen bg-white shadow-2xl border-x border-gray-300 relative';
      case 'tablet':
        return 'max-w-[820px] mx-auto min-h-screen bg-white shadow-xl border-x border-gray-200 relative';
      case 'laptop':
        return 'max-w-[1240px] mx-auto min-h-screen bg-[#f8f9fe]';
      case 'auto':
      default:
        return 'w-full min-h-screen bg-[#f8f9fe]';
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
              setCurrentScreen('marketplace');
              setActiveTab('marketplace');
            }}
            onCreateAnother={() => {
              setCurrentScreen('camera_main');
              setActiveTab('camera');
            }}
          />
        ) : null;

      case 'product_detail':
        return selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            artist={getArtistForProduct(selectedProduct.artistId)}
            language={session.language}
            isAudioMuted={session.isAudioMuted}
            onBack={() => {
              if (session.role === 'seller') {
                setCurrentScreen('my_listings');
              } else {
                setCurrentScreen('marketplace');
              }
            }}
            onSendInquiry={(prod) => {
              setSelectedProduct(prod);
              setIsInquiryOpen(true);
            }}
            onBuyNow={(prod) => {
              setSelectedProduct(prod);
              setIsBuyModalOpen(true);
            }}
            onViewArtist={(art) => {
              setSelectedArtist(art);
              setCurrentScreen('artisan_profile');
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
                setCurrentScreen('marketplace');
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
            onSelectArtist={(artist) => {
              updateSession({ activeArtistId: artist.id });
              showToast(`Switched active artist to ${artist.name}`);
              setCurrentScreen('camera_main');
              setActiveTab('camera');
            }}
            onAddNewArtist={() => setCurrentScreen('artist_register')}
            onBack={() => setCurrentScreen('camera_main')}
          />
        );

      case 'tokens':
        return (
          <TokenDashboardScreen
            tokenBalance={session.tokenBalance}
            transactions={transactions}
            language={session.language}
            referralCount={session.referralCount || referrals.length || 7}
            referralTier={session.referralTier || 1}
            isAudioMuted={session.isAudioMuted}
            onRedeemTokens={handleRedeemTokens}
            onOpenReferrals={() => setCurrentScreen('referral_dashboard')}
          />
        );

      case 'referral_dashboard':
        return (
          <ReferralDashboardScreen
            language={session.language}
            referralCode={session.referralCode || `KARIGHAR-${activeArtist.name.toUpperCase().replace(/[^A-Z]/g, '') || 'KALA'}-789`}
            referralCount={session.referralCount || referrals.length || 7}
            referralTier={session.referralTier || 1}
            tokensEarned={session.totalTokens || 245}
            referrals={referrals}
            isAudioMuted={session.isAudioMuted}
            onBack={() => {
              setCurrentScreen('tokens');
              setActiveTab('tokens');
            }}
            onOpenTokens={() => {
              setCurrentScreen('tokens');
              setActiveTab('tokens');
            }}
          />
        );

      case 'my_listings':
        return (
          <MyListingsScreen
            products={products.filter(p => p.artistId === activeArtist?.id || p.artistId === 'artist-1')}
            activeArtist={activeArtist}
            language={session.language}
            onNewProduct={() => setCurrentScreen('camera_capture')}
            onViewProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            role={session.role}
            language={session.language}
            activeArtist={activeArtist}
            mobileNumber={session.mobileNumber || '+91 98765 43210'}
            totalArtists={artists.length}
            totalProducts={products.length}
            tokenBalance={session.tokenBalance}
            referralCount={session.referralCount || referrals.length || 7}
            isAudioMuted={session.isAudioMuted}
            onSwitchRole={(newRole) => {
              updateSession({ role: newRole });
              if (newRole === 'buyer') {
                setCurrentScreen('marketplace');
                setActiveTab('marketplace');
              } else {
                setCurrentScreen('camera_main');
                setActiveTab('camera');
              }
            }}
            onChangeLanguage={(lang) => updateSession({ language: lang })}
            onToggleAudio={() => updateSession({ isAudioMuted: !session.isAudioMuted })}
            onResetDemoData={handleResetData}
            onLogout={handleLogout}
            onNavigateToReferrals={() => setCurrentScreen('referral_dashboard')}
            onNavigateToTokens={() => {
              setCurrentScreen('tokens');
              setActiveTab('tokens');
            }}
          />
        );

      case 'marketplace':
      default:
        return (
          <BuyerHomeScreen
            products={products}
            artists={artists}
            language={session.language}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setCurrentScreen('product_detail');
            }}
            onSelectArtist={(art) => {
              setSelectedArtist(art);
              setCurrentScreen('artisan_profile');
            }}
          />
        );

      case 'camera_main':
        return (
          <CameraMainScreen
            activeArtist={activeArtist}
            recentProducts={products.filter(p => p.artistId === activeArtist?.id || p.artistId === 'artist-1')}
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

  // Determine if top header & navigation should be shown
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

  return (
    <div className="min-h-screen bg-[#f1f3f9] text-gray-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-fade-in">
          <div className="bg-gray-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10 backdrop-blur-md">
            <span>✨</span>
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
                setCurrentScreen('marketplace');
                setActiveTab('marketplace');
              } else {
                setCurrentScreen('camera_main');
                setActiveTab('camera');
              }
            }}
            onChangeLanguage={(lang) => updateSession({ language: lang })}
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
          onSubmit={(data) => {
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
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
