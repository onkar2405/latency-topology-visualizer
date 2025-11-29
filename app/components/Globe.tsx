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
import { useTheme } from "../context/ThemeContext";

import exchangeServers from "../lib/exchangeServerLocations";
import cloudRegions from "../lib/cloudRegions";
import { fetchLatency } from "../lib/latencyAPI";
import "../styles/Globe.css";

export default function Globe() {
  const theme = useTheme();
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

  // Precompute cloud region positions (same sphere radius)
  const regionCoords = useMemo(
    () =>
      cloudRegions.map((r) => {
        const radius = 2.05;
        const phi = (90 - r.lat) * (Math.PI / 180);
        const theta = (r.lon + 180) * (Math.PI / 180);

        return {
          ...r,
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
    // poll every 5 seconds
    const timer = setInterval(load, 5000);
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
    <div className="container" style={{ backgroundColor: theme.bg.primary }}>
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
              const latencyEntry = latencyData.find(
                (l) => l.exchange === data.exchange
              );
              setSelected({ ...data, ...(latencyEntry || {}) });
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
                // Build latencies for servers in this region
                const relatedServers = exchangeServers.filter(
                  (s) =>
                    s.provider === r.provider &&
                    s.lat === r.lat &&
                    s.lon === r.lon
                );
                const latencies = relatedServers.map((s) => ({
                  exchange: s.exchange,
                  provider: s.provider,
                  ...(latencyData.find((l) => l.exchange === s.exchange) || {}),
                }));

                setSelected({ ...r, latencies });
                setSelectedScreenPos(screenPos);
              }}
            />
          ))}

        {/* Latency Lines */}
        {layers["Real-Time"] &&
          filteredLatency.map((l, idx) => {
            const srv = filteredMarkers.find((s) => s.exchange === l.exchange);
            if (!srv) return null;

            // find nearest cloud region for this server (prefer same provider)
            let endPos = [0, 0, 0];
            const sameProviderRegions = regionCoords.filter(
              (r) => r.provider === srv.provider
            );
            const candidates = sameProviderRegions.length
              ? sameProviderRegions
              : regionCoords;
            if (candidates.length) {
              let best = candidates[0];
              let bestDist = Infinity;
              for (const rc of candidates) {
                const d =
                  (rc.position[0] - srv.position[0]) ** 2 +
                  (rc.position[1] - srv.position[1]) ** 2 +
                  (rc.position[2] - srv.position[2]) ** 2;
                if (d < bestDist) {
                  bestDist = d;
                  best = rc;
                }
              }
              endPos = best.position;
            }

            return (
              <LatencyLine
                key={idx}
                start={srv.position}
                end={endPos}
                latency={l.latency}
                showPulse={true}
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
