/**
 * useTrainSimulation.js
 * Multi-route simulation for both trains and buses.
 * Delay alerts persist for 2 minutes; info/success for 60 s.
 *
 * AUTOMATION ENGINE:
 *  - Overcrowding: passenger load ≥ 95% triggers an info alert (once per vehicle per boarding stop)
 *  - Overcrowding sustained: load ≥ 100% for 2+ ticks → vehicle marked Delayed, speed cut
 *  - Long ETA: ETA > 25 min while On Time → advisory alert (once per ETA spike)
 *  - Random minor delays: ~0.3% chance per tick per vehicle to simulate real-world disruption
 *  - Auto-recovery: delayed vehicle recovers once it boards (reaches a station) and load < 90%
 *  - Service reminders: platform dwell alerts for overcrowded vehicles at boarding stops
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { initialTrains } from "../data/trains.js";
import { routes, getStation } from "../data/stations.js";

const TICK_MS   = 200;
const DWELL_MS  = 4000;
const ALERT_TTL = { warning: 120_000, error: 120_000, info: 60_000, success: 45_000 };

// Automation thresholds
const OVERLOAD_ALERT_PCT  = 0.95;   // 95% load → info alert
const OVERLOAD_DELAY_PCT  = 1.00;   // 100% load → auto-delay
const LONG_ETA_MINS       = 25;     // ETA > 25 min → advisory
const RANDOM_DELAY_CHANCE = 0.003;  // 0.3% chance per tick per vehicle
const AUTO_RECOVER_PCT    = 0.88;   // below 88% load + at station → recover

// ── Helpers ───────────────────────────────────────────────────────────────────
function routeStations(routeId) { return routes[routeId].stations.map(getStation); }
function routeLen(routeId)      { return routes[routeId].stations.length; }
function stationAt(routeId, i)  {
  const list = routeStations(routeId);
  return list[Math.max(0, Math.min(list.length - 1, i))];
}

function haversineKm(la1, ln1, la2, ln2) {
  const R = 6371, dLat = (la2-la1)*Math.PI/180, dLng = (ln2-ln1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function lerp(a, b, t) { return { lat: a.lat+(b.lat-a.lat)*t, lng: a.lng+(b.lng-a.lng)*t }; }
function calcETA(progress, speed, from, to) {
  const km = haversineKm(from.lat,from.lng,to.lat,to.lng)*(1-progress);
  return Math.max(1,Math.round(km/speed*60));
}
function dirLabel(routeId, dir) {
  const stns = routeStations(routeId);
  return dir===1 ? `→ ${stns[stns.length-1].name}` : `← ${stns[0].name}`;
}

function seedVehicle(t) {
  const len  = routeLen(t.routeId);
  const from = stationAt(t.routeId, t.routeIndex);
  const ni   = Math.max(0, Math.min(len-1, t.routeIndex+t.direction));
  const to   = stationAt(t.routeId, ni);
  const pos  = lerp(from, to, t.progress);
  return { ...t, lat:pos.lat, lng:pos.lng,
    currentStation: from.name, nextStation: to.name, nextStationId: to.id,
    eta: calcETA(t.progress, t.speed, from, to),
    dirLabel: dirLabel(t.routeId, t.direction),
    dwellRemaining: 0,
    routeColor: routes[t.routeId].color,
    _autoDelayed: false,    // internal: was auto-delayed by engine
    _loadAlerted: false,    // internal: overcrowding alert already sent
    _etaAlerted:  false,    // internal: long-ETA alert already sent
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTrainSimulation() {
  const [trains, setTrains]   = useState(() => initialTrains.map(seedVehicle));
  const [alerts, setAlerts]   = useState([]);
  const alertId = useRef(0);

  const addAlert = useCallback((message, type="warning") => {
    const id = ++alertId.current;
    setAlerts(p => [{ id, message, type, timestamp:new Date() }, ...p.slice(0,29)]);
    setTimeout(() => setAlerts(p => p.filter(a => a.id!==id)), ALERT_TTL[type]??ALERT_TTL.warning);
  }, []);

  const dismissAlert  = useCallback(id => setAlerts(p=>p.filter(a=>a.id!==id)), []);

  const simulateDelay = useCallback((trainId, mins=10) => {
    setTrains(p => p.map(t => {
      if(t.id!==trainId) return t;
      const newEta = t.eta+mins;
      const r = routes[t.routeId];
      addAlert(`${t.id} — ${t.name} is delayed by ${mins} min on ${r.name}. New ETA to ${t.nextStation}: ${newEta} min`, "warning");
      return {...t, status:"Delayed", speed:Math.max(10,Math.round(t.speed*0.4)), eta:newEta};
    }));
  }, [addAlert]);

  const clearDelay = useCallback((trainId) => {
    setTrains(p => p.map(t => {
      if(t.id!==trainId) return t;
      const orig = initialTrains.find(i=>i.id===trainId);
      addAlert(`${t.id} — ${t.name} has resumed normal service`, "success");
      return {...t, status:"On Time", speed:orig?.speed??60, _autoDelayed:false, _etaAlerted:false};
    }));
  }, [addAlert]);

  const sendAlert = useCallback((trainId, message) => {
    const t = trains.find(v=>v.id===trainId);
    const rName = t ? routes[t.routeId].name : "";
    addAlert(`[${trainId} · ${rName}] ${message}`, "info");
  }, [trains, addAlert]);

  // ── Tick + Automation Engine ───────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setTrains(prev => {
        const next = prev.map(t => {
          // ── Movement ──────────────────────────────────────────────────────
          if(t.dwellRemaining > 0) {
            const stillDwelling = t.dwellRemaining - TICK_MS;

            // Auto-recover at station: delayed + low load + dwell started
            if (
              t.status === "Delayed" && t._autoDelayed &&
              (t.passengerLoad / t.capacity) < AUTO_RECOVER_PCT &&
              stillDwelling <= DWELL_MS - TICK_MS  // not first dwell tick
            ) {
              const orig = initialTrains.find(i=>i.id===t.id);
              // We queue the alert outside setTrains below
              return { ...t, dwellRemaining: stillDwelling,
                status: "On Time", speed: orig?.speed ?? 60,
                _autoDelayed: false, _etaAlerted: false,
                _justRecovered: true };
            }
            return {...t, dwellRemaining: stillDwelling, _justRecovered: false};
          }

          const len  = routeLen(t.routeId);
          const from = stationAt(t.routeId, t.routeIndex);
          let dir = t.direction;
          let ni  = t.routeIndex+dir;
          if(ni<0)   { dir= 1; ni=1; }
          if(ni>=len){ dir=-1; ni=len-2; }
          const to = stationAt(t.routeId, ni);

          const segKm  = haversineKm(from.lat,from.lng,to.lat,to.lng);
          const deltaP = (t.speed/3600*(TICK_MS/1000)) / segKm;
          const newP   = t.progress+deltaP;

          if(newP >= 1.0) {
            let nd = dir;
            const ai = ni+nd;
            if(ai<0||ai>=len) nd=-nd;
            const ca = Math.max(0,Math.min(len-1,ni+nd));
            const nextTo = stationAt(t.routeId, ca);
            return { ...t, direction:nd, routeIndex:ni, progress:0.0,
              lat:to.lat, lng:to.lng,
              currentStation:to.name, nextStation:nextTo.name, nextStationId:nextTo.id,
              eta:calcETA(0,t.speed,to,nextTo),
              dirLabel:dirLabel(t.routeId,nd), dwellRemaining:DWELL_MS,
              _loadAlerted: false,  // reset per station arrival
              _etaAlerted:  false,
              _justRecovered: false,
            };
          }
          const pos = lerp(from, to, newP);
          return { ...t, direction:dir, progress:newP,
            lat:pos.lat, lng:pos.lng,
            currentStation:from.name, nextStation:to.name, nextStationId:to.id,
            eta:calcETA(newP,t.speed,from,to), dirLabel:dirLabel(t.routeId,dir),
            _justRecovered: false,
          };
        });

        // ── Automation: fire alerts after movement ─────────────────────────
        // (We read `next` and call addAlert; state is already queued above)
        next.forEach(t => {
          const r     = routes[t.routeId];
          const load  = t.passengerLoad / t.capacity;

          // Recovery alert
          if (t._justRecovered) {
            addAlert(`✓ AUTO-RECOVER · ${t.id} — ${t.name} resumed normal service after load eased (${Math.round(load*100)}% capacity)`, "success");
          }

          // Overcrowding → info alert (once per station stop)
          if (load >= OVERLOAD_ALERT_PCT && !t._loadAlerted && t.status !== "Delayed") {
            addAlert(`🚨 OVERCROWDING · ${t.id} — ${t.name} at ${Math.round(load*100)}% capacity on ${r.name}. Expect delays boarding at ${t.currentStation}.`, "info");
          }

          // Overcrowding → auto-delay (load ≥ 100%)
          if (load >= OVERLOAD_DELAY_PCT && t.status !== "Delayed" && !t._autoDelayed) {
            addAlert(`⚠ AUTO-DELAY · ${t.id} — ${t.name} is at full capacity (${t.passengerLoad}/${t.capacity}). Service delayed on ${r.name}.`, "warning");
          }

          // Long ETA advisory (once per spike)
          if (t.eta > LONG_ETA_MINS && t.status === "On Time" && !t._etaAlerted && t.dwellRemaining === 0) {
            addAlert(`ℹ ETA ADVISORY · ${t.id} — ${t.name}: ${t.eta} min to ${t.nextStation} on ${r.name}. Plan your journey accordingly.`, "info");
          }

          // Random minor disruption
          if (t.status === "On Time" && Math.random() < RANDOM_DELAY_CHANCE) {
            const delayMins = 5 + Math.floor(Math.random() * 10);
            addAlert(`⚠ DISRUPTION · ${t.id} — ${t.name} delayed ${delayMins} min on ${r.name} due to signal interference near ${t.currentStation}.`, "warning");
          }
        });

        // Apply flag updates for alerts that were just triggered
        return next.map(t => {
          const load = t.passengerLoad / t.capacity;
          let updates = {};

          if (load >= OVERLOAD_ALERT_PCT && !t._loadAlerted && t.status !== "Delayed") {
            updates._loadAlerted = true;
          }
          if (load >= OVERLOAD_DELAY_PCT && t.status !== "Delayed" && !t._autoDelayed) {
            updates = { ...updates,
              status: "Delayed",
              speed: Math.max(8, Math.round(t.speed * 0.35)),
              _autoDelayed: true,
            };
          }
          if (t.eta > LONG_ETA_MINS && t.status === "On Time" && !t._etaAlerted && t.dwellRemaining === 0) {
            updates._etaAlerted = true;
          }
          if (Math.random() < RANDOM_DELAY_CHANCE && t.status === "On Time") {
            const delayMins = 5 + Math.floor(Math.random() * 10);
            updates = { ...updates,
              status: "Delayed",
              eta: t.eta + delayMins,
              speed: Math.max(10, Math.round(t.speed * 0.4)),
              _autoDelayed: true,
            };
          }

          return Object.keys(updates).length ? { ...t, ...updates } : t;
        });
      });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [addAlert]);

  return { trains, alerts, simulateDelay, clearDelay, sendAlert, dismissAlert };
}

