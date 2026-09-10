import React, { useState, useEffect } from 'react';
import { Search, PackageCheck, Clock, CheckCircle2, ChevronRight, User, Phone, MapPin, Calendar, ArrowUpRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';

interface OrderTrackerProps {
  initialSearch?: string;
  onNewOrder: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ initialSearch = '', onNewOrder }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = async (term?: string) => {
    const q = (term !== undefined ? term : searchTerm).trim();
    if (!q) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await api.getOrders({ search: q });
      setOrders(results);
      if (results.length === 1) {
        setSelectedOrder(results[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to search orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
      handleSearch(initialSearch);
    } else {
      // Default load recent demo orders for customer Ganesh Kanaki
      api.getOrders({ search: 'Ganesh Kanaki' }).then((res) => {
        setOrders(res);
        if (res.length > 0) setSelectedOrder(res[0]);
        setHasSearched(true);
      });
    }
  }, [initialSearch]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Ready':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Confirmed':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const statusProgression: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Completed'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EE] text-[#1B4332]">
          Customer Order Tracking
        </span>
        <h2 className="text-3xl font-extrabold text-[#1B4332] font-display">
          Track Your Grocery Orders
        </h2>
        <p className="text-sm text-stone-600">
          Search by your Mobile Number, Full Name, or Order Reference (e.g. <code>KKS-001</code>) to view order status and packing updates.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E2D9] shadow-sm max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="order-search-input"
              type="text"
              placeholder="Enter Mobile (e.g. 9876543210) or Order # (e.g. KKS-001)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#D8CFBF] text-sm font-medium focus:outline-hidden focus:border-[#2D6A4F] bg-[#FAF8F5]"
            />
          </div>
          <button
            id="order-search-submit-btn"
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#1B4332] transition-colors"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
          <span className="font-semibold">Quick Search:</span>
          <button
            onClick={() => {
              setSearchTerm('Ganesh Kanaki');
              handleSearch('Ganesh Kanaki');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#EAF5EE] text-stone-800 hover:text-[#1B4332] transition-colors"
          >
            Ganesh Kanaki
          </button>
          <button
            onClick={() => {
              setSearchTerm('9876543210');
              handleSearch('9876543210');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#EAF5EE] text-stone-800 hover:text-[#1B4332] transition-colors"
          >
            9876543210
          </button>
          <button
            onClick={() => {
              setSearchTerm('KKS-001');
              handleSearch('KKS-001');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#EAF5EE] text-stone-800 hover:text-[#1B4332] transition-colors"
          >
            KKS-001
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Orders List (Left Column) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                Found Orders ({orders.length})
              </h3>
              <button
                onClick={onNewOrder}
                className="text-xs font-bold text-[#2D6A4F] hover:underline"
              >
                + Create New
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E8E2D9] text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-stone-700">No orders found</p>
                <p className="text-xs text-stone-500">
                  Please check the mobile number or order reference number and try again.
                </p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#EAF5EE] border-[#2D6A4F] shadow-sm'
                      : 'bg-white border-[#E8E2D9] hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-sm text-[#1B4332]">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <span>{ord.customerName}</span>
                    <span>{ord.orderDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 mt-2 pt-2 border-t border-stone-100">
                    <span>{ord.totalItems} grocery items</span>
                    <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                      {ord.source}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detailed Order View (Right Column) */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D9] shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Order Summary
                    </span>
                    <h3 className="text-xl sm:text-2xl font-mono font-extrabold text-[#1B4332]">
                      {selectedOrder.orderNumber}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Visual Status Progression Bar */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D9] space-y-4">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Packing & Delivery Progress
                  </h4>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {statusProgression.map((st, idx) => {
                      const currentIdx = statusProgression.indexOf(selectedOrder.status);
                      const isPastOrCurrent = currentIdx >= idx;
                      return (
                        <div key={st} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPastOrCurrent
                                ? 'bg-[#2D6A4F] text-white shadow-2xs'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {isPastOrCurrent ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-semibold mt-1.5 ${
                              isPastOrCurrent ? 'text-[#1B4332]' : 'text-stone-600'
                            }`}
                          >
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                  <div>
                    <span className="text-stone-600 block">Customer Name:</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-stone-600 block">Mobile:</span>
                    <span className="font-bold text-stone-900 text-sm">{selectedOrder.mobile}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-600 block">Delivery Address:</span>
                    <span className="font-medium text-stone-800">
                      {selectedOrder.address}, {selectedOrder.city} {selectedOrder.pincode}
                    </span>
                  </div>
                </div>

                {/* Grocery Items List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Packaged Grocery Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="border border-[#E8E2D9] rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-3 w-8">#</th>
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3 w-24 text-center">Qty</th>
                          <th className="py-2.5 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((it, idx) => (
                            <tr key={it.id || idx}>
                              <td className="py-2.5 px-3 text-stone-600">{idx + 1}</td>
                              <td className="py-2.5 px-3 font-semibold text-[#1B4332]">{it.name}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="px-2 py-0.5 rounded-md bg-[#EAF5EE] text-[#2D6A4F] font-bold">
                                  {it.quantity} {it.unit}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-stone-500">{it.notes || '—'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-stone-400">
                              No items recorded
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-[#E8E2D9] text-center text-stone-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <p className="text-sm font-bold text-stone-700">Select an order from the left</p>
                <p className="text-xs text-stone-500 mt-1">
                  Click any order to view full items, status, and delivery details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
