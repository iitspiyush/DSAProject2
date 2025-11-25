import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ result }) {
  // if result is empty or path not defined, don't render
  if (!result || !result.path) return null;

  const stops = result.path.length - 2;
  const time = (result.distance / 2.5).toFixed(1); // mock flight time

  return (
    <motion.div
      className="bg-slate-800 rounded-2xl p-6 shadow-xl mt-4 text-center w-[300px]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-blue-400 mb-2">
        ✨ Route Summary
      </h2>
      <div className="space-y-1 text-slate-300">
        <p>
          <span className="font-semibold text-blue-300">Total Distance:</span>{" "}
          {result.distance || 0} km
        </p>
        <p>
          <span className="font-semibold text-blue-300">Stops:</span>{" "}
          {stops > 0 ? stops : "Non-stop"}
        </p>
        <p>
          <span className="font-semibold text-blue-300">
            Estimated Time:
          </span>{" "}
          {time} hrs
        </p>
      </div>
    </motion.div>
  );
}
