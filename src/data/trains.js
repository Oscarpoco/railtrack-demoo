/**
 * trains.js
 * Six Metrorail trains + four Autopax buses across five routes.
 */

export const initialTrains = [
  // ── R1: Northern Line ──────────────────────────────────────────────────────
  { id:"PRASA_101", name:"Metrorail 101", routeId:"R1", vehicleType:"train", routeIndex:0, progress:0.0,  speed:65, status:"On Time", direction: 1, passengerLoad:318, capacity:400 },
  { id:"PRASA_102", name:"Metrorail 102", routeId:"R1", vehicleType:"train", routeIndex:4, progress:0.55, speed:70, status:"On Time", direction:-1, passengerLoad:274, capacity:400 },
  // ── R2: Eastern Line ───────────────────────────────────────────────────────
  { id:"PRASA_201", name:"Metrorail 201", routeId:"R2", vehicleType:"train", routeIndex:0, progress:0.2,  speed:60, status:"On Time", direction: 1, passengerLoad:195, capacity:380 },
  { id:"PRASA_202", name:"Metrorail 202", routeId:"R2", vehicleType:"train", routeIndex:2, progress:0.7,  speed:68, status:"On Time", direction:-1, passengerLoad:350, capacity:380 },
  // ── R3: Soweto Line ────────────────────────────────────────────────────────
  { id:"PRASA_301", name:"Metrorail 301", routeId:"R3", vehicleType:"train", routeIndex:0, progress:0.4,  speed:55, status:"On Time", direction: 1, passengerLoad:356, capacity:380 },
  { id:"PRASA_302", name:"Metrorail 302", routeId:"R3", vehicleType:"train", routeIndex:3, progress:0.2,  speed:58, status:"On Time", direction:-1, passengerLoad:220, capacity:380 },
  // ── B1: City to City ───────────────────────────────────────────────────────
  { id:"AUTOPX_B11", name:"City to City 11", routeId:"B1", vehicleType:"bus", routeIndex:0, progress:0.3, speed:85, status:"On Time", direction: 1, passengerLoad:42, capacity:55 },
  { id:"AUTOPX_B12", name:"City to City 12", routeId:"B1", vehicleType:"bus", routeIndex:2, progress:0.6, speed:80, status:"On Time", direction:-1, passengerLoad:38, capacity:55 },
  // ── B2: Translux ───────────────────────────────────────────────────────────
  { id:"AUTOPX_T21", name:"Translux 21",     routeId:"B2", vehicleType:"bus", routeIndex:0, progress:0.5, speed:90, status:"On Time", direction: 1, passengerLoad:48, capacity:60 },
  { id:"AUTOPX_T22", name:"Translux 22",     routeId:"B2", vehicleType:"bus", routeIndex:3, progress:0.1, speed:88, status:"On Time", direction:-1, passengerLoad:22, capacity:60 },
];
