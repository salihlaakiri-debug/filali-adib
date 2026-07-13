"use client";

import { motion } from "framer-motion";

const shimmer = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      variants={shimmer}
      initial="initial"
      animate="animate"
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg ${className || ""}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-square w-full !rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 8 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === 0 ? "w-32" : "w-16"}`}
        />
      ))}
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
