"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

interface Review {
  id: string; rating: number; comment: string | null; isApproved: boolean; createdAt: string;
  user: { name: string }; product: { name: string };
}

export default function AdminReviewsPage() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch("/api/admin/reviews").then((r) => r.json()).then((data) => setReviews(data.reviews || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchReviews(); }, []);

  const approveReview = async (id: string) => {
    try {
      const res = await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isApproved: true }) });
      if (res.ok) { addToast("تمت الموافقة على التقييم"); fetchReviews(); }
    } catch { addToast("حدث خطأ"); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) { addToast("تم حذف التقييم"); fetchReviews(); }
    } catch { addToast("حدث خطأ"); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>;

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-800 mb-8">التقييمات</motion.h1>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <Star size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد تقييمات بعد</p>
        </div>
      ) : (
        <StaggerContainer className="space-y-4" staggerDelay={0.1}>
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl p-6 shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{review.user?.name || "مجهول"}</p>
                    <p className="text-sm text-gray-500">{review.product?.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < review.rating ? "fill-gold text-gold" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{review.comment || "بدون تعليق"}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("ar-MA")}</p>
                  <div className="flex items-center gap-2">
                    {!review.isApproved && (
                      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => approveReview(review.id)}
                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"><CheckCircle size={18} /></motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => deleteReview(review.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></motion.button>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
