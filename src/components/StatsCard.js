import React from "react";

export default function StatsCard({ result }) {
  if (!result) return null;

  const totalStops = result.path.length - 2;
  const estimatedTime = (result.distance / 800).toFixed(1); // assuming 800 km/h
  const cost = (result.distance * 0.12).toFixed(0);

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-6">
      <div className="p-5 w-44 h-36 bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg flex flex-col justify-center items-center hover:scale-105 transition">
        <div className="text-yellow-400 text-3xl mb-2">🛫</div>
        <p className="text-slate-300 text-sm">Total Distance</p>
        <p className="text-lg font-bold text-white">{result.distance} km</p>
      </div>

      <div className="p-5 w-44 h-36 bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg flex flex-col justify-center items-center hover:scale-105 transition">
        <div className="text-red-400 text-3xl mb-2">🛑</div>
        <p className="text-slate-300 text-sm">Stops</p>
        <p className="text-lg font-bold text-white">{totalStops}</p>
      </div>

      <div className="p-5 w-44 h-36 bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg flex flex-col justify-center items-center hover:scale-105 transition">
        <div className="text-green-400 text-3xl mb-2">⏱️</div>
        <p className="text-slate-300 text-sm">Time</p>
        <p className="text-lg font-bold text-white">{estimatedTime} hr</p>
      </div>

      <div className="p-5 w-44 h-36 bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg flex flex-col justify-center items-center hover:scale-105 transition">
        <div className="text-purple-400 text-3xl mb-2">💰</div>
        <p className="text-slate-300 text-sm">Cost</p>
        <p className="text-lg font-bold text-white">₹{cost}</p>
      </div>
    </div>
  );
}
