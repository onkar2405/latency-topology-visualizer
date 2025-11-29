"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Earth() {
  const earthTexture = useLoader(
    TextureLoader,
    "https://neo.gsfc.nasa.gov/archive/bluemarble/bmng/world_8km/world.topo.bathy.200412.3x5400x2700.jpg"
  );

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}
