"use client";

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { EARTH_DIMENTIONS, EARTH_IMG_URL } from "../../constants";

export default function Earth() {
  const earthTexture = useLoader(TextureLoader, EARTH_IMG_URL);

  const { RADIUS, WIDTH_SEGMENTS, HEIGHT_SEGMENTS } = EARTH_DIMENTIONS;

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, WIDTH_SEGMENTS, HEIGHT_SEGMENTS]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}
