/**
 * stations.js — PRASA RailTrack
 *
 * Three Metrorail train lines + two Autopax bus routes (City to City & Translux).
 * Coordinates are real Gauteng locations.
 *
 * PRASA Brand Colours (Pantone official):
 *   Primary   → Pantone 2995 = #00A8E1 (PRASA Blue)
 *   Secondary → Pantone 7546 = #46525E (Dark Metal Grey)
 */

export const stations = [
  // ── Shared Interchange Hub ─────────────────────────────────────────────────
  { id: "STN_PARK",  name: "Park Station",    shortName: "PARK", lat: -26.2041, lng: 28.0473, platforms: 8, zone: "JHB CBD",          routes: ["R1","R2","R3","B1","B2"], type: "interchange" },

  // ── R1: Northern Line (Metrorail) ──────────────────────────────────────────
  { id: "STN_ROS",   name: "Rosebank",         shortName: "RBNK", lat: -26.1452, lng: 28.0434, platforms: 2, zone: "Northern Suburbs",  routes: ["R1"],          type: "train" },
  { id: "STN_SAN",   name: "Sandton",           shortName: "SNDT", lat: -26.1076, lng: 28.0567, platforms: 3, zone: "Sandton",           routes: ["R1"],          type: "train" },
  { id: "STN_MID",   name: "Midrand",           shortName: "MDRD", lat: -25.9992, lng: 28.1263, platforms: 2, zone: "Midrand",           routes: ["R1"],          type: "train" },
  { id: "STN_CEN",   name: "Centurion",         shortName: "CNTV", lat: -25.8607, lng: 28.1892, platforms: 2, zone: "Centurion",         routes: ["R1"],          type: "train" },
  { id: "STN_PTA",   name: "Pretoria",          shortName: "PRET", lat: -25.7479, lng: 28.2293, platforms: 6, zone: "Pretoria CBD",      routes: ["R1"],          type: "train" },

  // ── R2: Eastern Line (Metrorail) ───────────────────────────────────────────
  { id: "STN_DOO",   name: "Doornfontein",      shortName: "DOOF", lat: -26.1980, lng: 28.0680, platforms: 2, zone: "Inner East",        routes: ["R2"],          type: "train" },
  { id: "STN_GER",   name: "Germiston",         shortName: "GERM", lat: -26.2167, lng: 28.1667, platforms: 4, zone: "Germiston",         routes: ["R2"],          type: "train" },
  { id: "STN_BOK",   name: "Boksburg",          shortName: "BOKS", lat: -26.2134, lng: 28.2585, platforms: 2, zone: "East Rand",         routes: ["R2"],          type: "train" },
  { id: "STN_SPR",   name: "Springs",           shortName: "SPRG", lat: -26.2539, lng: 28.4432, platforms: 3, zone: "East Rand",         routes: ["R2"],          type: "train" },

  // ── R3: Soweto Line (Metrorail) ────────────────────────────────────────────
  { id: "STN_NCA",   name: "New Canada",        shortName: "NCAN", lat: -26.2366, lng: 27.9877, platforms: 2, zone: "West JHB",          routes: ["R3"],          type: "train" },
  { id: "STN_KLP",   name: "Kliptown",          shortName: "KLIP", lat: -26.2551, lng: 27.8889, platforms: 2, zone: "Soweto",            routes: ["R3"],          type: "train" },
  { id: "STN_NAL",   name: "Naledi",            shortName: "NALD", lat: -26.2780, lng: 27.8470, platforms: 2, zone: "Soweto",            routes: ["R3"],          type: "train" },
  { id: "STN_LEN",   name: "Lenasia",           shortName: "LENA", lat: -26.3061, lng: 27.8350, platforms: 2, zone: "South JHB",         routes: ["R3"],          type: "train" },

  // ── B1: City to City (Autopax / PRASA Road) ───────────────────────────────
  { id: "BUS_PARK",  name: "Park Stn Bus Term", shortName: "PKBS", lat: -26.2055, lng: 28.0460, platforms: 6, zone: "JHB CBD",           routes: ["B1"],          type: "bus" },
  { id: "BUS_DOO",   name: "Doornfontein Depot",shortName: "DFBS", lat: -26.1990, lng: 28.0700, platforms: 2, zone: "Inner East",        routes: ["B1"],          type: "bus" },
  { id: "BUS_GER",   name: "Germiston Terminal", shortName: "GTBS", lat: -26.2180, lng: 28.1650, platforms: 3, zone: "Germiston",         routes: ["B1"],          type: "bus" },
  { id: "BUS_KMP",   name: "Kempton Park",       shortName: "KMBS", lat: -26.1000, lng: 28.2333, platforms: 2, zone: "East Rand",         routes: ["B1"],          type: "bus" },
  { id: "BUS_ORT",   name: "OR Tambo Airport",   shortName: "ORBS", lat: -26.1333, lng: 28.2500, platforms: 4, zone: "OR Tambo",          routes: ["B1"],          type: "bus" },

  // ── B2: Translux (Autopax / PRASA Road) ───────────────────────────────────
  { id: "BUS_CRW",   name: "Crown Mines",        shortName: "CWBS", lat: -26.2300, lng: 27.9800, platforms: 2, zone: "West JHB",          routes: ["B2"],          type: "bus" },
  { id: "BUS_SOW",   name: "Soweto Maponya",     shortName: "SWBS", lat: -26.2623, lng: 27.8710, platforms: 2, zone: "Soweto",            routes: ["B2"],          type: "bus" },
  { id: "BUS_LENA",  name: "Lenasia Hub",        shortName: "LNBS", lat: -26.3061, lng: 27.8350, platforms: 2, zone: "South JHB",         routes: ["B2"],          type: "bus" },
  { id: "BUS_ENN",   name: "Ennerdale",          shortName: "ENBS", lat: -26.3500, lng: 27.8050, platforms: 2, zone: "South JHB",         routes: ["B2"],          type: "bus" },
];

// ── Route definitions (PRASA brand + Autopax sub-brands) ─────────────────────
export const routes = {
  R1: {
    id: "R1", vehicleType: "train",
    name: "Northern Line",     shortName: "NORTH",
    color: "#00A8E1",          colorDim: "rgba(0,168,225,0.16)",
    stations: ["STN_PARK","STN_ROS","STN_SAN","STN_MID","STN_CEN","STN_PTA"],
    description: "Park Station → Pretoria via Sandton",
    operator: "Metrorail",
  },
  R2: {
    id: "R2", vehicleType: "train",
    name: "Eastern Line",      shortName: "EAST",
    color: "#0077B6",          colorDim: "rgba(0,119,182,0.16)",
    stations: ["STN_PARK","STN_DOO","STN_GER","STN_BOK","STN_SPR"],
    description: "Park Station → Springs via Germiston",
    operator: "Metrorail",
  },
  R3: {
    id: "R3", vehicleType: "train",
    name: "Soweto Line",       shortName: "SOWETO",
    color: "#00C896",          colorDim: "rgba(0,200,150,0.16)",
    stations: ["STN_PARK","STN_NCA","STN_KLP","STN_NAL","STN_LEN"],
    description: "Park Station → Lenasia via Soweto",
    operator: "Metrorail",
  },
  B1: {
    id: "B1", vehicleType: "bus",
    name: "City to City",      shortName: "C2C",
    color: "#FF8C00",          colorDim: "rgba(255,140,0,0.16)",
    stations: ["BUS_PARK","BUS_DOO","BUS_GER","BUS_KMP","BUS_ORT"],
    description: "Park Station → OR Tambo via East Rand",
    operator: "Autopax",
  },
  B2: {
    id: "B2", vehicleType: "bus",
    name: "Translux",          shortName: "TLUX",
    color: "#C0392B",          colorDim: "rgba(192,57,43,0.16)",
    stations: ["STN_PARK","BUS_CRW","BUS_SOW","BUS_LENA","BUS_ENN"],
    description: "Park Station → Ennerdale via Soweto",
    operator: "Autopax",
  },
};

export function getStation(id)       { return stations.find(s => s.id === id); }
export function getRouteStations(rId){ return routes[rId].stations.map(getStation); }
