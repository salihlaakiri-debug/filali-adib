"use client";

import { Edit2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";

const shippingMethods = [
  { id: 1, name: "Standard - المغرب", price: 150, freeAbove: 5000, days: "3-5", active: true },
  { id: 2, name: "Express - المغرب", price: 300, freeAbove: null, days: "1-2", active: true },
  { id: 3, name: "International - Europe", price: 500, freeAbove: 10000, days: "7-14", active: true },
  { id: 4, name: "International - USA/Canada", price: 800, freeAbove: 15000, days: "10-21", active: false },
];

export default function AdminShippingPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات الشحن</h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="bg-gold text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20">
          <Plus size={18} /> إضافة طريقة شحن
        </motion.button>
      </motion.div>

      <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.12}>
        {shippingMethods.map((method) => (
          <StaggerItem key={method.id}>
            <motion.div whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
              className="bg-white rounded-xl p-6 shadow-sm transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.days} أيام عمل</p>
                </div>
                <motion.span whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${method.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {method.active ? "نشط" : "غير نشط"}
                </motion.span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">التكلفة</span>
                  <span className="font-medium">{method.price.toLocaleString()} د.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">شحن مجاني فوق</span>
                  <span className="font-medium">{method.freeAbove ? `${method.freeAbove.toLocaleString()} د.م` : "-"}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <motion.button whileHover={{ x: 4 }}
                  className="text-gold hover:text-gold-dark transition-colors flex items-center gap-1 text-sm">
                  <Edit2 size={14} /> تعديل
                </motion.button>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
