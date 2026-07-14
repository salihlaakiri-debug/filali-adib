"use client";

import { ReactNode } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// STATS CARD
// ============================================

interface AdminStatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; label?: string };
  color?: string;
  className?: string;
}

export function AdminStatsCard({ icon, label, value, trend, color = "text-gold", className = "" }: AdminStatsCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gold/10`}>
          <div className={color}>{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend.value >= 0 ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-secondary">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ============================================
// TABLE
// ============================================

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export function AdminTable<T extends Record<string, any>>({
  columns, data, keyExtractor, onRowClick, emptyMessage = "No data", emptyIcon,
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-12 text-center">
        <div className="text-gray-300 mb-3">{emptyIcon || <Package size={40} className="mx-auto" />}</div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3.5 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, index) => (
              <motion.tr
                key={keyExtractor(item, index)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onRowClick?.(item)}
                className={`${onRowClick ? "cursor-pointer hover:bg-gray-50/80" : ""} transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 text-sm ${col.className || ""}`}>
                    {col.render ? col.render(item, index) : item[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// SEARCH INPUT
// ============================================

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AdminSearch({ value, onChange, placeholder = "Search...", className = "" }: AdminSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full ps-10 pe-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
      />
    </div>
  );
}

// ============================================
// PAGINATION
// ============================================

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function AdminPagination({ page, totalPages, onPageChange, totalItems, pageSize }: AdminPaginationProps) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * (pageSize || 10) + 1;
  const end = Math.min(page * (pageSize || 10), totalItems || 0);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-gray-500">
        {totalItems !== undefined && `${start}–${end} / ${totalItems.toLocaleString()}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (page <= 4) {
            pageNum = i + 1;
          } else if (page >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = page - 3 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === pageNum ? "bg-gold text-secondary" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================================
// LOADING STATE
// ============================================

export function AdminLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={32} className="text-gold animate-spin mb-3" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

// ============================================
// STATUS BADGE
// ============================================

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-gray-50 text-gray-500 border-gray-200",
};

export function AdminBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}

// ============================================
// CONFIRM DIALOG
// ============================================

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm, onCancel,
}: AdminConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-secondary mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  danger ? "bg-red-500 text-white hover:bg-red-600" : "bg-gold text-secondary hover:bg-gold-dark"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// MODAL
// ============================================

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AdminModal({ open, title, onClose, children, size = "md" }: AdminModalProps) {
  const sizeClasses = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[85vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-secondary">{title}</h3>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// FILTER TABS
// ============================================

interface FilterTab { key: string; label: string; count?: number }

interface AdminFilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (key: string) => void;
}

export function AdminFilterTabs({ tabs, active, onChange }: AdminFilterTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            active === tab.key ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${active === tab.key ? "bg-gold/10 text-gold" : "bg-gray-200 text-gray-500"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
