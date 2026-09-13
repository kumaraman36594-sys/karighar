import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem, Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BuyerCartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: Product) => void;
}

export const BuyerCartScreen: React.FC<BuyerCartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
}) => {
  const { t } = useLanguage();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce(
    (acc, item) => acc + Math.round(item.product.price * 1.35) * item.quantity,
    0
  );
  const totalSavings = totalOriginal - subtotal;
  const isFreeDelivery = subtotal >= 499;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none bg-white">
        <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4 text-3xl">
          🛒
        </div>
        <h2 className="text-xl font-bold text-[#111111] mb-1">
          {t('emptyCart')}
        </h2>
        <p className="text-sm text-[#565959] max-w-sm mb-6">
          Support genuine rural Indian artisans by exploring handcrafted sarees, pottery, and art pieces.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-6 py-2.5 rounded-md bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] font-bold text-sm shadow-xs cursor-pointer active:scale-98"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-28 space-y-6 select-none bg-white text-[#111111]">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onContinueShopping}
            className="p-1.5 rounded-md hover:bg-[#F5F5F5] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
            {t('cart')} ({totalItems} {t('items')})
          </h1>
        </div>
        <button
          type="button"
          onClick={onContinueShopping}
          className="text-xs font-bold text-[#FF9900] hover:underline cursor-pointer"
        >
          {t('continueShopping')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free delivery progress banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Your order qualifies for FREE Delivery.</span> Select this option at checkout.
            </div>
          </div>

          {cartItems.map(({ product, quantity }) => {
            const originalPrice = Math.round(product.price * 1.35);
            const displayImage = product.image || (product.imagePaths && product.imagePaths[0]) || '/assets/crafts/blue_pottery_vase.jpg';

            return (
              <div
                key={product.id}
                className="border border-[#DDDDDD] rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4 bg-white hover:shadow-xs transition-shadow"
              >
                {/* Image */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#F5F5F5] rounded-md overflow-hidden cursor-pointer"
                >
                  <img
                    src={displayImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-sm sm:text-base text-[#111111] line-clamp-2 hover:text-[#FF9900] cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#565959] mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#007600]" />
                      <span>{product.artistName || 'Heritage Artisan'}</span>
                      <span>·</span>
                      <span className="text-[#007600] font-semibold">{t('inStock')}</span>
                    </div>
                  </div>

                  {/* Price and Quantity controls */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-[#007600]">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#565959] line-through">
                        ₹{(originalPrice * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#DDDDDD] rounded-md bg-[#F5F5F5]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="p-1 sm:p-1.5 hover:bg-gray-200 transition-colors cursor-pointer text-[#111111]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#111111]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="p-1 sm:p-1.5 hover:bg-gray-200 transition-colors cursor-pointer text-[#111111]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-[#565959] hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                        title={t('remove')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Summary & Checkout Button */}
        <div className="lg:col-span-1">
          <div className="border border-[#DDDDDD] rounded-lg p-4 bg-[#F5F5F5] space-y-4 sticky top-24">
            <div className="space-y-2 border-b border-[#DDDDDD] pb-3 text-xs">
              <div className="flex justify-between text-[#565959]">
                <span>Items ({totalItems}):</span>
                <span>₹{totalOriginal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Artisan Direct Savings:</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>Delivery Charges:</span>
                <span className="text-[#007600] font-bold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-base font-bold text-[#111111]">
              <span>{t('subtotal')}:</span>
              <span className="text-xl font-extrabold text-[#007600]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 rounded-md bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#111111] font-bold text-sm shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              {t('proceedToBuy')} ({totalItems} {t('items')})
            </button>

            <div className="text-[11px] text-[#565959] text-center">
              100% Secure Checkout · Direct payment to artisan cooperative
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
