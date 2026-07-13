"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShoppingBag } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  addToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="pointer-events-auto bg-secondary text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gold/20 backdrop-blur-sm"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                toast.type === "success" ? "bg-green-500/20 text-green-400" :
                toast.type === "error" ? "bg-red-500/20 text-red-400" :
                "bg-gold/20 text-gold"
              }`}>
                {toast.type === "success" ? <Check size={16} /> :
                 toast.type === "error" ? <X size={16} /> :
                 <ShoppingBag size={16} />}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
