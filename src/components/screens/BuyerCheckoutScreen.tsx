import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';
import { CartItem, Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BuyerCheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const BuyerCheckoutScreen: React.FC<BuyerCheckoutScreenProps> = ({
  cartItems,
  onBack,
  onOrderPlaced,
}) => {
  const { t } = useLanguage();

  const [buyerName, setBuyerName] = useState('Ananya Gupta');
  const [buyerMobile, setBuyerMobile] = useState('+91 98111 22334');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Lotus Heights, Saket, New Delhi 110017');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!buyerName || !buyerMobile || !shippingAddress) {
      alert('Please enter complete shipping details.');
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        items: cartItems,
        totalPrice: subtotal,
        buyerName,
        buyerMobile,
        shippingAddress,
        paymentMethod,
        status: 'in_transit',
        trackingNumber: `KG${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        createdAt: new Date().toISOString(),
        productTitle: cartItems[0]?.product.title || 'Handcrafted Art',
        productPrice: subtotal,
        productImage: cartItems[0]?.product.image || cartItems[0]?.product.imagePaths?.[0] || '',
        artistId: cartItems[0]?.product.artistId || 'artist-1',
        quantity: totalItems,
      };

      onOrderPlaced(newOrder);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-28 space-y-6 select-none bg-white text-[#111111]">
      {/* Top Bar */}
      <div className="flex items-center gap-3 border-b border-[#DDDDDD] pb-3">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-md hover:bg-[#F5F5F5] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
            Checkout
          </h1>
          <p className="text-xs text-[#565959]">
            Secure checkout · Direct payment to artisan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Delivery Address */}
          <div className="border border-[#DDDDDD] rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 border-b border-[#DDDDDD] pb-2 text-sm font-bold text-[#111111]">
              <MapPin className="w-4 h-4 text-[#FF9900]" />
              <span>1. Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#565959] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[#DDDDDD] text-xs font-medium focus:border-[#FF9900] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#565959] block mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={buyerMobile}
                  onChange={(e) => setBuyerMobile(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-[#DDDDDD] text-xs font-medium focus:border-[#FF9900] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#565959] block mb-1">
                  Street Address & Pincode
                </label>
                <textarea
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#DDDDDD] text-xs font-medium focus:border-[#FF9900] focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="border border-[#DDDDDD] rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 border-b border-[#DDDDDD] pb-2 text-sm font-bold text-[#111111]">
              <CreditCard className="w-4 h-4 text-[#FF9900]" />
              <span>2. Payment Method</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)', icon: Smartphone },
                { id: 'Card', label: 'Credit or Debit Card (Visa, MasterCard, RuPay)', icon: CreditCard },
                { id: 'COD', label: 'Cash on Delivery (Pay at doorstep)', icon: Banknote },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#FF9900] bg-amber-50/50'
                        : 'border-[#DDDDDD] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id as any)}
                      className="accent-[#FF9900]"
                    />
                    <Icon className="w-4 h-4 text-[#565959]" />
                    <span className="text-xs font-semibold text-[#111111]">
                      {method.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Items Review */}
          <div className="border border-[#DDDDDD] rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-2 text-sm font-bold text-[#111111]">
              <span>3. Review Items ({totalItems})</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Estimated: 3-5 days delivery</span>
              </span>
            </div>

            <div className="divide-y divide-[#F5F5F5] max-h-56 overflow-y-auto">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="py-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={product.image || product.imagePaths?.[0] || ''}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-sm shrink-0"
                    />
                    <span className="truncate font-medium">{product.title}</span>
                  </div>
                  <div className="shrink-0 font-bold">
                    {quantity} × ₹{product.price} = <span className="text-[#007600]">₹{quantity * product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Summary Card */}
        <div className="lg:col-span-1">
          <div className="border border-[#DDDDDD] rounded-lg p-4 bg-[#F5F5F5] space-y-4 sticky top-24">
            <h3 className="font-bold text-sm text-[#111111] border-b border-[#DDDDDD] pb-2">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#565959]">
                <span>Items ({totalItems}):</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>Shipping & Delivery:</span>
                <span className="text-[#007600] font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>Estimated Taxes (GST):</span>
                <span>Included</span>
              </div>
            </div>

            <div className="border-t border-[#DDDDDD] pt-3 flex justify-between items-baseline text-base font-bold text-[#111111]">
              <span>Order Total:</span>
              <span className="text-xl font-extrabold text-[#007600]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full py-3 rounded-md bg-[#FFA41C] hover:bg-[#e69113] text-[#111111] font-extrabold text-sm shadow-sm cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isPlacing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>{t('placeOrder')}</span>
              )}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-[#565959] bg-white p-2 rounded-md border border-[#DDDDDD]">
              <ShieldCheck className="w-4 h-4 text-[#007600] shrink-0" />
              <span>Safe & direct payments supporting rural Indian craft communities.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
