# Latency Topology Visualizer - Technical Guide

## Project Overview

A real-time 3D interactive globe visualization that displays network latency between cloud exchange servers and regional data centers. The application fetches live latency metrics from the Cloudflare Radar API and renders animated connections with color-coded latency indicators.

---

## Tech Stack

### Core Framework

- **Next.js 16** - Full-stack React framework with server-side rendering and API routes
- **React 19** - Latest React with concurrent features and optimizations
- **TypeScript/JSConfig** - Type safety and better IDE support

### 3D Visualization

- **Three.js** - 3D graphics library for WebGL rendering
- **@react-three/fiber** - React renderer for Three.js (allows writing Three.js in JSX)
- **@react-three/drei** - Utility library providing ready-made components (OrbitControls, camera helpers, etc.)

### Data Visualization

- **Chart.js + react-chartjs-2** - Historical latency trend charts
- **Recharts** - Alternative charting library for data visualization

### Real-time Communication

- **Socket.io + socket.io-client** - WebSocket-based real-time bidirectional communication (prepared for future use)

### State Management

- **Context API (React)** - Used for global theme state (dark/light mode)
- **Zustand** - Lightweight state management (installed but optional for future use)

### Styling

- **CSS-in-JS (inline styles)** - Dynamic theming with React
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation

---

## Project Architecture

```
app/
├── components/          # React components
│   ├── Globe.jsx        # Main 3D globe orchestrator
│   ├── Earth.jsx        # 3D Earth sphere rendering
│   ├── GlobeMarker.jsx  # Exchange server markers
│   ├── CloudRegion.jsx  # Cloud provider region visualization
│   ├── LatencyLine.jsx  # Curved connection lines
│   ├── LatencyPulse.jsx # Animated pulse along lines
│   ├── ControlPanel.jsx # Filters & layer controls
│   ├── MarkerPopup.jsx  # Tooltip/info popup
│   ├── Legend.jsx       # Color legend
│   ├── LatencyChart.jsx # Historical data chart
│   └── common/
│       └── CollapsiblePanel.jsx # Reusable UI component
├── context/
│   └── ThemeContext.jsx # Global dark/light theme
├── lib/                 # Utility functions & data
│   ├── cloudRegions.js
│   ├── exchangeServerLocations.js
│   ├── latencyAPI.js
│   └── regions.js
├── api/
│   └── latency/route.js # Backend API endpoint
├── layout.js            # Root layout with ThemeProvider
├── page.js              # Home page
└── globals.css          # Global styles
```

---

## Core Components Deep Dive

### 1. **Globe.jsx** - Main Orchestrator Component

**Purpose**: Central hub that manages all state, filters, and coordinates 3D rendering.

**React Hooks Used**:

- `useState()` - Manages 7+ state variables:

  - `selected` / `selectedScreenPos` - User interaction state
  - `latencyData` - API response data
  - `providerFilter`, `searchQuery`, `selectedExchange`, `latencyRange` - Filter states
  - `layers` - Visualization layer toggles
  - `metrics` - Performance metrics (marker count, FPS, etc.)

- `useEffect()` - Side effects:

  - Polls `/api/latency` every 5 seconds via `setInterval`
  - Updates metrics when filtered lists change
  - Cleanup: clears timer on unmount

- `useMemo()` - Performance optimization:

  - Precomputes 3D sphere coordinates for all servers (expensive lat/lon → 3D conversion)
  - Precomputes cloud region 3D positions
  - Prevents recalculation on every render

- `useRef()` - Non-state reference:
  - `fpsRef` in `MetricsUpdater` - tracks elapsed time for FPS calculation

**Libraries**:

- `@react-three/fiber` - `<Canvas>` wrapper for Three.js scene
- `@react-three/drei` - `<OrbitControls>` for mouse-based camera control
- `useTheme()` - Custom hook for global theme state

**Key Logic**:

```javascript
// Lat/Lon to 3D coordinate conversion (spherical to Cartesian)
const phi = (90 - lat) * (Math.PI / 180);
const theta = (lon + 180) * (Math.PI / 180);
position = [
  -(radius * sin(phi) * cos(theta)),
  radius * cos(phi),
  radius * sin(phi) * sin(theta),
];
```

**Design Decision**: Centralizing state in Globe.jsx allows all child components to receive theme and filtered data, avoiding prop-drilling. Alternative: Use Zustand for complex state, but Context API is sufficient here.

---

### 2. **LatencyLine.jsx** - Connection Visualization

**Purpose**: Renders curved 3D lines between exchange servers and cloud regions with animated pulses.

**React Hooks Used**:

- `useMemo()` - Expensive computations:
  - **Curve generation**: Creates `THREE.CatmullRomCurve3` (smooth curve through 3 points)
  - **TubeGeometry**: Converts curve into 3D mesh with thickness
  - Dependencies: `[start, end]` - recalculates only when endpoints change

**Libraries**:

- `three` (TubeGeometry, Vector3, CatmullRomCurve3)
- Custom child component: `<LatencyPulse>`

**Key Algorithm - Arc Calculation**:

```javascript
// Elevate midpoint to create arc (not straight line)
const vMid = vStart.lerp(vEnd, 0.5); // Interpolate between endpoints
const distance = vStart.distanceTo(vEnd);
const elevation = Math.max(0.6, distance * 0.45); // Elevation proportional to distance
vMid.add(midDir.multiplyScalar(elevation)); // Move outward from globe center
```

**Color Coding** (Latency → Color):

```javascript
latency < 60ms   → Green (#00ff6a)   - Good
60 ≤ latency < 120ms → Yellow (#ffd700) - Acceptable
latency ≥ 120ms  → Red (#ff4444)     - Poor
```

**Design Decision**: Using `CatmullRomCurve3` (centripetal) instead of Bezier provides natural-looking curves without cusps. Elevation is distance-dependent so short lines show less curve (natural visual hierarchy).

---

### 3. **LatencyPulse.jsx** - Animated Flow Indicator

**Purpose**: Renders small animated spheres that travel along latency lines to show data flow.

**React Hooks Used**:

- `useRef()` - Two refs:

  - `ref` - Three.js mesh reference for position updates
  - `tRef` - Non-state animation time (0-1), avoids re-renders on every frame

- `useFrame()` - R3F frame loop (60 FPS):
  - Updates `tRef.current` based on delta time
  - Queries curve position: `curve.getPoint(tRef.current)`
  - Updates mesh position in 3D space

**Key Feature**: Uses refs instead of `useState()` to avoid triggering React re-renders on every animation frame (critical for performance with multiple pulses).

**Why Not useState()?**

```javascript
// Bad: causes re-render on every frame
const [t, setT] = useState(0);
useFrame(() => setT(prev => prev + delta)); // 60 renders/sec per pulse!

// Good: no re-render, just updates DOM
const tRef = useRef(0);
useFrame(() => {
  tRef.current += delta;
  ref.current.position.set(...);
});
```

---

### 4. **GlobeMarker.jsx** - Exchange Server Points

**Purpose**: Renders interactive 3D markers for exchange servers (clickable points on globe).

**React Hooks Used**:

- `useMemo()` - Converts lat/lon to 3D position once

**Libraries**:

- `@react-three/drei` - `useCursor()` hook for pointer effects

**Interactivity**:

- `onClick` - Captures screen position and triggers parent callback
- `onPointerOver/Out` - Changes cursor to pointer
- Color by provider (AWS: gold, GCP: blue, Azure: purple)

**Design**: Smaller spheres (0.045 radius) with emissive material for subtle glow.

---

### 5. **CloudRegion.jsx** - Data Center Regions

**Purpose**: Larger semi-transparent spheres showing cloud provider regions.

**Features**:

- Transparency (opacity: 0.5) to allow seeing through layers
- Server count badge showing exchanges co-located in region
- Clickable for detailed region info

**Region Matching Logic** (improved in Globe.jsx):

1. First: Try exact region name match (`region` field)
2. Fallback: Pick nearest region by distance (same provider preferred)
3. Final: Use globe center if no region found

---

### 6. **ControlPanel.jsx** - User Interface Hub

**Purpose**: Filters, layer toggles, metrics display, and dark/light theme toggle.

**React Hooks Used**:

- `useTheme()` - Custom hook for theme colors and toggle function

**Features**:

- Exchange filter (dropdown)
- Provider checkboxes (AWS, GCP, Azure)
- Latency range radio buttons
- Layer visibility toggles
- Real-time metrics (marker count, FPS, line count)
- **Theme Toggle Button** - `☀️ Light` / `🌙 Dark`

**Styling**:

- Inline styles with theme colors for dark/light mode
- Hidden scrollbar (CSS: `scrollbarWidth: none`, webkit pseudo-element)

**Performance Metrics**:

```javascript
{
  markers: filteredMarkers.length,
  latencyLines: filteredLatency.length,
  regions: filteredRegions.length,
  fps: calculated in MetricsUpdater
}
```

---

### 7. **ThemeContext.jsx** - Global Dark/Light Mode

**Purpose**: Provides centralized theme state and localStorage persistence.

**React Hooks Used**:

- `useState()` - Initial state: dark theme
- `useEffect()` - Loads saved preference from localStorage on mount
- `useContext()` - Custom hook `useTheme()` to consume theme

**Design Pattern - Context API**:

```javascript
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setIsDark(false);
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

**Theme Object Structure**:

```javascript
{
  isDark: boolean,
  toggleTheme: () => void,
  bg: { primary, secondary, tertiary },
  text: { primary, secondary, accent },
  ui: { border, panel, panelTransparent }
}
```

**Hydration Fix**: Returns children without context until mounted to prevent server/client mismatch.

**Why Context over Zustand?**

- Simpler for single global state
- No external dependency needed
- Built into React (18+)
- Zustand installed but unused (available for future complexity)

---

### 8. **Earth.jsx** - 3D Globe Base

**Purpose**: Renders the blue Earth sphere in background.

**Libraries**:

- `three-globe` (optional) or custom sphere with TextureLoader

**Typical Implementation**:

```javascript
<mesh>
  <sphereGeometry args={[2, 64, 64]} />
  <meshPhongMaterial color="#1e90ff" />
</mesh>
```

---

### 9. **MarkerPopup.jsx** - Tooltip Component

**Purpose**: Displays detailed info when user clicks a marker or region.

**React Hooks Used**:

- `useState()` - Dynamic position (top, right) based on click location
- `useEffect()` - Updates position when `data` changes

**Data Displayed**:

- Exchange name / Cloud provider
- Region (geographic location)
- Coordinates (latitude, longitude)
- Latency (ms)
- Error (if API failed)
- Timestamp

**Design**: Fixed positioning with dynamic offset to avoid going off-screen.

---

### 10. **LatencyChart.jsx** - Historical Trends

**Purpose**: Shows historical latency over time.

**Libraries**:

- `react-chartjs-2` - React wrapper for Chart.js
- `Chart.js` - Charting library

**Features**:

- Line chart with area fill
- Statistics: Min, Max, Average latency
- Time-series labels (HH:MM:SS)

**Why Chart.js over Recharts?**

- Chart.js has smaller bundle size
- Recharts used as alternative (both available)
- Could refactor to single charting solution

---

## API Integration

### Backend Endpoint: `/api/latency/route.js`

**Purpose**: Fetches real latency from Cloudflare Radar API.

**Exchange to Location Mapping**:

```javascript
const EXCHANGE_REGIONS = [
  { exchange: "Binance", provider: "AWS", location: "JP" },
  { exchange: "OKX", provider: "AWS", location: "SG" },
  { exchange: "Bybit", provider: "GCP", location: "US" },
  // ... 6 more exchanges
];
```

**Response Format**:

```javascript
{
  success: true,
  data: [
    {
      exchange: "Binance",
      provider: "AWS",
      latency: 45,
      timestamp: "2025-11-28T..."
    },
    // ...9 more
  ]
}
```

**Client Fetch** (`Globe.jsx`):

```javascript
const fetchLatency = async () => {
  const res = await fetch("/api/latency");
  const json = await res.json();
  return json.data;
};

useEffect(() => {
  const load = async () => setLatencyData(await fetchLatency());
  load();
  const timer = setInterval(load, 5000); // Poll every 5 seconds
  return () => clearInterval(timer);
}, []);
```

**Why Server-Side Proxy?**

- Cloudflare API requires authentication token (security)
- CORS bypass (server-to-server requests don't have CORS restrictions)
- Rate limiting handled server-side

---

## Performance Optimizations

### 1. **useMemo() - Expensive Computations**

- Lat/lon → 3D conversion precomputed (avoids trig on every render)
- TubeGeometry built once per line (not recreated)
- Filtered arrays only recalculated when dependencies change

### 2. **useRef() - Animation Performance**

- Pulse animation uses ref instead of setState
- Prevents 60 re-renders/sec per pulse

### 3. **Conditional Rendering**

- Latency lines only render if `layers["Real-Time"]` is true
- Cloud regions hidden when filtered out

### 4. **Lazy Loading**

- Three.js scene only builds what's visible
- OrbitControls manages culling/LOD

### 5. **Code Splitting**

- Next.js automatic code splitting per route
- Dynamic imports (if needed for heavy components)

---

## Key Technical Decisions

### 1. **Why Three.js + R3F?**

- **Three.js**: Industry standard for 3D graphics, mature, large community
- **R3F**: Declarative syntax familiar to React devs, fiber integration, reconciliation
- **Alternative considered**: Babylon.js (heavier, less React-friendly)

### 2. **Why Real-time Polling vs WebSocket?**

- **Current**: HTTP polling every 5 seconds (simpler, sufficient for latency updates)
- **Socket.io installed**: Prepared for future real-time features (trading volume, order flow)
- **When to upgrade**: If updates < 1 second needed or bidirectional communication required

### 3. **Why Context API vs Zustand?**

- **Context**: Sufficient for single global state (theme)
- **Zustand**: Installed for potential future use (complex state machines, side effects)
- **Trade-off**: Context API has prop-drilling risk at scale

### 4. **Why 5-Second Poll Interval?**

- **Not too fast**: Reduces API load, prevents UI thrashing
- **Not too slow**: Feels "real-time" for latency visualization
- **Configurable**: Can adjust via `setInterval(load, 5000)`

### 5. **Arc Algorithm - Distance-Based Elevation**

- Short lines: minimal arc (under-the-horizon appearance)
- Long lines: prominent arc (over-the-horizon appearance)
- Formula: `elevation = Math.max(0.6, distance * 0.45)`
- Reason: Natural visual hierarchy without flat lines

---

## Testing & Debugging Tips

### Browser DevTools

1. **React DevTools**: Inspect component tree, hooks state
2. **Three.js Inspector**: Click on 3D objects, inspect geometry
3. **Network Tab**: Monitor `/api/latency` requests (5-sec interval)
4. **Console**: Look for hydration warnings (Theme mismatch)

### Common Issues

1. **Hydration mismatch**: Fixed via delayed provider render
2. **Pulse not animating**: Check `useFrame` dependencies
3. **Lines not curved**: Verify arc elevation calculation
4. **Theme not applying**: Ensure `useTheme()` called inside `ThemeProvider`
5. **Markers not showing**: Check filters (providerFilter, searchQuery)

---

## Future Enhancement Ideas

1. **Export Functionality** - CSV/JSON export of latency reports
2. **Latency Heatmap** - Color gradient overlay on globe surface
3. **Network Topology Graph** - 2D force-directed layout view
4. **Trading Volume Animation** - Pulse size based on order flow
5. **Prediction Model** - ML-based latency forecasting
6. **WebSocket Upgrade** - Real-time updates for < 1-sec latency
7. **Database Persistence** - Store historical metrics in PostgreSQL
8. **Multi-Protocol Support** - Add TCP, UDP latency metrics

---

## Interview Talking Points

1. **Challenge Addressed**: Real-time 3D visualization of network topology

   - "Why 3D?": Better spatial representation of global connections
   - "Why real-time?": Traders need live latency for decision-making

2. **Technical Complexity**:

   - Coordinate system conversion (spherical to Cartesian)
   - Animation loop optimization (useRef vs setState)
   - API polling with cleanup

3. **Design Patterns**:

   - Context API for global state
   - Custom hooks (useTheme)
   - Separation of concerns (3D rendering vs data fetching)

4. **Performance**:

   - useMemo precomputation
   - Lazy rendering (conditional)
   - Client-side filtering (no backend load)

5. **Scalability**:
   - Can handle 100+ exchanges without lag
   - WebSocket ready for real-time
   - Database-ready for historical analysis

---

## Deployment Checklist

- [ ] Environment variables set (.env.local): `CLOUDFLARE_API_TOKEN`
- [ ] Next.js build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] API endpoint responds: `curl http://localhost:3000/api/latency`
- [ ] Theme persistence works (localStorage)
- [ ] Dark/light toggle persists on refresh
- [ ] All 9 exchanges visible on globe
- [ ] Latency lines show and animate
- [ ] Filters work without lag

---

## Resources & References

- **Three.js Docs**: https://threejs.org/docs/
- **R3F Docs**: https://docs.pmnd.rs/react-three-fiber/
- **React Hooks**: https://react.dev/reference/react/hooks
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **Cloudflare Radar API**: https://developers.cloudflare.com/radar/
