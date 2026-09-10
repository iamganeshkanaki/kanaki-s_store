import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Star,
  Download,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Lock,
  Eye,
  Calendar,
  Phone,
  FileSpreadsheet,
  Check,
  AlertCircle
} from 'lucide-react';
import { Order, Customer, Feedback, AdminStats, OrderStatus } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'feedback'>('orders');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Selected order modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const checkAuth = () => {
    const token = sessionStorage.getItem('kanaki_admin_auth');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        sessionStorage.setItem('kanaki_admin_auth', res.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(res.message || 'Invalid credentials. Default password is: kanaki2026');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kanaki_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [s, o, c, f] = await Promise.all([
        api.getAdminStats(),
        api.getOrders(),
        api.getCustomers(),
        api.getFeedback(),
      ]);
      setStats(s);
      setOrders(o);
      setCustomers(c);
      setFeedbacks(f);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchDashboardData();
      if (inspectOrder && inspectOrder.id === orderId) {
        setInspectOrder((prev) => (prev ? { ...prev, status: newStatus as OrderStatus } : null));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.mobile.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-3xl border border-[#E8E2D9] shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF5EE] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1B4332] font-display">
              Store Owner & Admin Portal
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Secure login for Ganesh Kanaki & Store Managers to manage orders and download Excel workbooks.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                placeholder="Enter password (default: kanaki2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D8CFBF] text-sm focus:outline-hidden focus:border-[#2D6A4F] bg-[#FAF8F5]"
                required
              />
              <p className="text-[11px] text-stone-600 mt-1">
                Hint for demo: <code>kanaki2026</code>
              </p>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-sm shadow-md hover:bg-[#1B4332] transition-colors"
            >
              {isLoggingIn ? 'Verifying...' : 'Log In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF5EE] text-[#1B4332] mb-1">
            Store Owner Control Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] font-display">
            Kanaki's Store Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time synchronization with PostgreSQL database and <code>kanakis_store_orders.xlsx</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-[#D8CFBF] text-stone-700 hover:bg-[#FAF8F5] transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Master Excel Download Button */}
          <a
            id="admin-download-excel-master-btn"
            href={api.getExcelDownloadUrl('all')}
            download="kanakis_store_orders.xlsx"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white font-bold text-xs shadow-sm hover:bg-[#081C15] transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#95D5B2]" />
            <span>Download Excel Report (.xlsx)</span>
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1B4332]">{stats?.totalCustomers || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1B4332]">{stats?.totalOrders || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's</span>
            <TrendingUp className="w-4 h-4 text-[#40916C]" />
          </div>
          <p className="text-2xl font-extrabold text-[#40916C]">{stats?.todayOrders || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Items</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900">{stats?.totalGroceryItems || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-extrabold text-orange-600">{stats?.pendingOrders || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{stats?.completedOrders || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-stone-800">{stats?.avgRating || '5.0'} ★</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-2 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-[#1B4332] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'customers'
              ? 'bg-[#1B4332] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Customer Directory ({customers.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'feedback'
              ? 'bg-[#1B4332] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Feedback Submissions ({feedbacks.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* ORDERS TAB */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer, mobile, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8CFBF] text-xs font-medium focus:outline-hidden focus:border-[#2D6A4F] bg-[#FAF8F5]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
              {['All', 'Pending', 'Confirmed', 'Processing', 'Ready', 'Completed', 'Cancelled'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Orders Table (Section 13) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[750px]">
              <thead className="bg-[#FAF9F5] border-y border-stone-200 font-bold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400 font-medium">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#1B4332]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-900">{ord.customerName}</td>
                      <td className="py-3 px-3 text-stone-600">{ord.mobile}</td>
                      <td className="py-3 px-3 text-stone-500">{ord.orderDate}</td>
                      <td className="py-3 px-3 font-bold text-stone-700">{ord.totalItems} items</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                          {ord.source}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`font-bold text-[11px] px-2 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.status === 'Ready'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : ord.status === 'Processing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : ord.status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-stone-50 text-stone-800 border-stone-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setInspectOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-[#EAF5EE] text-[#1B4332] font-bold text-[11px] hover:bg-[#D8F3DC] transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMER DIRECTORY TAB */}
      {/* ========================================================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-[#1B4332]">Registered Store Customers</h3>
            <span className="text-xs text-stone-500">Total: {customers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[650px]">
              <thead className="bg-[#FAF9F5] border-y border-stone-200 font-bold text-stone-600">
                <tr>
                  <th className="py-3 px-3">Customer ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Mobile</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Address</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3 text-right">Excel Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-[#1B4332]">{c.id}</td>
                    <td className="py-3 px-3 font-semibold text-stone-900">{c.name}</td>
                    <td className="py-3 px-3">{c.mobile}</td>
                    <td className="py-3 px-3 text-stone-500">{c.email || '—'}</td>
                    <td className="py-3 px-3 text-stone-600">{c.address}</td>
                    <td className="py-3 px-3">{c.city || 'Hubballi'}</td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={api.getExcelDownloadUrl(undefined, c.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#2D6A4F] font-bold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FEEDBACK TAB */}
      {/* ========================================================= */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-[#1B4332]">All Customer Feedback</h3>
            <span className="text-xs text-stone-500">{feedbacks.length} Submissions</span>
          </div>

          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{fb.customerName}</span>
                    <span className="text-stone-500">({fb.mobile})</span>
                    {fb.orderNumber && (
                      <span className="font-mono bg-stone-200 px-1.5 py-0.5 rounded-sm font-semibold">
                        {fb.orderNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-700 italic">"{fb.feedback}"</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    {fb.rating} ★
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    {fb.createdAt ? fb.createdAt.slice(0, 10) : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E8E2D9] shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="text-xl font-mono font-extrabold text-[#1B4332]">
                  {inspectOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
              <div>
                <span className="text-stone-500 block">Customer:</span>
                <span className="font-bold text-stone-900">{inspectOrder.customerName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Mobile:</span>
                <span className="font-bold text-stone-900">{inspectOrder.mobile}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block">Delivery Address:</span>
                <span className="font-medium text-stone-800">{inspectOrder.address}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Grocery Items ({inspectOrder.items?.length || 0})
              </h4>
              <div className="max-h-56 overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 font-bold text-stone-600">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3 text-center">Quantity</th>
                      <th className="py-2 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inspectOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold text-[#1B4332]">{it.name}</td>
                        <td className="py-2 px-3 text-center font-bold">
                          {it.quantity} {it.unit}
                        </td>
                        <td className="py-2 px-3 text-stone-500">{it.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-stone-700">Update Status:</span>
                <select
                  value={inspectOrder.status}
                  onChange={(e) => handleStatusChange(inspectOrder.id, e.target.value)}
                  className="font-bold text-xs p-1.5 rounded-lg border border-stone-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setInspectOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
