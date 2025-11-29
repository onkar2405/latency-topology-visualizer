"use client";

import { useMemo } from "react";

export default function CloudRegion({
  lat,
  lon,
  provider,
  serverCount,
  onClick,
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

  const color =
    {
      AWS: "#FFD70088", // yellow with transparency
      GCP: "#1E90FF88", // blue
      Azure: "#9b5de588", // purple
    }[provider] || "#ffffff88";

  return (
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
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}
