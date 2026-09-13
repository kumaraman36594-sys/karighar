import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, ShieldCheck, MapPin, Award, Plus, Minus } from 'lucide-react';
import { Product, Artist } from '../../types';

interface BuyCheckoutModalProps {
  product: Product;
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderInfo: { product: Product; buyerName: string; totalAmount: number }) => void;
}

export const BuyCheckoutModal: React.FC<BuyCheckoutModalProps> = ({
  product,
  artist,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const [buyerName, setBuyerName] = useState('Ananya Sen');
  const [phone, setPhone] = useState('9711002233');
  const [address, setAddress] = useState('Flat 402, Green Park Avenue');
  const [pinCode, setPinCode] = useState('110016');
  const [cityState, setCityState] = useState('New Delhi, Delhi');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  if (!isOpen) return null;

  const totalAmount = product.price * quantity;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedId = `#KRG-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderDone(true);
      onOrderSuccess({
        product,
        buyerName,
        totalAmount,
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-gray-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {orderDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl">
              🎉
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">
                ऑर्डर सफल! (Order Successful!)
              </h3>
              <p className="text-sm font-bold text-indigo-700 mt-1 font-mono">
                ऑर्डर आईडी: {orderId}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs text-gray-700">
              <p className="font-medium">
                • कारीगर <strong>{artist.name}</strong> ({artist.village}) को आपका ऑर्डर भेज दिया गया है।
              </p>
              <p className="font-medium">
                • ट्रैकिंग SMS आपके नंबर (+91 {phone}) पर भेजा जाएगा।
              </p>
              <p className="text-emerald-700 font-bold">
                • कुल राशि: ₹{totalAmount} ({paymentMethod === 'upi' ? 'UPI द्वारा भुगतान किया' : 'कैश ऑन डिलीवरी'})
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-center gap-2 font-bold">
              <Award className="w-4 h-4 text-purple-600" />
              <span>+5 रिवॉर्ड टोकन कारीगर {artist.name} के खाते में जमा किए गए!</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              बाज़ार पर वापस जाएं (Back to Marketplace)
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <span>🛒 ऑर्डर विवरण (Order Details)</span>
              </h2>
              <p className="text-xs text-gray-500">
                सीधा कारीगर से खरीदें · 100% कारीगर को भुगतान
              </p>
            </div>

            {/* Product Summary */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={product.imagePaths[0]}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      कारीगर: {artist.name} ({artist.village})
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      ₹{product.price} प्रति पीस
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                <span className="font-bold text-gray-700">संख्या (Quantity):</span>
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-xl border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm text-gray-900 w-4 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right font-extrabold text-base text-emerald-600">
                  कुल: ₹{totalAmount}
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    पूरा नाम (Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    फ़ोन (+91) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs font-bold text-gray-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full h-10 pl-11 pr-2 rounded-xl border border-gray-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  पता (Delivery Address) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    पिन कोड (PIN Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    शहर और राज्य (City & State) *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Payment choice */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  भुगतान का तरीका (Payment Method)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/60' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-indigo-600"
                    />
                    <span className="text-xs font-bold text-gray-800">⚡ UPI (Google Pay, PhonePe, Paytm)</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/60' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-indigo-600"
                    />
                    <span className="text-xs font-bold text-gray-800">📦 कैश ऑन डिलीवरी (COD)</span>
                  </label>
                </div>
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg p-1.5 mt-1.5 border border-amber-200 text-center font-medium">
                  ℹ️ डेमो मोड: कोई वास्तविक भुगतान नहीं कटेगा (Demo mode: no real money charged)
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              id="confirm-pay-btn"
              className="w-full h-13 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isProcessing ? 'ऑर्डर दर्ज हो रहा है...' : `✅ ऑर्डर दें (₹${totalAmount})`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
