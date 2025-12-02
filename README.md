# Latency Topology Visualizer

A real-time 3D globe visualization tool for monitoring latency and topology of cryptocurrency exchanges across different cloud providers. Built with cutting-edge web technologies for an immersive, interactive experience.

![Project Status](https://img.shields.io/badge/status-active-success) ![Version](https://img.shields.io/badge/version-0.1.0-blue)

## 🌍 Overview

This project provides a visual representation of:

- **Real-time latency data** from major cryptocurrency exchanges (Binance, OKX, Bybit, Deribit, Bitfinex)
- **Cloud provider distribution** (AWS, GCP, Azure)
- **Geographic topology** of exchange server locations
- **Interactive 3D globe** with filtering and search capabilities
- **Live performance metrics** for monitoring network conditions

The application fetches real latency metrics from the Cloudflare Radar API and visualizes them on an interactive 3D globe powered by Three.js.

## ✨ Key Features

### 🗺️ 3D Globe Visualization

- Interactive 3D Earth rendered with Three.js and React Three Fiber
- Rotating globe with OrbitControls for seamless navigation
- Real-time marker positioning for exchange servers
- Visual latency indicators connecting exchanges to global hubs

### 📊 Real-Time Data

- Live latency data from **Cloudflare Radar API**
- Automatic data refresh every 5 seconds (configurable)
- Support for multiple exchanges across different cloud providers
- Fallback mechanisms for API unavailability

### 🎮 Interactive Controls

- **Exchange Filter**: Select specific exchanges to focus on
- **Cloud Provider Filter**: Toggle visibility of AWS, GCP, and Azure servers
- **Search Functionality**: Find exchanges and regions by name
- **Latency Range Filter**: Filter by latency ranges (0-50ms, 50-100ms, 100-200ms, 200+ms)
- **Layer Toggle**: Show/hide visualization layers (Real-Time, Historical, Regions)

### 📈 Performance Metrics

- Live FPS counter
- Active marker count
- Latency line count
- Visible region count

### 🎨 Dynamic Popup Display

- Click on any exchange or region to view detailed information
- Popup appears near the clicked location with auto-positioning
- Displays latency, cloud provider, region, and coordinates
- Non-intrusive positioning above control panels

## 🚀 Tech Stack

### Core Technologies

| Technology            | Version | Purpose                                    |
| --------------------- | ------- | ------------------------------------------ |
| **Next.js**           | 16.0.4  | React framework with server-side rendering |
| **React**             | 19.2.0  | UI component library                       |
| **Three.js**          | 0.181.2 | 3D graphics rendering                      |
| **React Three Fiber** | 9.4.0   | React renderer for Three.js                |
| **Drei**              | 10.7.7  | Useful utilities for React Three Fiber     |

### Data & APIs

| Library                  | Version | Purpose                               |
| ------------------------ | ------- | ------------------------------------- |
| **Cloudflare Radar API** | —       | Real-time latency data source         |
| **Socket.io**            | 4.8.1   | Real-time bidirectional communication |
| **Chart.js**             | 4.5.1   | Data visualization charts             |
| **Recharts**             | 3.5.0   | Composable charting library           |

### Styling & Utilities

| Library          | Version | Purpose                     |
| ---------------- | ------- | --------------------------- |
| **Tailwind CSS** | 4       | Utility-first CSS framework |
| **Zustand**      | 5.0.8   | State management            |

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Cloudflare API Token** (for real-time latency data)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd latency-topology-visualizer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Cloudflare API Configuration
# Get these from your Cloudflare dashboard: https://dash.cloudflare.com/

# Your Cloudflare API Token
NEXT_PUBLIC_CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_API_TOKEN=your_api_token_here

# Your Cloudflare Account ID
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Your Cloudflare Email
NEXT_PUBLIC_CLOUDFLARE_EMAIL=your_email@example.com
```

### 4. Getting Cloudflare Credentials

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Account Settings** → **API Tokens**
3. Create a new token with appropriate permissions for Radar API access
4. Copy your API token and Account ID
5. Add them to your `.env.local` file

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

