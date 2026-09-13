import React, { useState } from 'react';
import { X, Send, CheckCircle2, User, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { Product, Artist } from '../../types';

interface SendInquiryModalProps {
  product: Product;
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inquiryData: { name: string; phone: string; quantity: number; message: string }) => void;
}

export const SendInquiryModal: React.FC<SendInquiryModalProps> = ({
  product,
  artist,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('9823456789');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(
    `नमस्ते ${artist.name} जी, मुझे आपका बनाया ${product.title} पसंद आया है।`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    `क्या यह ${product.material || 'प्राकृतिक मिट्टी'} का बना है?`,
    'क्या मुझे दूसरा रंग मिल सकता है?',
    'बनाने में कितना समय लगेगा?',
    'क्या आप मेरे शहर में डिलीवर कर सकते हैं?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmit({ name, phone: `+91 ${phone}`, quantity, message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                संदेश भेजा गया! (Message Sent)
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                कारीगर जल्द ही आपके नंबर पर संपर्क करेंगे
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-sm font-bold transition-colors cursor-pointer"
            >
              बंद करें (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#B4431E]" />
                <span>कारीगर से पूछें</span>
              </h2>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                {artist.name} को सीधा संदेश भेजें
              </p>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={product.imagePaths[0]}
                alt={product.title}
                className="w-14 h-14 rounded-lg object-cover border border-stone-200"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-stone-900 truncate">
                  {product.title}
                </h4>
                <p className="text-xs text-stone-500">
                  कारीगर: {artist.name} ({artist.village})
                </p>
                <p className="text-sm font-bold text-emerald-700">
                  ₹{product.price}
                </p>
              </div>
            </div>

            {/* Quick questions chips */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                त्वरित प्रश्न (Quick Questions)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(prev => prev ? `${prev}\n${q}` : q)}
                    className="text-[11px] font-medium text-stone-800 bg-stone-100 hover:bg-[#B4431E]/10 hover:text-[#B4431E] border border-stone-200 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3 text-stone-400" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  आपका नाम (Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-lg border border-stone-300 text-sm font-medium focus:border-[#B4431E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    फ़ोन नंबर (Phone) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-stone-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full h-11 pl-12 pr-3 rounded-lg border border-stone-300 text-sm font-medium focus:border-[#B4431E] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    संख्या (Quantity)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-lg border border-stone-300 text-sm font-bold text-center focus:border-[#B4431E] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  संदेश (Message)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-stone-300 text-sm font-medium focus:border-[#B4431E] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="submit-inquiry-btn"
              className="w-full h-12 rounded-xl bg-[#B4431E] hover:bg-[#9C3818] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>संदेश भेजें (Send Message)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
