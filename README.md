# RailTrack Demo 🚆

A PRASA Metrorail frontend prototype — live train tracking & control centre simulation.

Built with **Vite + React + Leaflet**. No backend required — all data is simulated in the frontend.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in your browser
# http://localhost:5173
```

---

## Project Structure

```
railtrack-demo/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── App.jsx                        ← Root app + navigation
    ├── main.jsx                       ← React entry point
    ├── components/
    │   ├── MapView.jsx                ← Leaflet map container
    │   ├── TrainMarker.jsx            ← Animated train icon on map
    │   ├── StationMarker.jsx          ← Station circle markers
    │   ├── TrainList.jsx              ← Train status table
    │   └── AlertPanel.jsx             ← Alert banner component
    ├── data/
    │   ├── stations.js                ← Station coordinates + metadata
    │   └── trains.js                  ← Initial train state
    ├── hooks/
    │   └── useTrainSimulation.js      ← Core simulation hook
    ├── pages/
    │   ├── PassengerDashboard.jsx     ← Public passenger info page
    │   └── ControlCenter.jsx          ← Operations control centre
    └── styles/
        └── dashboard.css              ← All styles (plain CSS)
```

---

## Features

### Passenger Dashboard
- Live Leaflet map with animated train markers
- Train status board with real-time ETAs
- Station reference panel
- Active alert banners

### Control Centre
- Full train control matrix table
- Per-train **Simulate Delay** button (configurable minutes)
- **Send Alert** broadcast per train
- Live position feed map
- System overview cards with passenger load bars

### Simulation Engine (`useTrainSimulation`)
- Trains move every 200ms using Haversine distance calculation
- Speed-accurate interpolation between stations
- 4-second platform dwell simulation
- Direction reversal at end-of-line
- Delay flag slows the train's effective speed

---

## The Corridor

```
Park Station → Rosebank → Sandton → Midrand → Centurion → Pretoria
```

Trains 001 & 002 run northbound, Train 003 runs southbound, Train 004 starts at Rosebank northbound.

---

## Tech Stack

| Tool | Version |
|---|---|
| Vite | ^5.0 |
| React | ^18.2 |
| Leaflet | ^1.9.4 |
| react-leaflet | ^4.2.1 |

Map tiles: **CartoDB Dark Matter** (OpenStreetMap data)

---

## Notes
- This is a **frontend-only prototype**. All data is simulated.
- Not for operational or safety-critical use.
- To extend: replace `useTrainSimulation.js` with a WebSocket connection to a real GTFS-RT feed.
