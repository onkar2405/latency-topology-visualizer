"use client";

import { useMemo, useRef } from "react";
import { TubeGeometry, Vector3 } from "three";
import * as THREE from "three";
import LatencyPulse from "./LatencyPulse";

export default function LatencyLine({
  start,
  end,
  latency,
  showPulse = true,
  exchangeName = "",
  regionName = "",
  onLineClick = null,
}) {
  const meshRef = useRef(null);

  const color =
    latency < 60 ? "#00ff6a" : latency < 120 ? "#ffd700" : "#ff4444";

  const curve = useMemo(() => {
    const vStart = new Vector3(...start);
    const vEnd = new Vector3(...end);

    // Compute a midpoint elevated above the globe surface so the line forms an arc.
    const vMid = vStart.clone().lerp(vEnd, 0.5);

    // Elevation proportional to distance between endpoints (so long lines arc higher)
    const distance = vStart.distanceTo(vEnd);
    const baseElevation = Math.max(0.6, distance * 0.45);

    // Move midpoint outward along its normal to create the arc
    const midDir = vMid.clone().normalize();
    vMid.add(midDir.multiplyScalar(baseElevation));

    // Use centripetal CatmullRom to avoid cusps and produce smooth arcs
    return new THREE.CatmullRomCurve3(
      [vStart, vMid, vEnd],
      false,
      "centripetal"
    );
  }, [start, end]);

  const tube = useMemo(
    () => new TubeGeometry(curve, 64, 0.008, 8, false),
    [curve]
  );

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onLineClick) {
      onLineClick(exchangeName, regionName);
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={tube}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      {showPulse && curve && typeof curve.getPoint === "function" && (
        <LatencyPulse curve={curve} color={color} speed={0.9} size={0.035} />
      )}
    </group>
  );
}
