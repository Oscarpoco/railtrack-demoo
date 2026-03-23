/**
 * StationMarker.jsx — Differentiated train station vs bus stop markers
 */

import { CircleMarker, Tooltip } from "react-leaflet";
import { routes } from "../data/stations.js";

export function StationMarker({ station }) {
  const isInterchange = station.routes.length > 1;
  const isMajor       = station.platforms >= 6;
  const isBusOnly     = station.type === "bus";
  const primary       = routes[station.routes[0]];

  const radius    = isMajor ? 10 : isInterchange ? 8 : isBusOnly ? 5 : 5;
  const weight    = isInterchange ? 3 : 2;
  const fillColor = isInterchange ? "#ffffff" : isBusOnly ? primary?.color ?? "#FF8C00" : primary?.color ?? "#00A8E1";
  const color     = fillColor;

  return (
    <CircleMarker
      center={[station.lat, station.lng]}
      radius={radius}
      pathOptions={{ color, fillColor, fillOpacity: 0.92, weight, dashArray: isBusOnly ? "4 3" : null }}
    >
      <Tooltip
        permanent={isMajor || isInterchange}
        direction="top"
        offset={[0, -8]}
        className="stn-tip"
      >
        <span className="stt-n">{station.name}</span>
        {isInterchange && (
          <span className="stt-dots">
            {station.routes.map(rId => (
              <span key={rId} className="stt-dot" style={{ background: routes[rId]?.color }} />
            ))}
          </span>
        )}
      </Tooltip>
    </CircleMarker>
  );
}
