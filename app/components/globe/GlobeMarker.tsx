"use client";

import { useMemo } from "react";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";

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
    <group
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
      {/* Core sphere for the exchange marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={providerColor}
          emissive={providerColor}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Outer ring to differentiate from cloud regions */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.07, 0.01, 8, 32]} />
        <meshStandardMaterial
          color={providerColor}
          emissive={providerColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Pulsing halo effect for trading hubs */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial
          color={providerColor}
          transparent
          opacity={0.2}
          emissive={providerColor}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}
