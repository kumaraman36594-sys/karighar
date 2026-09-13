import React, { useState } from 'react';
import { Plus, Sparkles, Eye, Star, MapPin, Share2, Edit3, MessageSquare } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-6 pb-28 p-3 sm:p-6 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>📦 मेरे उत्पाद (My Products)</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            कारीगर: <strong className="text-gray-800">{activeArtist?.name || 'रमेश कुमार'}</strong> ({activeArtist?.craft || 'मिट्टी के बर्तन · बगरू'})
          </p>
        </div>

        <button
          onClick={onNewProduct}
          id="listings-add-new-btn"
          className="hidden sm:flex px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md items-center gap-1.5 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>➕ नया उत्पाद जोड़ें</span>
        </button>
      </div>

      {shareToast && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl animate-fade-in text-center">
          ✅ {shareToast}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-4 bg-white rounded-3xl border border-gray-200 shadow-xs text-center">
        <div className="p-2">
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block">
            {activeCount}
          </span>
          <span className="text-xs font-bold text-gray-500">सक्रिय (Active)</span>
        </div>
        <div className="p-2 border-x border-gray-100">
          <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 block">
            {salesCount}
          </span>
          <span className="text-xs font-bold text-gray-500">बिक्री (Sales)</span>
        </div>
        <div className="p-2">
          <span className="text-xl sm:text-2xl font-extrabold text-gray-900 block">
            {totalRevenue}
          </span>
          <span className="text-xs font-bold text-gray-500">कुल कमाई (Revenue)</span>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-6 space-y-3">
          <div className="text-4xl">📸</div>
          <h3 className="text-lg font-bold text-gray-900">अभी कोई उत्पाद नहीं है</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            AI कैमरे से केवल 3 फ़ोटो खींचें और अपना पहला हस्तनिर्मित उत्पाद मिनटों में ऑनलाइन बेचें।
          </p>
          <button
            onClick={onNewProduct}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            पहला फ़ोटो लें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <div
              key={product.id}
              onClick={() => onViewProduct(product)}
              id={`seller-product-${product.id}`}
              className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={product.imagePaths[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-bold text-indigo-900 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-emerald-600 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs">
                    ● सक्रिय (Active)
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="text-lg font-extrabold text-emerald-600">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center gap-2.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-0.5">👁 {234 + idx * 45}</span>
                      <span className="flex items-center gap-0.5">💬 {12 + idx * 3}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions: संपादन (Edit) | साझा करें (Share) */}
              <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, product)}
                  className="flex items-center gap-1 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>संपादन (Edit)</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, product.title)}
                  className="flex items-center gap-1 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>साझा करें (Share)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Button for Mobile */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={onNewProduct}
          id="floating-new-product-btn"
          className="h-14 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>➕ नया उत्पाद जोड़ें</span>
        </button>
      </div>
    </div>
  );
};
