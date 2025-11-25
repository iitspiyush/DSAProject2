import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Visualizer from "./Visualizer";
import StatsCard from "./StatsCard";
import {
  dijkstra,
  bellmanFord,
  floydWarshall,
  aStar,
  johnson,
} from "./algorithms";
// Slightly modify edge weights randomly to create different paths
function perturbGraph(originalGraph, factor = 1.5) {
  const graph = {};
  for (let node in originalGraph) {
    graph[node] = {};
    for (let neighbor in originalGraph[node]) {
      // Randomly multiply weight by 1 to factor
      const randFactor = 1 + Math.random() * (factor - 1);
      graph[node][neighbor] = originalGraph[node][neighbor] * randFactor;
    }
  }
  return graph;
}

export default function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [error, setError] = useState(""); // For user feedback

  // -------- Graph with 15 cities --------
  const graph = {
    A: { B: 4, C: 2, D: 7 },
    B: { A: 4, E: 3, F: 5 },
    C: { A: 2, D: 3, G: 8, H: 4 },
    D: { A: 7, C: 3, H: 2, I: 6 },
    E: { B: 3, F: 4, J: 7 },
    F: { B: 5, E: 4, K: 6 },
    G: { C: 8, H: 3, L: 5 },
    H: { C: 4, D: 2, G: 3, M: 7 },
    I: { D: 6, M: 2, N: 4 },
    J: { E: 7, K: 3, O: 6 },
    K: { F: 6, J: 3, P: 5 },
    L: { G: 5, M: 3, Q: 8 },
    M: { H: 7, I: 2, L: 3, Q: 4 },
    N: { I: 4, Q: 2 },
    O: { J: 6, P: 4 },
    P: { K: 5, O: 4, Q: 3 },
    Q: { L: 8, M: 4, N: 2, P: 3 },
  };

  const coords = {
    A: { x: 5, y: 80 },
    B: { x: 15, y: 70 },
    C: { x: 10, y: 50 },
    D: { x: 20, y: 40 },
    E: { x: 25, y: 75 },
    F: { x: 30, y: 65 },
    G: { x: 25, y: 40 },
    H: { x: 35, y: 50 },
    I: { x: 45, y: 40 },
    J: { x: 40, y: 75 },
    K: { x: 50, y: 65 },
    L: { x: 40, y: 30 },
    M: { x: 50, y: 45 },
    N: { x: 60, y: 35 },
    O: { x: 55, y: 75 },
    P: { x: 65, y: 60 },
    Q: { x: 70, y: 45 },
  };

  const cities = Object.keys(graph); // For validation
  const roundDistance = (dist) => Number(dist.toFixed(2)); // rounds to 2 decimals


  function handleFind() {
  setError(""); // Clear previous errors
  if (!source || !destination) {
    setError("Enter both cities (A–Q)");
    return;
  }
  if (!cities.includes(source) || !cities.includes(destination)) {
    setError("Invalid cities. Choose from A–Q.");
    return;
  }

  try {
    // --- Compare All Algorithms Mode ---
    if (algorithm === "compare") {
      const algorithms = [
        { fn: dijkstra, name: "Dijkstra", colorHex: "#60A5FA" },
        { fn: bellmanFord, name: "Bellman-Ford", colorHex: "#34D399" },
        { fn: floydWarshall, name: "Floyd–Warshall", colorHex: "#F87171" },
        { fn: aStar, name: "A*", colorHex: "#FACC15" },
        { fn: johnson, name: "Johnson", colorHex: "#C084FC" },
      ];

      const all = algorithms.map((alg) => {
        // Perturb graph differently for each algorithm
        const perturbedGraph = perturbGraph(graph, 1.5);

        const data =
          alg.name === "A*"
            ? alg.fn(perturbedGraph, source, destination, coords)
            : alg.fn(perturbedGraph, source, destination);

        return {
          name: alg.name,
          colorHex: alg.colorHex,
          data: {
            path: Array.isArray(data?.path) ? data.path : [],
            distance: roundDistance(data?.distance ?? Infinity),
            algorithm: alg.name.toLowerCase(),
          },
        };
      });

      setResult({ algorithm: "compare", all });
      setShowMap(true);
      return;
    }

    // --- Single Algorithm Mode ---
    let data;
    if (algorithm === "dijkstra") data = dijkstra(graph, source, destination);
    else if (algorithm === "bellmanFord")
      data = bellmanFord(graph, source, destination);
    else if (algorithm === "floydWarshall")
      data = floydWarshall(graph, source, destination);
    else if (algorithm === "aStar") data = aStar(graph, source, destination, coords);
    else if (algorithm === "johnson") data = johnson(graph, source, destination);

    if (data) {
      if (!Array.isArray(data.path)) data.path = [];
        data.distance = roundDistance(data.distance); // <-- ADD THIS
        data.algorithm = algorithm;
        setResult(data);
        setShowMap(true);
      } else {
        setError("No route found or algorithm error.");
        }
      } catch (err) {
      console.error("Algorithm error:", err);
      setError("An error occurred while calculating the route.");
    }
  }

  

  function handleBack() {
  setShowMap(false);
  setResult(null);
  setSource("");
  setDestination("");
  setError("");
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {!showMap ? (
          <motion.div
            key="form"
            className="text-center space-y-6 p-10 bg-slate-800/60 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-6 text-blue-400">
              ✈️ Flight Route Optimizer
            </h1>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <label htmlFor="source" className="sr-only">Source City</label>
              <input
                id="source"
                className="p-3 text-black rounded-xl outline-none"
                placeholder="Source (A–Q)"
                value={source}
                onChange={(e) => setSource(e.target.value.toUpperCase())}
              />
              <label htmlFor="destination" className="sr-only">Destination City</label>
              <input
                id="destination"
                className="p-3 text-black rounded-xl outline-none"
                placeholder="Destination (A–Q)"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex justify-center">
              <label htmlFor="algorithm" className="sr-only">Algorithm</label>
              <select
                id="algorithm"
                className="p-3 text-black rounded-xl outline-none"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <option value="dijkstra">Dijkstra</option>
                <option value="bellmanFord">Bellman-Ford</option>
                <option value="floydWarshall">Floyd–Warshall</option>
                <option value="aStar">A*</option>
                <option value="johnson">Johnson’s Algorithm</option>
                <option value="compare">Compare All Algorithms</option>
              </select>
            </div>

            <button
              onClick={handleFind}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-blue-700/50"
            >
              Find Route
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}
            {result && <StatsCard result={result} />}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            className="relative w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Visualizer
              path={result?.path || []}
              distance={result?.distance || 0}
              algorithm={result?.algorithm || ""}
              all={result?.all || null}
            />


            <div className="absolute top-6 right-6 z-50">
              <button
              onClick={handleBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-lg"
              >
            ← Back
          </button>
          </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}