/**
 * TrainList.jsx — Animated vehicle status table (trains + buses)
 */

import { motion } from "framer-motion";
import { Icon }   from "./Icons.jsx";
import { routes } from "../data/stations.js";

const row = { hidden:{opacity:0,x:-12}, show:{opacity:1,x:0} };
const list = { hidden:{}, show:{ transition:{ staggerChildren:0.04 } } };

export function TrainList({ vehicles, compact=false }) {
  return (
    <div className="vlist">
      <table className="vtable">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Type</th>
            <th>Line</th>
            <th>Status</th>
            <th>Current Station</th>
            <th>Next Stop</th>
            <th>ETA</th>
            {!compact && <th>Speed</th>}
            {!compact && <th>Load</th>}
          </tr>
        </thead>
        <motion.tbody variants={list} initial="hidden" animate="show">
          {vehicles.map(v => {
            const r         = routes[v.routeId] ?? {};
            const loadPct   = Math.round((v.passengerLoad/v.capacity)*100);
            const isBoarding= v.dwellRemaining > 0;
            const isDelayed = v.status === "Delayed";
            const isBus     = v.vehicleType === "bus";

            return (
              <motion.tr key={v.id} variants={row}
                className={`vrow ${isDelayed?"vrow-d":""}`}
                whileHover={{ backgroundColor:"rgba(0,168,225,0.05)" }}>

                <td>
                  <span className="vid" style={{color: r.color}}>{v.id}</span>
                </td>

                <td>
                  <span className={`type-badge ${isBus?"tbadge-bus":"tbadge-rail"}`}>
                    <Icon name={isBus?"bus":"train"} size={11} style={{marginRight:3}} />
                    {isBus?"Bus":"Rail"}
                  </span>
                </td>

                <td>
                  <span className="rbadge" style={{background:r.colorDim,color:r.color,borderColor:r.color}}>
                    {r.shortName}
                  </span>
                </td>

                <td>
                  <span className={`spill ${isDelayed?"spill-d":isBoarding?"spill-b":"spill-ok"}`}>
                    {isBoarding?"Boarding":v.status}
                  </span>
                </td>

                <td className="scell">
                  {isBoarding ? <span className="at-s">● {v.currentStation}</span> : v.currentStation}
                </td>

                <td className="scell">
                  {isBoarding ? "—" : (
                    <span className="next-s">
                      <Icon name={v.direction===1?"northbound":"southbound"} size={11} style={{marginRight:4,opacity:0.5}} />
                      {v.nextStation}
                    </span>
                  )}
                </td>

                <td>
                  {isBoarding
                    ? <span className="eta-b">Boarding</span>
                    : <span className={`eta-v ${v.eta<=2?"eta-hot":""}`}>{v.eta} min</span>
                  }
                </td>

                {!compact && <td className="mono">{isBoarding?0:v.speed} km/h</td>}

                {!compact && (
                  <td>
                    <div className="load-row">
                      <div className="load-track">
                        <motion.div
                          className={`load-fill ${loadPct>=100?"lf-full":loadPct>=80?"lf-hi":"lf-ok"}`}
                          initial={{ width:0 }}
                          animate={{ width:`${Math.min(100,loadPct)}%` }}
                          transition={{ duration:0.6, ease:"easeOut" }}
                        />
                      </div>
                      <span className="load-lbl">{loadPct}%</span>
                    </div>
                  </td>
                )}
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
