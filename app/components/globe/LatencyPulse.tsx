"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function LatencyPulse({
  curve,
  color = "#ffffff",
  speed = 0.5,
  size = 0.035,
}) {
  const ref = useRef<any>(null);
  const tRef = useRef(0);

  // We are calculating the position along the curve based on time and speed
  useFrame((state, delta) => {
    if (!curve || typeof curve.getPoint !== "function" || !ref.current) return;

    // advance time (wrap using modulo to stay within [0,1])
    tRef.current = (tRef.current + delta * speed) % 1;

    try {
      const pos = curve.getPoint(tRef.current);
      if (pos && ref.current?.position)
        ref.current.position.set(pos.x, pos.y, pos.z);
    } catch (err) {
      // Catch is not ideal but three.js curves can be unpredictable
      console.error("Error getting point on curve:", err);
    }
  });

  return (
    <mesh ref={ref} raycast={null}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
