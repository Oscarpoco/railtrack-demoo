/**
 * MapView.jsx — Leaflet map with all 5 routes, per-route toggle filters
 */

import { useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { motion } from "framer-motion";
import { StationMarker } from "./StationMarker.jsx";
import { TrainMarker }   from "./TrainMarker.jsx";
import { stations, routes, getStation } from "../data/stations.js";

const routeLines = Object.values(routes).map(r => ({
  ...r,
  coords: r.stations.map(id => { const s = getStation(id); return [s.lat, s.lng]; }),
}));

export function MapView({ vehicles, visibleRouteIds, showPills = true }) {
  const allowed = Array.isArray(visibleRouteIds) && visibleRouteIds.length > 0 ? new Set(visibleRouteIds) : null;
  const initial = Object.keys(routes).reduce((a, k) => {
    a[k] = allowed ? allowed.has(k) : true;
    return a;
  }, {});
  const [vis, setVis] = useState(initial);
  const toggle = id => setVis(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="map-shell">
      {/* Filter pills */}
      {showPills && (
        <div className="map-pills">
          {Object.values(routes).map(r => (
            <motion.button
              key={r.id}
              className={`mpill ${vis[r.id] ? "mpill-on" : "mpill-off"}`}
              style={vis[r.id] ? { background: r.color, borderColor: r.color, color:"#fff" } : { borderColor: r.color, color: r.color }}
              onClick={() => toggle(r.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type:"spring", stiffness:400, damping:20 }}
            >
              <span className="mpill-type">{r.vehicleType === "bus" ? "BUS" : "RAIL"}</span>
              {r.shortName}
            </motion.button>
          ))}
        </div>
      )}

      <MapContainer
        center={[-26.08, 28.12]}
        zoom={10}
        style={{ width:"100%", height:"100%" }}
        scrollWheelZoom
        zoomControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        {routeLines.map(r =>
          vis[r.id] ? (
            <Polyline key={r.id} positions={r.coords}
              pathOptions={{ color: r.color, weight: r.vehicleType==="bus"?3:4, opacity:0.7,
                dashArray: r.vehicleType==="bus" ? "12 8" : "10 6" }} />
          ) : null
        )}
        {stations
          .filter(s => s.routes.some(rId => vis[rId]))
          .map(s => <StationMarker key={s.id} station={s} />)
        }
        {vehicles
          .filter(v => vis[v.routeId])
          .map(v => <TrainMarker key={v.id} vehicle={v} />)
        }
      </MapContainer>
    </div>
  );
}
