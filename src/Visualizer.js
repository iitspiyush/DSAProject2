import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import map from "./assets/map.png";

const COLOR_HEX = {
  dijkstra: "#60A5FA",
  bellmanFord: "#34D399",
  floydWarshall: "#F87171",
  aStar: "#FACC15",
  johnson: "#C084FC",
  default: "#94A3B8",
};

export default function Visualizer({ path = [], distance = 0, algorithm = "", all = null }) {
  const [size, setSize] = useState({ width: 1200, height: 700 });
  const canvasRef = useRef(null);

  // --- Handle window resize ---
  useEffect(() => {
    const handleResize = () => {
      const mapContainer = document.getElementById("map-container");
      if (mapContainer) {
        setSize({
          width: mapContainer.offsetWidth,
          height: mapContainer.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Coordinates ---
  const cityCoords = {
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

  // --- Scale coordinates to canvas size ---
  const scaled = useMemo(() => {
    const { width, height } = size;
    const result = {};
    for (const c in cityCoords) {
      result[c] = {
        x: (cityCoords[c].x / 100) * width,
        y: (cityCoords[c].y / 100) * height,
      };
    }
    return result;
  }, [size]);

  const safePath = useMemo(() => {
    if (!Array.isArray(path)) return [];
    return path.filter((n) => scaled[n]);
  }, [path, scaled]);

  const activeCities = useMemo(() => {
    const active = new Set();
    if (algorithm === "compare" && Array.isArray(all)) {
      all.forEach((alg) => {
        if (alg.data?.path) alg.data.path.forEach((node) => active.add(node));
      });
    } else {
      safePath.forEach((n) => active.add(n));
    }
    return active;
  }, [algorithm, all, safePath]);

  // --- Canvas Drawing ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, size.width, size.height);

    if (algorithm === "compare" && Array.isArray(all)) {
      // Draw all algorithm paths
      all.forEach((alg) => {
        const points = alg.data?.path?.map((n) => scaled[n]).filter(Boolean);
        if (!points || points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = alg.colorHex || COLOR_HEX.default;
        ctx.lineWidth = 3;

        for (let i = 0; i < points.length - 1; i++) {
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[i + 1].x, points[i + 1].y);
        }
        ctx.stroke();
      });
    } else if (safePath.length >= 2) {
      // Single algorithm path
      const points = safePath.map((n) => scaled[n]).filter(Boolean);
      ctx.beginPath();
      ctx.strokeStyle = COLOR_HEX[algorithm] || "yellow";
      ctx.lineWidth = 3;

      for (let i = 0; i < points.length - 1; i++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
      }
      ctx.stroke();
    }
  }, [size, scaled, safePath, algorithm, all]);

  // --- Plane animation points ---
  const planePoints = safePath.map((n) => scaled[n]).filter(Boolean);

  return (
    <div
      id="map-container"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundImage: `url(${map})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Cities */}
      {Object.entries(scaled).map(([node, pos]) => (
        <City key={node} node={node} pos={pos} isActive={activeCities.has(node)} />
      ))}

      {/* Plane animation for single algorithm */}
      {planePoints.length >= 2 && algorithm !== "compare" && (
        <motion.div
          initial={{ x: planePoints[0].x, y: planePoints[0].y }}
          animate={{ x: planePoints.map((p) => p.x), y: planePoints.map((p) => p.y) }}
          transition={{
            duration: Math.max(4, planePoints.length * 1.2),
            ease: "linear",
            times: planePoints.map((_, i) => i / (planePoints.length - 1)),
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 36, textShadow: "0 0 12px rgba(255,255,255,0.2)" }}>✈️</div>
        </motion.div>
      )}

      {}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          background: "rgba(7,11,20,0.8)",
          color: "#fff",
          padding: 12,
          borderRadius: 12,
          fontSize: 13,
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: COLOR_HEX[algorithm] || COLOR_HEX.default,
            marginBottom: 8,
          }}
        >
          Algorithm: {algorithm ? algorithm.toUpperCase() : "UNKNOWN"}
        </div>
        <div>Distance: {distance === Infinity ? "∞ (unreachable)" : distance}</div>
        <div>Path: {safePath.join(" → ")}</div>
      </div>

      {/* Compare Mode Info */}
      {algorithm === "compare" && Array.isArray(all) && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "rgba(15,20,30,0.85)",
            padding: "12px 16px",
            borderRadius: 10,
            color: "white",
            fontSize: 14,
            backdropFilter: "blur(5px)",
          }}
        >
          <b>Algorithm Comparison</b>
          <ul style={{ marginTop: 8 }}>
            {all.map((a) => (
              <li key={a.name} style={{ color: a.colorHex || COLOR_HEX.default }}>
                {a.name}: {a.data?.distance ?? "∞"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- City Component ---
function City({ node, pos, isActive }) {
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        background: isActive ? "#F87171" : "#2563eb",
        width: 30,
        height: 30,
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 12,
        boxShadow: "0 8px 22px rgba(37,99,235,0.25)",
        zIndex: 20,
      }}
    >
      {node}
    </div>
  );
}
