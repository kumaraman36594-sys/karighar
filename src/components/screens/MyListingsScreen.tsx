import React, { useState } from 'react';
import { Plus, Eye, Share2, Edit3, MessageSquare, Package, CheckCircle2, Camera } from 'lucide-react';
import { Product, Artist, Language } from '../../types';
import { TRANSLATIONS } from '../../utils/translations';

interface MyListingsScreenProps {
  products: Product[];
  activeArtist?: Artist;
  language: Language;
  onNewProduct: () => void;
  onViewProduct: (product: Product) => void;
}

export const MyListingsScreen: React.FC<MyListingsScreenProps> = ({
  products,
  activeArtist,
  language,
  onNewProduct,
  onViewProduct,
}) => {
  const t = TRANSLATIONS[language];
  const [shareToast, setShareToast] = useState('');

  const activeCount = products.length || 12;
  const salesCount = activeArtist?.salesCount || 47;
  const totalRevenue = activeArtist?.totalEarned ? `₹${activeArtist.totalEarned.toLocaleString()}` : '₹28,500';

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setShareToast(`लिंक कॉपी हो गया: ${title}`);
    setTimeout(() => setShareToast(''), 3000);
  };

  const handleEdit = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onViewProduct(product);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 space-y-4 sm:space-y-6 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2 sm:gap-2.5">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#B4431E]" />
            <span>मेरे उत्पाद (My Products)</span>
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            कारीगर: <strong className="text-stone-800">{activeArtist?.name || 'रमेश कुमार'}</strong> ({activeArtist?.craft || 'मिट्टी के बर्तन · बगरू'})
          </p>
        </div>

        <button
          type="button"
          onClick={onNewProduct}
          id="listings-add-new-btn"
          className="hidden sm:flex px-4 py-2.5 rounded-xl bg-[#B4431E] hover:bg-[#963717] text-white font-bold text-xs shadow-xs items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>नया उत्पाद जोड़ें</span>
        </button>
      </div>

      {shareToast && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 p-2.5 sm:p-4 bg-white rounded-xl border border-stone-200 shadow-xs text-center">
        <div className="p-1 sm:p-2">
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-700 block">
            {activeCount}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 truncate block">सक्रिय</span>
        </div>
        <div className="p-1 sm:p-2 border-x border-stone-100">
          <span className="text-lg sm:text-2xl font-extrabold text-[#B4431E] block">
            {salesCount}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 truncate block">बिक्री</span>
        </div>
        <div className="p-1 sm:p-2">
          <span className="text-lg sm:text-2xl font-extrabold text-stone-900 block truncate">
            {totalRevenue}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-stone-500 truncate block">कुल कमाई</span>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#B4431E] mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">अभी कोई उत्पाद नहीं है</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            AI कैमरे से केवल 3 फ़ोटो खींचें और अपना पहला हस्तनिर्मित उत्पाद मिनटों में ऑनलाइन बेचें।
          </p>
          <button
            type="button"
            onClick={onNewProduct}
            className="px-5 py-2.5 rounded-xl bg-[#B4431E] hover:bg-[#963717] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            पहला फ़ोटो लें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, idx) => (
            <div
              key={product.id}
              onClick={() => onViewProduct(product)}
              id={`seller-product-${product.id}`}
              className="bg-white rounded-xl border border-stone-200 hover:border-[#B4431E]/60 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={product.imagePaths[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-stone-800 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs border border-stone-200">
                    {product.category}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-emerald-700 px-2 py-0.5 rounded-md shadow-xs">
                    ● सक्रिय
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-[#B4431E] transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                    <span className="text-lg font-extrabold text-stone-900">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-stone-400" />
                        {234 + idx * 45}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                        {12 + idx * 3}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-2.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, product)}
                  className="flex items-center gap-1 hover:text-[#B4431E] px-2 py-1 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>संपादन</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, product.title)}
                  className="flex items-center gap-1 hover:text-[#B4431E] px-2 py-1 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>साझा करें</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Button for Mobile */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          type="button"
          onClick={onNewProduct}
          id="floating-new-product-btn"
          className="h-13 px-5 rounded-xl bg-[#B4431E] hover:bg-[#963717] text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-98"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>नया उत्पाद जोड़ें</span>
        </button>
      </div>
    </div>
  );
};
