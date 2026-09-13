import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  image: string;
  ctaText: string;
  tag: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'b1',
    badge: '100% Authentic GI Crafts',
    title: 'Handmade with Love',
    subtitle: 'Directly from heritage artisan families across India. No middlemen.',
    bgGradient: 'from-amber-700 via-orange-800 to-rose-900',
    image: '/assets/crafts/blue_pottery_vase.jpg',
    ctaText: 'Explore Crafts',
    tag: 'pottery',
  },
  {
    id: 'b2',
    badge: 'Artisan Direct Festive Discount',
    title: 'Kanjivaram & Banarasi',
    subtitle: 'Pure mulberry silk & zari woven by master weavers with 20% off.',
    bgGradient: 'from-rose-950 via-stone-900 to-amber-950',
    image: '/assets/crafts/kanjivaram_saree.jpg',
    ctaText: 'Shop Sarees',
    tag: 'silk',
  },
  {
    id: 'b3',
    badge: 'Traditional Lost-Wax Casting',
    title: 'Dhokra & Terracotta Heritage',
    subtitle: 'Ancient 4,000-year-old metal casting and handcrafted jewelry.',
    bgGradient: 'from-stone-900 via-amber-950 to-yellow-950',
    image: '/assets/crafts/dhokra_figurine.jpg',
    ctaText: 'View Collection',
    tag: 'metal',
  },
];

interface HeroCarouselProps {
  onBannerClick?: (tag: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBannerClick }) => {
  const { t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-scroll every 5 seconds as specified
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % BANNERS.length);
  };

  const activeBanner = BANNERS[currentIdx];

  return (
    <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-gray-900 select-none">
      {/* Slides */}
      {BANNERS.map((banner, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-between ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Gradient & Backdrop Photo */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient}`} />
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 h-full object-cover opacity-40 md:opacity-50 mix-blend-luminosity mask-gradient-left"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Banner Text Content */}
            <div className="relative z-20 max-w-2xl px-6 sm:px-12 md:px-16 text-white space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF9900]/30 border border-[#FF9900]/50 text-[#FF9900] text-[11px] sm:text-xs font-bold">
                <Sparkles className="w-3 h-3 text-[#FF9900]" />
                <span>{banner.badge}</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-sm">
                {banner.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 max-w-md">
                {banner.subtitle}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBannerClick && onBannerClick(banner.tag)}
                  className="px-4 py-2 rounded-md bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                >
                  <span>{banner.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Chevrons */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 inset-x-0 z-30 flex justify-center items-center gap-2">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === currentIdx
                ? 'w-6 h-2 bg-[#FF9900]'
                : 'w-2 h-2 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
