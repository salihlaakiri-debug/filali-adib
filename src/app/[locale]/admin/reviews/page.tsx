"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Star, Check, Trash2, MessageSquare } from "lucide-react";
import { AdminFilterTabs, AdminPagination, AdminConfirmDialog, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Review {
  id: string; rating: number; title: string | null; comment: string | null; isApproved: boolean; createdAt: string;
  user: { name: string; email: string } | null;
  product: { name: string } | null;
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminReviewsPage() {
  const locale = useLocale();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReviews = (page = 1, filterVal = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filterVal !== "all") params.set("status", filterVal);
    fetch(`/api/admin/reviews?${params}`)
      .then((r) => r.json())
      .then((d) => { setReviews(d.reviews || []); setPagination(d.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isApproved: !current }) });
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isApproved: !current } : r));
      addToast(locale === "ar" ? "تم التحديث" : "Updated");
    } catch { addToast("Error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/reviews?id=${deleteId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      addToast(locale === "ar" ? "تم الحذف" : "Deleted");
    } catch { addToast("Error"); }
    setDeleteId(null);
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "التقييمات" : "Reviews"}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {locale === "ar" ? "تقييم" : "reviews"}</p>
      </div>

      <AdminFilterTabs
        tabs={[
          { key: "all", label: locale === "ar" ? "الكل" : "All", count: pagination.total },
          { key: "pending", label: locale === "ar" ? "قيد المراجعة" : "Pending" },
          { key: "approved", label: locale === "ar" ? "منشور" : "Approved" },
        ]}
        active={filter} onChange={(v) => { setFilter(v); fetchReviews(1, v); }} />

      {loading ? <AdminLoading /> : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
          <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{locale === "ar" ? "لا توجد تقييمات" : "No reviews"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${review.isApproved ? "border-gray-50" : "border-yellow-200 bg-yellow-50/30"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={14} className={si < review.rating ? "text-gold fill-gold" : "text-gray-200"} />
                      ))}
                    </div>
                    {!review.isApproved && <span className="text-[10px] text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">{locale === "ar" ? "معلق" : "Pending"}</span>}
                  </div>
                  {review.title && <p className="font-medium text-secondary text-sm mb-1">{review.title}</p>}
                  <p className="text-sm text-gray-600">{review.comment || (locale === "ar" ? "بدون تعليق" : "No comment")}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{review.user?.name || review.user?.email || (locale === "ar" ? "مجهول" : "Anonymous")}</span>
                    <span>·</span>
                    <span>{review.product?.name || "—"}</span>
                    <span>·</span>
                    <span>{new Date(review.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleApprove(review.id, review.isApproved)}
                    className={`p-2 rounded-lg transition-colors ${review.isApproved ? "hover:bg-green-50 text-green-500" : "hover:bg-gold/10 text-gold"}`}
                    title={review.isApproved ? "Unapprove" : "Approve"}>
                    <Check size={16} />
                  </button>
                  <button onClick={() => setDeleteId(review.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchReviews(p)} totalItems={pagination.total} pageSize={pagination.limit} />
        </div>
      )}

      <AdminConfirmDialog open={!!deleteId} title={locale === "ar" ? "حذف التقييم" : "Delete Review"}
        message={locale === "ar" ? "هل أنت متأكد؟" : "Are you sure?"} danger
        confirmLabel={locale === "ar" ? "حذف" : "Delete"} cancelLabel={locale === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
