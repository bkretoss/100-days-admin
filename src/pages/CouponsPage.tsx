import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Tag, CheckCircle, Ban, AlertCircle, Plus, Edit2, Trash2, Copy, Check, Calendar, Filter, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate, fromInputDate, toInputDate } from "../lib/utils";
import { COUPONS as INITIAL_COUPONS } from "../data/mockData";
import type { Coupon } from "../types";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/ui/Pagination";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import FilterDropdown from "../components/ui/FilterDropdown";

// --- CouponModal ---
const CouponModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: any) => void; coupon?: Coupon | null }> = ({ isOpen, onClose, onSave, coupon }) => {
  const [formData, setFormData] = useState({ code: "", discount: "", type: "percentage", status: "active", usageLimit: "", startDate: "", expiryDate: "", deviceTypes: [] as string[], description: "" });
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({ code: coupon.code, discount: coupon.discount.toString(), type: coupon.type, status: coupon.status, usageLimit: coupon.usageLimit.toString(), startDate: toInputDate(coupon.startDate || ""), expiryDate: toInputDate(coupon.expiryDate), deviceTypes: coupon.deviceTypes || [], description: coupon.description });
    } else {
      setFormData({ code: "", discount: "", type: "percentage", status: "active", usageLimit: "", startDate: "", expiryDate: "", deviceTypes: [], description: "" });
    }
  }, [coupon, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discount || !formData.usageLimit || !formData.startDate || !formData.expiryDate || !formData.deviceTypes.length) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave({ code: formData.code.toUpperCase(), discount: parseFloat(formData.discount), type: formData.type, status: formData.status, usageLimit: parseInt(formData.usageLimit), startDate: fromInputDate(formData.startDate), expiryDate: fromInputDate(formData.expiryDate), deviceTypes: formData.deviceTypes, description: formData.description });
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-electric-blue/30 outline-none";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl glass-card p-8 shadow-2xl border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-2xl bg-electric-purple/10 flex items-center justify-center text-electric-purple border border-electric-purple/20"><Tag className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-bold text-white">{coupon ? "Edit Coupon" : "Add New Coupon"}</h3>
                <p className="text-gray-400 text-sm mt-1">Create or modify discount codes</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Coupon Code *</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SUMMER2024" className={inputCls} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Discount Value * (%)</label>
                  <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} placeholder="20" min="0" max="100" step="0.01" className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status *</label>
                  <div className="relative">
                    <button type="button" onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className={cn("w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all", statusDropdownOpen ? "border-electric-blue/50 ring-2 ring-electric-blue/20" : "border-white/10 hover:border-white/20")}>
                      <div className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", formData.status === "active" ? "bg-green-400" : "bg-gray-400")} />
                        <span className={cn("text-sm font-medium", formData.status === "active" ? "text-green-400" : "text-gray-400")}>{formData.status === "active" ? "Active" : "Inactive"}</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform shrink-0", statusDropdownOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {statusDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-2 w-full bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20">
                            {[{ value: "active", label: "Active", dot: "bg-green-400", text: "text-green-400" }, { value: "inactive", label: "Inactive", dot: "bg-gray-400", text: "text-gray-400" }].map((opt) => (
                              <button key={opt.value} type="button" onClick={() => { setFormData({ ...formData, status: opt.value }); setStatusDropdownOpen(false); }} className={cn("w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left", formData.status === opt.value ? "bg-white/[0.04]" : "hover:bg-white/[0.03]")}>
                                <div className="flex items-center gap-2"><span className={cn("size-2 rounded-full", opt.dot)} /><span className={cn("text-sm font-medium", opt.text)}>{opt.label}</span></div>
                                {formData.status === opt.value && <Check className="w-4 h-4 text-electric-blue" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage Limit *</label>
                  <input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} placeholder="100" min="1" className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date *</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className={inputCls} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry Date *</label>
                  <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} min={formData.startDate || undefined} className={inputCls} required />
                </div>
              </div>

              {/* Device Type Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Device Type *</label>
                <div className="relative">
                  <button type="button" onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)} className={cn("w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all", deviceDropdownOpen ? "border-electric-blue/50 ring-2 ring-electric-blue/20" : "border-white/10 hover:border-white/20")}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {formData.deviceTypes.length === 0 ? <span className="text-gray-500">Select device type</span> : (
                        <div className="flex items-center gap-1.5">
                          {formData.deviceTypes.map((d) => (
                            <span key={d} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border", d === "ios" ? "bg-electric-blue/15 text-electric-blue border-electric-blue/30" : "bg-green-500/15 text-green-400 border-green-500/30")}>
                              {d === "ios" ? "iOS" : "Android"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2", deviceDropdownOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {deviceDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDeviceDropdownOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 mt-2 w-full bg-[#16191f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20">
                          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Platforms</span>
                            {formData.deviceTypes.length > 0 && <button type="button" onClick={() => setFormData({ ...formData, deviceTypes: [] })} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors font-bold">Clear</button>}
                          </div>
                          {["ios", "android"].map((value) => {
                            const selected = formData.deviceTypes.includes(value);
                            return (
                              <button key={value} type="button" onClick={() => setFormData({ ...formData, deviceTypes: selected ? formData.deviceTypes.filter((d) => d !== value) : [...formData.deviceTypes, value] })} className={cn("w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left", selected ? "bg-white/[0.04]" : "hover:bg-white/[0.03]")}>
                                <span className={cn("text-sm font-medium", selected ? "text-white" : "text-gray-400")}>{value === "ios" ? "iOS" : "Android"}</span>
                                {selected && <Check className="w-4 h-4 text-electric-blue" />}
                              </button>
                            );
                          })}
                          <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">{formData.deviceTypes.length === 0 ? "No platform selected" : `${formData.deviceTypes.length} platform${formData.deviceTypes.length > 1 ? "s" : ""} selected`}</span>
                            {formData.deviceTypes.length > 0 && <button type="button" onClick={() => setDeviceDropdownOpen(false)} className="text-[10px] font-bold text-electric-blue hover:opacity-80 transition-opacity">Done ✓</button>}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the coupon" rows={3} className={cn(inputCls, "resize-none")} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-electric-blue text-dark-900 font-bold hover:opacity-90 transition-all shadow-lg shadow-electric-blue/20">{coupon ? "Update Coupon" : "Create Coupon"}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- CouponsPage ---
const STATUS_OPTIONS = [
  { value: "All", label: "Status: All", icon: Filter },
  { value: "active", label: "Active", icon: CheckCircle, color: "text-green-400" },
  { value: "inactive", label: "Inactive", icon: Ban, color: "text-gray-400" },
  { value: "expired", label: "Expired", icon: AlertCircle, color: "text-red-400" },
];

const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; couponId: number | null }>({ isOpen: false, couponId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredCoupons = coupons.filter((c) => c.code.toLowerCase().includes(searchQuery.toLowerCase()) && (statusFilter === "All" || c.status === statusFilter.toLowerCase()));
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = (data: any) => {
    setCoupons([...coupons, { id: Math.max(...coupons.map((c) => c.id)) + 1, ...data, usageCount: 0 }]);
    setShowAddModal(false);
    toast.success("Coupon created successfully!");
  };

  const handleEditCoupon = (data: any) => {
    setCoupons(coupons.map((c) => (c.id === editingCoupon!.id ? { ...c, ...data } : c)));
    setEditingCoupon(null);
    toast.success("Coupon updated successfully!");
  };

  const handleDeleteCoupon = () => {
    if (deleteModal.couponId) {
      setCoupons(coupons.filter((c) => c.id !== deleteModal.couponId));
      toast.success("Coupon deleted successfully!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <ConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, couponId: null })} onConfirm={handleDeleteCoupon} title="Delete Coupon" message="Are you sure you want to delete this coupon? This action cannot be undone." />
      <CouponModal isOpen={showAddModal || editingCoupon !== null} onClose={() => { setShowAddModal(false); setEditingCoupon(null); }} onSave={editingCoupon ? handleEditCoupon : handleAddCoupon} coupon={editingCoupon} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Coupon Codes</h1>
          <p className="text-gray-500 font-medium mt-1">Manage discount codes and promotions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-electric-blue text-dark-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-electric-blue/20">
          <Plus className="w-4 h-4" />Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Coupons" value={coupons.length} icon={Tag} color="text-electric-blue" bg="bg-electric-blue/10" delay={0} />
        <StatCard label="Active Coupons" value={coupons.filter((c) => c.status === "active").length} icon={CheckCircle} color="text-green-400" bg="bg-green-500/10" delay={0.1} />
        <StatCard label="Inactive Coupons" value={coupons.filter((c) => c.status === "inactive").length} icon={Ban} color="text-gray-400" bg="bg-gray-500/10" delay={0.2} />
        <StatCard label="Expired Coupons" value={coupons.filter((c) => c.status === "expired").length} icon={AlertCircle} color="text-red-400" bg="bg-red-500/10" delay={0.3} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search coupon codes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-electric-blue/30 outline-none transition-all w-64" />
        </div>
        <FilterDropdown value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} isOpen={isStatusDropdownOpen} onToggle={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} onClose={() => setIsStatusDropdownOpen(false)} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                {["Coupon Code", "Device Type", "Discount", "Status", "Usage", "Start Date", "Expiry Date", "Description", "Actions"].map((h) => (
                  <th key={h} className={cn("px-6 py-4", h === "Actions" && "text-right")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedCoupons.length > 0 ? paginatedCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{coupon.code}</span>
                      <button onClick={() => handleCopyCode(coupon.code)} className="p-1 text-gray-500 hover:text-electric-blue transition-colors">
                        {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.deviceTypes?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {coupon.deviceTypes.map((dt) => (
                          <span key={dt} className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest border", dt === "ios" ? "bg-electric-blue/10 text-electric-blue border-electric-blue/20" : "bg-green-500/10 text-green-400 border-green-500/20")}>
                            {dt === "ios" ? "iOS" : "Android"}
                          </span>
                        ))}
                      </div>
                    ) : <span className="text-xs text-gray-500 font-medium">—</span>}
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-electric-blue">{coupon.discount}%</span></td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", coupon.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : coupon.status === "inactive" ? "bg-gray-500/10 text-gray-400 border-white/10" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="bg-electric-blue h-full rounded-full" style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-300">{coupon.usageCount}/{coupon.usageLimit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300"><Calendar className="w-4 h-4 text-gray-500" /><span className="font-medium">{coupon.startDate ? formatDate(coupon.startDate) : "—"}</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300"><Calendar className="w-4 h-4 text-gray-500" /><span className="font-medium">{formatDate(coupon.expiryDate)}</span></div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-gray-400">{coupon.description}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditingCoupon(coupon)} className="p-1.5 text-gray-500 hover:text-electric-blue transition-colors"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => setDeleteModal({ isOpen: true, couponId: coupon.id })} className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="px-6 py-12 text-center"><Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" /><p className="text-gray-500 font-medium">No coupons found</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </motion.div>
  );
};

export default CouponsPage;
