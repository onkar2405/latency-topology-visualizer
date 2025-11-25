"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";

import Earth from "./Earth";
import GlobeMarker from "./GlobeMarker";
import CloudRegion from "./CloudRegion";
import MarkerPopup from "./MarkerPopup";
import Legend from "./Legend";

import exchangeServers from "../lib/exchangeServerLocations";
import cloudRegions from "../lib/cloudRegions";
import { fetchLatency } from "../lib/latencyAPI";
import LatencyLine from "./LatencyLine";
import ProviderFilter from "./ProvideFilter";

export default function Globe() {
  const [selected, setSelected] = useState(null);
  const [latencyData, setLatencyData] = useState([]);
  const [regionSelected, setRegionSelected] = useState(null);
  const [providerFilter, setProviderFilter] = useState(["AWS", "GCP", "Azure"]);

  const serverCoords = useMemo(
    () =>
      exchangeServers.map((srv) => {
        const radius = 2.05;
        const phi = (90 - srv.lat) * (Math.PI / 180);
        const theta = (srv.lon + 180) * (Math.PI / 180);

        return {
          ...srv,
          position: [
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta),
          ],
        };
      }),
    []
  );

  useEffect(() => {
    const load = async () => setLatencyData(await fetchLatency());
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleProvider = (p) => {
    setProviderFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <MarkerPopup
        data={selected || regionSelected}
        onClose={() => {
          setSelected(null);
          setRegionSelected(null);
        }}
      />
      <Legend />
      <ProviderFilter selected={providerFilter} onToggle={toggleProvider} />

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Earth />

        {/* Exchange Markers */}
        {serverCoords.map((item, idx) => (
          <GlobeMarker
            key={idx}
            lat={item.lat}
            lon={item.lon}
            provider={item.provider}
            data={item}
            onSelect={setSelected}
          />
        ))}

        {/* Cloud Regions */}
        {cloudRegions
          .filter((r) => providerFilter.includes(r.provider))
          .map((r, idx) => (
            <CloudRegion
              key={idx}
              lat={r.lat}
              lon={r.lon}
              provider={r.provider}
              serverCount={
                exchangeServers.filter(
                  (s) =>
                    s.provider === r.provider &&
                    s.lat === r.lat &&
                    s.lon === r.lon
                ).length
              }
              onClick={setRegionSelected}
            />
          ))}

        {/* Latency Lines */}
        {latencyData.map((lat, idx) => {
          const srv = serverCoords.find((s) => s.exchange === lat.exchange);
          if (!srv) return null;

          return (
            <LatencyLine
              key={idx}
              start={srv.position}
              end={[0, 0, 0]} // placeholder
              latency={lat.latency}
            />
          );
        })}

        <OrbitControls />
      </Canvas>
    </div>
  );
}
