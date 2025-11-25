"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function LatencyPulse({ curve }) {
  const ref = useRef();
  const [t, setT] = useState(0);

  useFrame((state, delta) => {
    // Animate the pulse
    const next = t + delta * 0.25; // speed
    setT(next > 1 ? 0 : next);

    const pos = curve.getPoint(next);
    ref.current.position.set(pos.x, pos.y, pos.z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color="#ffffff" emissive="#ffffff" />
    </mesh>
  );
}
