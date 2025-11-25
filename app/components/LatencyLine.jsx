"use client";

import { useMemo } from "react";
import { TubeGeometry, Vector3 } from "three";
import * as THREE from "three";

export default function LatencyLine({ start, end, latency }) {
  // Latency → color map
  const color =
    latency < 60
      ? "#00ff6a" // green
      : latency < 120
      ? "#ffd700" // yellow
      : "#ff4444"; // red

  // Create arc curve
  const curve = useMemo(() => {
    const vStart = new Vector3(...start);
    const vEnd = new Vector3(...end);

    // Mid point elevated (for arc)
    const vMid = vStart.clone().lerp(vEnd, 0.5);
    vMid.normalize().multiplyScalar(2.4);

    return new THREE.CatmullRomCurve3([vStart, vMid, vEnd]);
  }, [start, end]);

  const tube = useMemo(
    () => new TubeGeometry(curve, 32, 0.01, 8, false),
    [curve]
  );

  return (
    <mesh geometry={tube}>
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}
