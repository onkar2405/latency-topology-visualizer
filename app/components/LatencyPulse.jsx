"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function LatencyPulse({
  curve,
  color = "#ffffff",
  speed = 0.5,
  size = 0.035,
}) {
  const ref = useRef();
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (!curve || typeof curve.getPoint !== "function" || !ref.current) return;

    // advance time (wrap using modulo to stay within [0,1])
    tRef.current = (tRef.current + delta * speed) % 1;

    try {
      const pos = curve.getPoint(tRef.current);
      if (pos && ref.current.position)
        ref.current.position.set(pos.x, pos.y, pos.z);
    } catch (err) {
      // defensive: some curve implementations may throw; ignore and skip this frame
      // console.warn("LatencyPulse: curve.getPoint error", err);
    }
  });

  return (
    <mesh ref={ref} raycast={null}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
