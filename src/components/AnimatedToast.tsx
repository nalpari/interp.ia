"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface AnimatedToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function AnimatedToast({
  message,
  duration = 3000,
  onClose,
}: AnimatedToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-3"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={isLoading ? { rotate: 360 } : { scale: 1.2 }}
            transition={
              isLoading
                ? { repeat: Number.POSITIVE_INFINITY, duration: 1 }
                : { type: "spring", stiffness: 200 }
            }
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-blue-500" />
            ) : (
              <Check className="h-6 w-6 text-green-500" />
            )}
          </motion.div>
          <span className="text-gray-800">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
