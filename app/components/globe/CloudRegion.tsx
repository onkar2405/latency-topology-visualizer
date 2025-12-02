"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function CloudRegion({
  lat,
  lon,
  provider,
  serverCount,
  onClick,
}: {
  lat: number;
  lon: number;
  provider: string;
  serverCount: number;
  onClick: any;
}) {
  const position = useMemo(() => {
    const radius = 2.0;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return [
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ] as [number, number, number];
  }, [lat, lon]);

  const baseColor =
    {
      AWS: "#FFD700",
      GCP: "#1E90FF",
      Azure: "#9b5de5",
    }[provider] || "#ffffff";

  const sphereOpacity = 0.9;
  const ringOpacity = 0.12;

  // Compute normal and quaternion to orient boundary ring to the sphere surface
  const { ringPosition, quaternion } = useMemo(() => {
    const v = new THREE.Vector3(...position);
    const normal = v.clone().normalize();
    // place ring slightly above the surface
    const ringPos = normal.clone().multiplyScalar(2.03);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );
    return { ringPosition: ringPos.toArray(), quaternion: q };
  }, [position]);

  return (
    <group>
      {/* Main cloud region sphere - larger and more translucent */}
      <mesh
        position={position as [number, number, number]}
        onClick={(e) => {
          const screenPos = {
            x: e.clientX || e.nativeEvent?.clientX || window.innerWidth / 2,
            y: e.clientY || e.nativeEvent?.clientY || window.innerHeight / 2,
          };
          onClick({ provider, lat, lon, serverCount }, screenPos);
        }}
      >
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={sphereOpacity}
          metalness={0}
          roughness={0.6}
          emissive={baseColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Outer boundary ring - distinctive for cloud regions */}
      <mesh
        position={ringPosition as [number, number, number]}
        quaternion={quaternion}
      >
        <ringGeometry args={[0.22, 0.38, 64]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={ringOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Additional grid pattern to make cloud regions stand out */}
      <mesh
        position={ringPosition as [number, number, number]}
        quaternion={quaternion}
      >
        <torusGeometry args={[0.3, 0.01, 4, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={ringOpacity * 0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
