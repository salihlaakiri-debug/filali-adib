"use client";

import { useLocale } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import { Star, Check, Trash2, MessageSquare, Package, Filter } from "lucide-react";
import { AdminFilterTabs, AdminPagination, AdminConfirmDialog, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Review {
  id: string; rating: number; title: string | null; comment: string | null; isApproved: boolean; createdAt: string;
  user: { name: string; email: string } | null;
  product: { name: string; images?: { url: string }[] } | null;
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminReviewsPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
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
      addToast(t("تم التحديث", "Updated"));
    } catch { addToast("Error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/reviews?id=${deleteId}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      addToast(t("تم الحذف", "Deleted"));
    } catch { addToast("Error"); }
    setDeleteId(null);
  };

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
    return dist;
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "0";
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{t("التقييمات", "Reviews")}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {t("تقييم", "reviews")}</p>
      </div>

      {/* Rating overview */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center gap-8">
            {/* Average rating */}
            <div className="text-center flex-shrink-0">
              <p className="text-4xl font-bold text-secondary">{avgRating}</p>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className=                {i < Math.round(parseFloat(avgRating)) ? "text-gold fill-gold" : "text-gray-200"} />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{pagination.total} {t("تقييم", "reviews")}</p>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star - 1];
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3 text-end">{star}</span>
                    <Star size={12} className="text-gold fill-gold flex-shrink-0" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-6 text-end">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-lg font-bold text-green-600">{approvedCount}</p>
                <p className="text-[10px] text-green-500">{t("منشور", "Published")}</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <p className="text-lg font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-[10px] text-yellow-500">{t("معلق", "Pending")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminFilterTabs
        tabs={[
          { key: "all", label: t("الكل", "All"), count: pagination.total },
          { key: "pending", label: t("قيد المراجعة", "Pending"), count: pendingCount },
          { key: "approved", label: t("منشور", "Approved"), count: approvedCount },
        ]}
        active={filter} onChange={(v) => { setFilter(v); fetchReviews(1, v); }} />

      {loading ? <AdminLoading /> : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
          <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("لا توجد تقييمات", "No reviews")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${review.isApproved ? "border-gray-50" : "border-yellow-200 bg-yellow-50/30"}`}>
              <div className="flex items-start gap-4">
                {/* Product image */}
                {review.product?.images?.[0]?.url && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <img src={review.product.images[0].url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={14} className={si < review.rating ? "text-gold fill-gold" : "text-gray-200"} />
                      ))}
                    </div>
                    {!review.isApproved && <span className="text-[10px] text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full font-medium">{t("معلق", "Pending")}</span>}
                  </div>
                  {review.title && <p className="font-medium text-secondary text-sm mb-1">{review.title}</p>}
                  <p className="text-sm text-gray-600">{review.comment || (t("بدون تعليق", "No comment"))}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-[8px] font-bold text-gold">
                        {review.user?.name?.charAt(0) || review.user?.email?.charAt(0) || "?"}
                      </div>
                      {review.user?.name || review.user?.email || t("مجهول", "Anonymous")}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Package size={10} /> {review.product?.name || "—"}</span>
                    <span>·</span>
                    <span>{new Date(review.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr")}</span>
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

      <AdminConfirmDialog open={!!deleteId} title={t("حذف التقييم", "Delete Review")}
        message={t("هل أنت متأكد من حذف هذا التقييم؟", "Are you sure you want to delete this review?")} danger
        confirmLabel={t("حذف", "Delete")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
