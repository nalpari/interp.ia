import { useState } from "react";
import { motion } from "framer-motion";

interface InteractivePerformanceChipProps {
  performance: number;
}

export default function InteractivePerformanceChip({
  performance,
}: InteractivePerformanceChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = (performance: number) => {
    if (performance >= 90) return "bg-green-100 text-green-700";
    if (performance >= 75) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <motion.div
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getColor(
        performance
      )}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
        className="absolute left-0 top-0 h-full bg-current opacity-20 rounded-full"
      />
      {performance}%
    </motion.div>
  );
}
