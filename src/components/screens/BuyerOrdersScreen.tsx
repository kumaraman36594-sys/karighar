import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  MapPin, 
  Calendar,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Order, Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BuyerOrdersScreenProps {
  orders: Order[];
  onSelectProductById?: (productId: string) => void;
  onContinueShopping: () => void;
}

export const BuyerOrdersScreen: React.FC<BuyerOrdersScreenProps> = ({
  orders,
  onSelectProductById,
  onContinueShopping,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'cancelled'>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_transit') return o.status === 'in_transit' || o.status === 'confirmed' || o.status === 'packed' || o.status === 'shipped';
    if (activeTab === 'delivered') return o.status === 'delivered';
    if (activeTab === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 pb-28 space-y-6 select-none bg-white text-[#111111]">
      <div className="border-b border-[#DDDDDD] pb-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
          {t('orders')}
        </h1>
        <p className="text-xs text-[#565959]">
          Track status and view history of your artisan orders
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DDDDDD] gap-3 sm:gap-8 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
        {[
          { id: 'all', label: t('allOrders') },
          { id: 'in_transit', label: t('inTransit') },
          { id: 'delivered', label: t('delivered') },
          { id: 'cancelled', label: t('cancelled') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#FF9900] text-[#FF9900] font-bold'
                : 'border-transparent text-[#565959] hover:text-[#111111]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#F5F5F5] rounded-lg p-6 border border-[#DDDDDD]">
          <Package className="w-12 h-12 text-[#565959] mx-auto mb-2 opacity-50" />
          <h3 className="font-bold text-sm text-[#111111] mb-1">
            No orders found in this section
          </h3>
          <p className="text-xs text-[#565959] mb-4">
            Browse our handmade collections to support Indian craftspeople.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="px-4 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] rounded-md text-xs font-bold shadow-xs cursor-pointer"
          >
            {t('continueShopping')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';
            const isInTransit = !isDelivered && !isCancelled;

            return (
              <div
                key={order.id}
                className="border border-[#DDDDDD] rounded-lg overflow-hidden bg-white shadow-xs"
              >
                {/* Order Top Bar: Date, Total, Ship To, Order ID */}
                <div className="bg-[#F5F5F5] px-4 py-2.5 border-b border-[#DDDDDD] flex flex-wrap items-center justify-between gap-3 text-xs text-[#565959]">
                  <div className="flex flex-wrap gap-4 sm:gap-8">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#565959]">
                        Order Placed
                      </span>
                      <span className="font-medium text-[#111111]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#565959]">
                        Total
                      </span>
                      <span className="font-bold text-[#007600]">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#565959]">
                        Ship To
                      </span>
                      <span className="font-medium text-[#111111] truncate max-w-[120px] block">
                        {order.buyerName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-[#565959]">
                      Order #{order.id.slice(-6)}
                    </span>
                    <span className="text-[10px] font-mono text-[#565959]">
                      {order.trackingNumber || 'KG2026IN'}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isDelivered && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#007600] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </div>
                      )}
                      {isInTransit && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-[#FF9900] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Truck className="w-3.5 h-3.5" />
                          <span>In Transit · Expected by {order.estimatedDelivery || 'in 3 days'}</span>
                        </div>
                      )}
                      {isCancelled && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelled</span>
                        </div>
                      )}
                    </div>

                    {/* Product Preview Info */}
                    <div className="flex items-center gap-3">
                      {order.productImage && (
                        <img
                          src={order.productImage}
                          alt={order.productTitle || 'Product'}
                          className="w-16 h-16 object-cover rounded-md border border-[#DDDDDD] bg-[#F5F5F5] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">
                          {order.productTitle || 'Handcrafted Heritage Craft'}
                        </h4>
                        <p className="text-xs text-[#565959]">
                          Qty: {order.quantity || 1} · Direct Artisan Dispatch
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="px-4 py-2 rounded-md bg-[#FFD814] hover:bg-[#F7CA00] text-[#111111] font-bold text-xs shadow-xs cursor-pointer text-center"
                    >
                      {t('trackOrder')}
                    </button>
                    <button
                      type="button"
                      onClick={onContinueShopping}
                      className="px-4 py-2 rounded-md border border-[#DDDDDD] hover:bg-[#F5F5F5] text-[#111111] font-semibold text-xs cursor-pointer text-center"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-5 space-y-4 border border-[#DDDDDD] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#111111]">
                  Shipment Tracking
                </h3>
                <span className="text-xs text-[#565959]">
                  AWB: {selectedOrderForTracking.trackingNumber || 'KG10892019IN'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1 rounded-md hover:bg-[#F5F5F5] cursor-pointer text-[#565959]"
              >
                ✕
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 py-2 text-xs">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#111111]">Order Verified with Artisan</div>
                  <div className="text-[#565959]">Handcrafted piece inspected and packed in village cluster.</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#111111]">Picked up by SpeedPost / Rural Courier</div>
                  <div className="text-[#565959]">Dispatched from regional craft hub.</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-[#FF9900] text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                  🚚
                </div>
                <div>
                  <div className="font-bold text-[#111111]">In Transit to Hub</div>
                  <div className="text-[#565959]">Expected doorstep delivery in 2-3 business days.</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 rounded-md bg-[#FF9900] hover:bg-[#e68a00] text-[#111111] font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
