"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {show && children}
      </motion.div>
    </AnimatePresence>
  );
}
