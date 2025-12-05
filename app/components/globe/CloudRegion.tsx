"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  REGION_DIMENSIONS,
  REGION_OUTER_MARK_DIMENSIONS,
} from "../../constants";

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
      {/* Outer boundary ring - distinctive for cloud regions */}
      <mesh
        position={ringPosition as [number, number, number]}
        quaternion={quaternion}
      >
        <ringGeometry
          args={[
            REGION_DIMENSIONS.RING_INNER_RADIUS,
            REGION_DIMENSIONS.RING_OUTER_RADIUS,
            REGION_DIMENSIONS.SEGMENTS,
          ]}
        />
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
        <torusGeometry
          args={[
            REGION_OUTER_MARK_DIMENSIONS.RING_INNER_RADIUS,
            REGION_OUTER_MARK_DIMENSIONS.TUBE_THICKNESS,
            REGION_OUTER_MARK_DIMENSIONS.RADIAL_SENGMENTS,
            REGION_OUTER_MARK_DIMENSIONS.TUBULAR_SEGMENTS,
          ]}
        />
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
