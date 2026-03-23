/**
 * TrainMarker.jsx
 * Train and bus markers for the Leaflet map.
 * Uses actual SVG icons styled with PRASA route colours.
 */

import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { routes } from "../data/stations.js";

function createIcon(vehicle) {
  const r = routes[vehicle.routeId] ?? {};
  const statusColor = vehicle.status === "Delayed"
    ? "#e53e3e"
    : vehicle.dwellRemaining > 0
    ? "#f59e0b"
    : r.color ?? "#00A8E1";

  const isBus = vehicle.vehicleType === "bus";

  const svgBody = isBus
    ? `<rect x="1" y="4" width="22" height="14" rx="2" stroke="${statusColor}" stroke-width="1.8" fill="none"/>
       <line x1="1" y1="10" x2="23" y2="10" stroke="${statusColor}" stroke-width="1.8"/>
       <rect x="4" y="6" width="4" height="3" rx="0.5" fill="${statusColor}"/>
       <rect x="16" y="6" width="4" height="3" rx="0.5" fill="${statusColor}"/>
       <circle cx="7" cy="20" r="2" fill="${statusColor}"/>
       <circle cx="17" cy="20" r="2" fill="${statusColor}"/>
       <line x1="7" y1="18" x2="7" y2="20" stroke="${statusColor}" stroke-width="1.8"/>
       <line x1="17" y1="18" x2="17" y2="20" stroke="${statusColor}" stroke-width="1.8"/>`
    : `<rect x="2" y="4" width="20" height="13" stroke="${statusColor}" stroke-width="1.8" fill="none"/>
       <rect x="5" y="7" width="5" height="3" fill="${statusColor}"/>
       <rect x="14" y="7" width="5" height="3" fill="${statusColor}"/>
       <line x1="2" y1="12" x2="22" y2="12" stroke="${statusColor}" stroke-width="1.8"/>
       <line x1="2" y1="17" x2="5" y2="20" stroke="${statusColor}" stroke-width="1.8"/>
       <line x1="22" y1="17" x2="19" y2="20" stroke="${statusColor}" stroke-width="1.8"/>
       <circle cx="7" cy="19" r="1.4" fill="${statusColor}"/>
       <circle cx="17" cy="19" r="1.4" fill="${statusColor}"/>`;

  const label = vehicle.id.replace("PRASA_","").replace("AUTOPX_","");

  const html = `
    <div class="vm-root" style="--vc:${statusColor}">
      <div class="vm-ring"></div>
      <div class="vm-box">
        <svg width="20" height="22" viewBox="0 0 24 24" fill="none">${svgBody}</svg>
      </div>
      <div class="vm-labels">
        <span class="vm-route" style="background:${r.color ?? '#00A8E1'}">${r.shortName ?? ""}</span>
        <span class="vm-id">${label}</span>
      </div>
    </div>`;

  return L.divIcon({ html, className:"", iconSize:[60,60], iconAnchor:[30,30], popupAnchor:[0,-34] });
}

export function TrainMarker({ vehicle }) {
  const markerRef = useRef(null);
  useEffect(() => {
    if (markerRef.current) markerRef.current.setIcon(createIcon(vehicle));
  }, [vehicle.status, vehicle.dwellRemaining]);

  const r = routes[vehicle.routeId] ?? {};
  const loadPct = Math.round((vehicle.passengerLoad / vehicle.capacity) * 100);
  const loadLbl = loadPct >= 100 ? "At Capacity" : loadPct >= 80 ? "Crowded" : loadPct >= 50 ? "Moderate" : "Light";
  const isBoarding = vehicle.dwellRemaining > 0;

  return (
    <Marker ref={markerRef} position={[vehicle.lat, vehicle.lng]} icon={createIcon(vehicle)}>
      <Popup className="veh-popup">
        <div className="popup-inner">
          <div className="popup-head" style={{ borderLeft:`3px solid ${r.color}` }}>
            <span className="popup-vid">{vehicle.id}</span>
            <span className={`popup-sbadge ${vehicle.status==="Delayed"?"sbadge-d":isBoarding?"sbadge-b":"sbadge-ok"}`}>
              {isBoarding ? "Boarding" : vehicle.status}
            </span>
          </div>
          <div className="popup-rline" style={{ color: r.color }}>
            {r.operator} · {r.name} · {vehicle.dirLabel}
          </div>
          <table className="popup-tbl">
            <tbody>
              <tr><td>Vehicle</td><td>{vehicle.name}</td></tr>
              <tr><td>Type</td><td style={{textTransform:"capitalize"}}>{vehicle.vehicleType}</td></tr>
              <tr><td>At</td><td>{vehicle.currentStation}</td></tr>
              <tr><td>Next</td><td>{vehicle.nextStation}</td></tr>
              <tr><td>ETA</td><td>{isBoarding?"Boarding":`${vehicle.eta} min`}</td></tr>
              <tr><td>Speed</td><td>{isBoarding?0:vehicle.speed} km/h</td></tr>
              <tr><td>Load</td><td>{vehicle.passengerLoad}/{vehicle.capacity} — {loadLbl}</td></tr>
            </tbody>
          </table>
        </div>
      </Popup>
    </Marker>
  );
}
