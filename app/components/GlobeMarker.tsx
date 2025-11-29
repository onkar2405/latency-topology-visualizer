"use client";

import { useMemo } from "react";
import { useCursor } from "@react-three/drei";

export default function GlobeMarker({ lat, lon, provider, data, onSelect }) {
  // Marker colors per cloud provider
  const providerColor =
    {
      AWS: "#FFD700",
      GCP: "#1E90FF",
      Azure: "#9b5de5",
    }[provider] || "#ffffff";

  // Convert lat/lon to 3D position
  const position = useMemo(() => {
    const radius = 2.05;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return [
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  }, [lat, lon]);

  // Change cursor on hover
  useCursor(true);

  return (
    <mesh
      position={position as [number, number, number]}
      onClick={(e) => {
        e.stopPropagation();
        // Get screen position of the click event
        const screenPos = {
          x: e.clientX || e.nativeEvent?.clientX || window.innerWidth / 2,
          y: e.clientY || e.nativeEvent?.clientY || window.innerHeight / 2,
        };
        onSelect(data, screenPos);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshStandardMaterial
        color={providerColor}
        emissive={providerColor}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}
