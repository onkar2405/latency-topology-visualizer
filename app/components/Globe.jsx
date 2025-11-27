"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState, useRef } from "react";

import Earth from "./Earth";
import GlobeMarker from "./GlobeMarker";
import CloudRegion from "./CloudRegion";
import MarkerPopup from "./MarkerPopup";
import Legend from "./Legend";
import LatencyLine from "./LatencyLine";
import ControlPanel from "./ControlPanel";

import exchangeServers from "../lib/exchangeServerLocations";
import cloudRegions from "../lib/cloudRegions";
import { fetchLatency } from "../lib/latencyAPI";

export default function Globe() {
  const [selected, setSelected] = useState(null);
  const [selectedScreenPos, setSelectedScreenPos] = useState(null);
  const [latencyData, setLatencyData] = useState([]);
  const [providerFilter, setProviderFilter] = useState(["AWS", "GCP", "Azure"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExchange, setSelectedExchange] = useState("");
  const [latencyRange, setLatencyRange] = useState("");
  const [layers, setLayers] = useState({
    "Real-Time": true,
    Historical: true,
    Regions: true,
  });

  const [metrics, setMetrics] = useState({
    markers: 0,
    latencyLines: 0,
    regions: 0,
    fps: 0,
  });

  // Precompute server positions
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

  // Real-time latency polling
  useEffect(() => {
    const load = async () => setLatencyData(await fetchLatency());
    load();
    const timer = setInterval(load, 5000000);
    return () => clearInterval(timer);
  }, []);

  // Filtered markers
  const filteredMarkers = serverCoords.filter(
    (m) =>
      (selectedExchange ? m.exchange === selectedExchange : true) &&
      providerFilter.includes(m.provider) &&
      (searchQuery
        ? m.exchange.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );

  // Filtered latency
  const filteredLatency = latencyData.filter((l) => {
    if (selectedExchange && l.exchange !== selectedExchange) return false;
    if (latencyRange) {
      const [min, max] = latencyRange.split("-").map(Number);
      return l.latency >= min && (max ? l.latency <= max : true);
    }
    return true;
  });

  // Filtered cloud regions
  const filteredRegions = cloudRegions.filter((r) =>
    providerFilter.includes(r.provider)
  );

  // Update metrics whenever filtered lists change
  useEffect(() => {
    setMetrics((prev) => ({
      ...prev,
      markers: filteredMarkers.length,
      latencyLines: filteredLatency.length,
      regions: filteredRegions.length,
    }));
  }, [filteredMarkers, filteredLatency, filteredRegions]);

  // Toggle helpers
  const toggleProvider = (p) =>
    setProviderFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  const toggleLayer = (key) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Popups & Legend */}
      <MarkerPopup
        data={
          selected ? { ...selected, screenPosition: selectedScreenPos } : null
        }
        onClose={() => setSelected(null)}
      />
      <Legend />

      {/* Control Panel */}
      <ControlPanel
        exchanges={exchangeServers.map((s) => s.exchange)}
        providers={["AWS", "GCP", "Azure"]}
        selectedExchange={selectedExchange}
        onExchangeChange={setSelectedExchange}
        selectedProviders={providerFilter}
        onProviderToggle={toggleProvider}
        latencyRange={latencyRange}
        onLatencyRangeChange={setLatencyRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layers={layers}
        onLayerToggle={toggleLayer}
        metrics={metrics}
      />

      {/* Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        {/* Globe */}
        <Earth />

        {/* Markers */}
        {filteredMarkers.map((m, idx) => (
          <GlobeMarker
            key={idx}
            lat={m.lat}
            lon={m.lon}
            provider={m.provider}
            data={m}
            onSelect={(data, screenPos) => {
              setSelected(data);
              setSelectedScreenPos(screenPos);
            }}
          />
        ))}

        {/* Cloud Regions */}
        {layers["Regions"] &&
          filteredRegions.map((r, idx) => (
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
              onClick={(data, screenPos) => {
                setSelected(data);
                setSelectedScreenPos(screenPos);
              }}
            />
          ))}

        {/* Latency Lines */}
        {layers["Real-Time"] &&
          filteredLatency.map((l, idx) => {
            const srv = filteredMarkers.find((s) => s.exchange === l.exchange);
            if (!srv) return null;
            return (
              <LatencyLine
                key={idx}
                start={srv.position}
                end={[0, 0, 0]}
                latency={l.latency}
              />
            );
          })}

        {/* FPS & Metrics Updater */}
        <MetricsUpdater
          setMetrics={setMetrics}
          markers={filteredMarkers.length}
          latencyLines={filteredLatency.length}
          regions={filteredRegions.length}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          rotateSpeed={0.4}
          zoomSpeed={0.6}
          panSpeed={0.5}
          touchZoomSpeed={0.8}
          touchRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}

// ✅ MetricsUpdater Component
function MetricsUpdater({ setMetrics, markers, latencyLines, regions }) {
  const fpsRef = useRef(0);

  useFrame((state) => {
    fpsRef.current = state.clock.getElapsedTime();
    setMetrics((prev) => ({
      ...prev,
      markers,
      latencyLines,
      regions,
      fps: Math.round(state.gl.info.render.frame / Math.max(fpsRef.current, 1)),
    }));
  });

  return null; // Does not render anything
}
