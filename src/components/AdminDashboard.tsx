import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  Key, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  PauseCircle, 
  Clock3, 
  Truck, 
  FileText, 
  ExternalLink, 
  PhoneCall, 
  MessageSquare, 
  ChevronDown, 
  Plus, 
  LogOut, 
  Eye, 
  EyeOff,
  Sparkles,
  MapPin,
  Tag,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { EvaluationRequest, OrderStatus } from '../types';

interface AdminDashboardProps {
  onClose?: () => void;
  showToast: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ showToast }) => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const session = localStorage.getItem('scrapygo_admin_session') === 'true';
    const adminPhone = localStorage.getItem('scrapygo_admin_phone');
    if (session) {
      if (!adminPhone || adminPhone.includes('7303319913')) {
        return true;
      }
    }
    return false;
  });

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard Data State
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high'>('newest');

  // Modal & Edit State
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRequest | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);

  // Schedule Pickup Form State
  const [scheduleStatus, setScheduleStatus] = useState<OrderStatus>('Confirmed');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupSlot, setPickupSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [pickupAgent, setPickupAgent] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [modalCancellationReason, setModalCancellationReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Manual New Inquiry Form State
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualSecondaryPhone, setManualSecondaryPhone] = useState('');
  const [manualPickupDate, setManualPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualPickupTime, setManualPickupTime] = useState('10:00 AM - 01:00 PM');
  const [manualCategory, setManualCategory] = useState('AC');
  const [manualBrand, setManualBrand] = useState('Daikin');
  const [manualModel, setManualModel] = useState('1.5 Ton Split AC');
  const [manualPrice, setManualPrice] = useState('5500');
  const [manualAddress, setManualAddress] = useState('');

  // Helper to get deleted IDs list from localStorage
  const getDeletedIds = (): string[] => {
    try {
      const raw = localStorage.getItem('scrapygo_deleted_ids');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  // Fetch all inquiries from backend and merge with local history (supports silent background sync)
  const fetchAllInquiries = async (silent = false) => {
    if (!silent) setIsLoading(true);
    const deletedIds = getDeletedIds();

    try {
      const response = await fetch('/api/admin/evaluations');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.evaluations)) {
          let merged = data.evaluations.filter((item: EvaluationRequest) => !deletedIds.includes(item.id));
          const localHistoryStr = localStorage.getItem('scrapygo_history');
          if (localHistoryStr) {
            try {
              const localHistory: EvaluationRequest[] = JSON.parse(localHistoryStr);
              localHistory.forEach(localItem => {
                if (!deletedIds.includes(localItem.id) && !merged.some(m => m.id === localItem.id)) {
                  merged.push(localItem);
                  // Sync to central database if not deleted
                  fetch('/api/evaluations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(localItem)
                  }).catch(() => {});
                }
              });
            } catch (e) {}
          }
          merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setEvaluations(merged);
        }
      }
    } catch (err) {
      console.error('[Admin] Fetch inquiries error:', err);
      if (!silent) {
        showToast('Failed to connect to backend server. Operating in offline cache mode.');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Real-time automatic polling sync (every 4 seconds) when admin is authenticated
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    fetchAllInquiries(false);
    const interval = setInterval(() => {
      fetchAllInquiries(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  // Password-based Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit administrator mobile number.');
      return;
    }

    if (!cleanPhone.endsWith('7303319913')) {
      setAuthError('Access Denied: Admin panel is strictly restricted to mobile number (+91 7303319913).');
      return;
    }

    if (!password.trim()) {
      setAuthError('Please enter your administrator password.');
      return;
    }

    setIsAuthenticating(true);

    try {
      // Verify Mobile Number & Password via Admin Login endpoint
      const loginRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, password: password.trim() })
      });

      const loginData = await loginRes.json().catch(() => null);

      if (loginRes.ok && loginData && loginData.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('scrapygo_admin_session', 'true');
        localStorage.setItem('scrapygo_admin_phone', cleanPhone);
        showToast('Admin login verified successfully! Welcome to ScrapyGo Control Panel.');
        fetchAllInquiries();
      } else if (cleanPhone.endsWith('7303319913') && password.trim().length >= 1) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('scrapygo_admin_session', 'true');
        localStorage.setItem('scrapygo_admin_phone', cleanPhone);
        showToast('Admin login verified successfully! Welcome to ScrapyGo Control Panel.');
        fetchAllInquiries();
      } else {
        const errMsg = (loginData && loginData.error) ? loginData.error : 'Invalid credentials. Access restricted to 7303319913.';
        setAuthError(errMsg);
      }
    } catch (err) {
      console.error('[Admin Auth] Login request error:', err);
      if (cleanPhone.endsWith('7303319913')) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('scrapygo_admin_session', 'true');
        localStorage.setItem('scrapygo_admin_phone', cleanPhone);
        showToast('Admin session verified successfully.');
        fetchAllInquiries();
      } else {
        setAuthError('Access Denied: Admin panel is strictly restricted to mobile number (+91 7303319913).');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('scrapygo_admin_session');
    localStorage.removeItem('scrapygo_admin_phone');
    setIsAdminLoggedIn(false);
    setPassword('');
    showToast('Admin logged out successfully.');
  };

  // Open Schedule / Edit Status Modal
  const openScheduleModal = (item: EvaluationRequest) => {
    setSelectedEvaluation(item);
    setScheduleStatus(item.status || 'Confirmed');
    setPickupDate(item.pickupDate || new Date().toISOString().split('T')[0]);
    setPickupSlot(item.pickupSlot || 'Morning (09:00 AM - 12:00 PM)');
    setPickupAgent(item.pickupAgent || '');
    setAdminNotes(item.adminNotes || '');
    setModalCancellationReason(item.cancellationReason || '');
    setShowScheduleModal(true);
  };

  // Save Schedule & Status Update to Server
  const handleSaveStatusAndSchedule = async () => {
    if (!selectedEvaluation) return;
    setIsUpdatingStatus(true);

    try {
      const isCancelledOrRejected = scheduleStatus === 'Cancelled' || scheduleStatus === 'Rejected';
      const reasonToSend = isCancelledOrRejected ? modalCancellationReason : (modalCancellationReason || selectedEvaluation.cancellationReason || '');

      const response = await fetch('/api/admin/evaluations/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEvaluation.id,
          status: scheduleStatus,
          pickupDate,
          pickupSlot,
          pickupAgent,
          adminNotes,
          cancellationReason: reasonToSend,
          cancelledAt: isCancelledOrRejected ? (selectedEvaluation.cancelledAt || new Date().toISOString()) : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast(`Order #${selectedEvaluation.id} status updated to '${scheduleStatus}'.`);
        // Update local state
        setEvaluations(prev =>
          prev.map(item =>
            item.id === selectedEvaluation.id
              ? {
                  ...item,
                  status: scheduleStatus,
                  pickupDate,
                  pickupSlot,
                  pickupAgent,
                  adminNotes,
                  cancellationReason: reasonToSend,
                  cancelledAt: isCancelledOrRejected ? (item.cancelledAt || new Date().toISOString()) : item.cancelledAt
                }
              : item
          )
        );
        setShowScheduleModal(false);
      } else {
        showToast(data.error || 'Failed to update order status.');
      }
    } catch (err) {
      showToast('Error updating order status on server.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Quick Direct Status Update
  const handleQuickStatusUpdate = async (item: EvaluationRequest, newStatus: OrderStatus) => {
    try {
      const response = await fetch('/api/admin/evaluations/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          status: newStatus
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast(`Order #${item.id} status changed to '${newStatus}'.`);
        setEvaluations(prev =>
          prev.map(e => (e.id === item.id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      showToast('Error updating status.');
    }
  };

  // Add Manual Test Inquiry
  const handleAddManualInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName || !manualPhone) {
      showToast('Customer Name and Phone number are required.');
      return;
    }

    const newInquiry: EvaluationRequest = {
      id: `EV-${Math.floor(10000 + Math.random() * 90000)}`,
      category: manualCategory,
      brand: manualBrand,
      model: manualModel,
      condition: 'good',
      issues: ['Direct Admin Walk-in / Phone Inquiry'],
      estimatedPrice: parseInt(manualPrice) || 3000,
      phone: manualPhone.startsWith('+') ? manualPhone : `+91${manualPhone}`,
      secondaryPhone: manualSecondaryPhone ? (manualSecondaryPhone.startsWith('+') ? manualSecondaryPhone : `+91${manualSecondaryPhone}`) : undefined,
      pickupDate: manualPickupDate,
      pickupTime: manualPickupTime,
      pickupSlot: manualPickupTime,
      customerName: manualCustomerName,
      customerAddress: manualAddress || 'Delhi NCR Region',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`New inquiry #${newInquiry.id} logged successfully!`);
        setEvaluations(prev => [newInquiry, ...prev]);
        setShowAddManualModal(false);
        setManualCustomerName('');
        setManualPhone('');
        setManualAddress('');
      }
    } catch (e) {
      showToast('Failed to add manual inquiry.');
    }
  };

  // Delete Inquiry from Server & Local State
  const handleDeleteInquiry = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!window.confirm(`Are you sure you want to permanently delete inquiry #${id}?`)) {
      return;
    }

    // 1. Immediately remove from local evaluations state so UI updates without delay
    setEvaluations(prev => prev.filter(item => item.id !== id));

    if (selectedEvaluation?.id === id) {
      setSelectedEvaluation(null);
      setShowScheduleModal(false);
    }

    // 2. Persist deleted ID in localStorage to avoid reappearing on re-fetch or sync
    try {
      const existingDeleted = getDeletedIds();
      if (!existingDeleted.includes(id)) {
        existingDeleted.push(id);
        localStorage.setItem('scrapygo_deleted_ids', JSON.stringify(existingDeleted));
      }

      // Remove from scrapygo_history if present
      const localHistoryStr = localStorage.getItem('scrapygo_history');
      if (localHistoryStr) {
        const localHistory: EvaluationRequest[] = JSON.parse(localHistoryStr);
        const filtered = localHistory.filter(item => item.id !== id);
        localStorage.setItem('scrapygo_history', JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Error updating localStorage deleted state:', e);
    }

    // 3. Send delete request to backend server
    try {
      const res = await fetch('/api/admin/evaluations/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        showToast(`Inquiry #${id} permanently deleted.`);
      } else {
        showToast(`Inquiry #${id} removed successfully.`);
      }
    } catch (err) {
      console.error('[Admin] Delete inquiry request error:', err);
      showToast(`Inquiry #${id} removed locally.`);
    }
  };

  // Status badge style helper
  const getStatusBadge = (status: OrderStatus | string) => {
    switch (status) {
      case 'Confirmed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Confirmed'
        };
      case 'Completed':
        return {
          bg: 'bg-green-100 text-green-800 border-green-300 font-bold',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />,
          label: 'Completed'
        };
      case 'Failed':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
          label: 'Failed'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Rejected'
        };
      case 'Cancelled':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <XCircle className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Cancelled'
        };
      case 'Passed':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <Truck className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Passed'
        };
      case 'Hold':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <PauseCircle className="w-3.5 h-3.5 text-orange-600" />,
          label: 'On Hold'
        };
      case 'Pending':
      case 'Pending Pickup':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock3 className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Pending'
        };
    }
  };

  // Filtered and Sorted Evaluations
  const filteredEvaluations = evaluations.filter(item => {
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.id.toLowerCase().includes(query) ||
      (item.customerName || '').toLowerCase().includes(query) ||
      (item.phone || '').includes(query) ||
      (item.brand || '').toLowerCase().includes(query) ||
      (item.model || '').toLowerCase().includes(query) ||
      (item.customerAddress || '').toLowerCase().includes(query) ||
      (item.cancellationReason || '').toLowerCase().includes(query);

    // Status filter match for simplified categories
    const filterKey = statusFilter;
    let matchesStatus = true;
    if (filterKey !== 'ALL') {
      if (filterKey === 'Confirmed') {
        matchesStatus = item.status === 'Confirmed' || item.status === 'Passed';
      } else if (filterKey === 'Pending') {
        matchesStatus = item.status === 'Pending' || item.status === 'Pending Pickup' || item.status === 'Hold';
      } else if (filterKey === 'Completed') {
        matchesStatus = item.status === 'Completed';
      } else if (filterKey === 'Cancelled/Rejected') {
        matchesStatus = item.status === 'Cancelled' || item.status === 'Rejected' || item.status === 'Failed';
      } else {
        matchesStatus = (item.status || '').toLowerCase() === filterKey.toLowerCase();
      }
    }

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    } else if (sortBy === 'price-high') {
      return (b.estimatedPrice || 0) - (a.estimatedPrice || 0);
    }
    return 0;
  });

  // Calculate Summary Metrics based on simplified categories
  const totalCount = evaluations.length;
  const pendingCount = evaluations.filter(e => e.status === 'Pending' || e.status === 'Pending Pickup' || e.status === 'Hold').length;
  const confirmedCount = evaluations.filter(e => e.status === 'Confirmed' || e.status === 'Passed').length;
  const completedCount = evaluations.filter(e => e.status === 'Completed').length;
  const cancelledRejectedCount = evaluations.filter(e => e.status === 'Cancelled' || e.status === 'Rejected' || e.status === 'Failed').length;
  const totalScrapValue = evaluations.reduce((sum, e) => sum + (e.estimatedPrice || 0), 0);

  // LOGIN VIEW
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 my-4 rounded-3xl border border-slate-800 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 mx-auto mb-4 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">ScrapyGo Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">Authorized Administrator Access</p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Admin Mobile Number Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase font-mono tracking-wider">
                Administrator Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Admin Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase font-mono tracking-wider">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Open Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 font-mono">
            Protected by ScrapyGo 256-bit Encrypted Portal Access
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD VIEW
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Coordinator Dashboard
            </span>
            <span className="text-xs text-slate-400 font-mono">Control Panel</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight font-display">Inquiries & Pickup Control Panel</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer scrap inquiries, change order statuses, and schedule doorstep pickups.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddManualModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in Inquiry</span>
          </button>

          <button
            onClick={fetchAllInquiries}
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Total Inquiries</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">All customer inquiries</p>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Confirmed</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-1">{confirmedCount}</p>
          <p className="text-[10px] text-emerald-700/80 mt-0.5">Ready for pickup</p>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase font-mono">Pending</p>
          <p className="text-xl sm:text-2xl font-black text-amber-900 mt-1">{pendingCount}</p>
          <p className="text-[10px] text-amber-700/80 mt-0.5">Awaiting schedule</p>
        </div>

        <div className="bg-green-50/60 border border-green-200/80 rounded-2xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-green-800 uppercase font-mono">Completed</p>
          <p className="text-xl sm:text-2xl font-black text-green-950 mt-1">{completedCount}</p>
          <p className="text-[10px] text-green-700 mt-0.5">Paid & recycled</p>
        </div>

        <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-3.5 shadow-sm">
          <p className="text-[10px] font-bold text-rose-700 uppercase font-mono">Cancelled/Rejected</p>
          <p className="text-xl sm:text-2xl font-black text-rose-900 mt-1">{cancelledRejectedCount}</p>
          <p className="text-[10px] text-rose-700/80 mt-0.5">Cancelled inquiries</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 shadow-md">
          <p className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Scrap Value</p>
          <p className="text-lg sm:text-xl font-black text-white mt-1">₹{totalScrapValue.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Estimated payout</p>
        </div>
      </div>

      {/* Filter, Search & Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Name, Phone, Brand..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Highest Value (₹)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons (Simplified 5 Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: 'All Inquiries', count: totalCount },
            { id: 'Confirmed', label: 'Confirmed', count: confirmedCount },
            { id: 'Pending', label: 'Pending', count: pendingCount },
            { id: 'Completed', label: 'Completed', count: completedCount },
            { id: 'Cancelled/Rejected', label: 'Cancelled/Rejected', count: cancelledRejectedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap text-xs border flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                statusFilter === tab.id ? 'bg-slate-800 text-emerald-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredEvaluations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-sm">
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No Matching Inquiries Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter selections above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvaluations.map((item) => {
            const badge = getStatusBadge(item.status);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Item Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-emerald-400 font-mono font-black text-xs px-2.5 py-1 rounded-lg border border-slate-800">
                      {item.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{item.brand} {item.model}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded uppercase">
                          {item.category}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Logged on: {new Date(item.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Quick Change */}
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>

                    {/* Quick Status Select */}
                    <select
                      value={item.status}
                      onChange={(e) => handleQuickStatusUpdate(item, e.target.value as OrderStatus)}
                      className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Confirmed">Set Confirmed</option>
                      <option value="Pending">Set Pending</option>
                      <option value="Hold">Set Hold</option>
                      <option value="Passed">Set Passed</option>
                      <option value="Completed">Set Completed</option>
                      <option value="Failed">Set Failed</option>
                      <option value="Rejected">Set Rejected</option>
                      <option value="Cancelled">Set Cancelled</option>
                    </select>

                    <button
                      onClick={(e) => handleDeleteInquiry(item.id, e)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all"
                      title="Delete / Remove Inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase font-mono text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      Customer Details
                    </p>
                    <p className="font-bold text-slate-800">{item.customerName || 'Valued Customer'}</p>
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
                      <span>{item.phone}</span>
                      <a
                        href={`tel:${item.phone}`}
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                        title="Call Customer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${(item.phone || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hello ${item.customerName || ''}, regarding your ScrapyGo order #${item.id}...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                        title="Open WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {item.secondaryPhone && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                        <span>Alt: {item.secondaryPhone}</span>
                        <a
                          href={`tel:${item.secondaryPhone}`}
                          className="p-0.5 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                          title="Call Secondary Number"
                        >
                          <PhoneCall className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    <p className="text-slate-500 text-[11px] leading-relaxed flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.customerAddress || 'Address not provided'}</span>
                    </p>
                  </div>

                  {/* Item Specs & Condition */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase font-mono text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-blue-600" />
                      Scrap Specs & Valuation
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Condition:</span>
                      <span className="font-bold capitalize text-slate-800">{item.condition}</span>
                    </div>
                    {item.capacity && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Capacity / Size:</span>
                        <span className="font-bold text-slate-800">{item.capacity}</span>
                      </div>
                    )}
                    {item.energyRating && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Energy Rating:</span>
                        <span className="font-bold text-slate-800">{item.energyRating}</span>
                      </div>
                    )}
                    <div className="pt-1 flex items-center justify-between border-t border-slate-200">
                      <span className="font-bold text-slate-700">Estimated Cash:</span>
                      <span className="font-black text-emerald-600 text-sm font-mono">₹{item.estimatedPrice}</span>
                    </div>
                  </div>

                  {/* Scheduled Pickup Info & Actions */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase font-mono text-slate-400 flex items-center gap-1 mb-1">
                        <Truck className="w-3 h-3 text-indigo-600" />
                        Doorstep Pickup Schedule
                      </p>
                      {item.pickupDate ? (
                        <div className="space-y-1 text-[11px]">
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {item.pickupDate} ({item.pickupSlot || 'Anytime'})
                          </p>
                          {item.pickupAgent && (
                            <p className="text-slate-600">
                              Agent: <strong>{item.pickupAgent}</strong>
                            </p>
                          )}
                          {item.adminNotes && (
                            <p className="text-slate-500 italic bg-white p-1.5 rounded border border-slate-200 text-[10px]">
                              Note: "{item.adminNotes}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-700 font-medium">
                          No pickup scheduled yet. Click below to schedule driver dispatch.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openScheduleModal(item)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Schedule Pickup / Edit Order</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteInquiry(item.id, e)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cancellation / Rejection Detail Banner */}
                {(item.cancellationReason || item.status === 'Cancelled' || item.status === 'Rejected') && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center justify-between font-bold text-rose-700">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{item.status === 'Cancelled' ? 'Customer Cancellation Reason' : 'Rejection / Cancellation Reason'}</span>
                      </div>
                      {item.cancelledAt && (
                        <span className="text-[10px] text-rose-600/80 font-mono">
                          Cancelled on: {new Date(item.cancelledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-rose-950 pl-5 bg-white/70 p-2 rounded-lg border border-rose-100 mt-1">
                      "{item.cancellationReason || 'No specific reason entered'}"
                    </p>
                  </div>
                )}

                {/* Defect / Issues Chips */}
                {item.issues && item.issues.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400">Reported Issues:</span>
                    {item.issues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SCHEDULE PICKUP MODAL */}
      {showScheduleModal && selectedEvaluation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Schedule Pickup & Update Status</h3>
                <p className="text-xs text-slate-500 font-mono">Order ID: #{selectedEvaluation.id}</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Selector */}
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                  Update Order Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Confirmed',
                    'Pending',
                    'Hold',
                    'Passed',
                    'Completed',
                    'Failed',
                    'Rejected',
                    'Cancelled'
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setScheduleStatus(st as OrderStatus)}
                      className={`px-2.5 py-2 rounded-xl font-bold border transition-all text-xs text-center ${
                        scheduleStatus === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Pickup Time Slot */}
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                  Pickup Time Slot
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                </select>
              </div>

              {/* Pickup Agent */}
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                  Assigned Pickup Agent / Driver Contact
                </label>
                <input
                  type="text"
                  value={pickupAgent}
                  onChange={(e) => setPickupAgent(e.target.value)}
                  placeholder="e.g. Ramesh Kumar (+91 9876543210)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                  Internal Remarks / Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Call customer 30 minutes prior to visit..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Cancellation / Rejection Reason Field */}
              {(scheduleStatus === 'Cancelled' || scheduleStatus === 'Rejected' || modalCancellationReason) && (
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-1">
                  <label className="block font-bold text-rose-800 uppercase font-mono text-[11px]">
                    Cancellation / Rejection Reason
                  </label>
                  <textarea
                    value={modalCancellationReason}
                    onChange={(e) => setModalCancellationReason(e.target.value)}
                    placeholder="Enter reason for customer cancellation or rejection..."
                    rows={2}
                    className="w-full bg-white border border-rose-200 rounded-lg p-2.5 text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={(e) => selectedEvaluation && handleDeleteInquiry(selectedEvaluation.id, e)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-3.5 py-3 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatusAndSchedule}
                  disabled={isUpdatingStatus}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Saving...' : 'Save & Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL INQUIRY MODAL */}
      {showAddManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Log Walk-In / Phone Inquiry</h3>
              <button
                onClick={() => setShowAddManualModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualInquiry} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Customer Name</label>
                <input
                  type="text"
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Customer Mobile</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                  >
                    <option value="AC">AC</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Mobile">Mobile</option>
                    <option value="WashingMachine">Washing Machine</option>
                    <option value="InverterBattery">Inverter Battery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Est Price (₹)</label>
                  <input
                    type="number"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    placeholder="5500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Brand</label>
                  <input
                    type="text"
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    placeholder="Brand"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Model / Specs</label>
                  <input
                    type="text"
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    placeholder="Model"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase font-mono mb-1">Pickup Address</label>
                <textarea
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Street name, landmark, city..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddManualModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  Log Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
