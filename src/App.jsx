/**
 * App.jsx — Root shell with PRASA logo, live clock, Framer Motion page transitions
 */

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTrainSimulation }   from "./hooks/useTrainSimulation.js";
import { PassengerLayout }      from "./pages/passenger/PassengerLayout.jsx";
import { PassengerTrains }      from "./pages/passenger/PassengerTrains.jsx";
import { PassengerLines }       from "./pages/passenger/PassengerLines.jsx";
import { PassengerBuses }       from "./pages/passenger/PassengerBuses.jsx";
import { PassengerPrices }      from "./pages/passenger/PassengerPrices.jsx";
import { PassengerAlerts }      from "./pages/passenger/PassengerAlerts.jsx";
import { ControlCenterLayout }  from "./pages/control/ControlCenterLayout.jsx";
import { ControlMapTab }        from "./pages/control/ControlMapTab.jsx";
import { ControlLinesTab }      from "./pages/control/ControlLinesTab.jsx";
import { ControlOverviewTab }   from "./pages/control/ControlOverviewTab.jsx";
import { Icon }                 from "./components/Icons.jsx";
import "./styles/dashboard.css";

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(()=>{ const iv=setInterval(()=>setT(new Date()),1000); return()=>clearInterval(iv); },[]);
  return t;
}

export default function App() {
  const { trains:vehicles, alerts, simulateDelay, clearDelay, sendAlert, dismissAlert } = useTrainSimulation();
  const now      = useClock();
  const delayed  = vehicles.filter(v=>v.status==="Delayed").length;
  const trains   = vehicles.filter(v=>v.vehicleType==="train");
  const buses    = vehicles.filter(v=>v.vehicleType==="bus");
  const location = useLocation();

  return (
    <div className="app-shell">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.header className="app-header"
        initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.5, ease:"easeOut" }}>

        {/* Brand — actual PRASA logo */}
        <div className="brand">
          <img
            src="/prasa-logo.png"
            alt="PRASA — Passenger Rail Agency of South Africa"
            className="prasa-logo"
          />
          <div className="brand-divider"/>
          <div className="brand-product">
            <span className="bp-name">RailTrack</span>
            <span className="bp-sub">Network Operations Centre</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hdr-nav">
          {[
            { to:"/passenger", icon:"dashboard", label:"Passenger" },
            { to:"/control", icon:"gear", label:"Control Centre" },
          ].map(n => (
            <motion.div key={n.to} whileHover={{ y:-1 }} whileTap={{ scale:0.98 }}>
              <NavLink to={n.to} end={false} className={({ isActive }) => `nav-btn ${isActive ? "nav-active" : ""}`}>
                {({ isActive }) => (
                  <>
                    <Icon name={n.icon} size={14} />
                    {n.label}
                    {isActive && <motion.div className="nav-indicator" layoutId="nav-indicator" />}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Status chips */}
        <div className="hdr-status">
          <div className="status-row">
            <span className="schip schip-blue">
              <Icon name="train" size={12}/>
              {trains.length} trains
            </span>
            <span className="schip schip-orange">
              <Icon name="bus" size={12}/>
              {buses.length} buses
            </span>
            {delayed > 0 && (
              <motion.span className="schip schip-red"
                animate={{opacity:[1,0.5,1]}} transition={{repeat:Infinity,duration:1.5}}>
                <Icon name="warning" size={12}/>
                {delayed} delay{delayed!==1?"s":""}
              </motion.span>
            )}
          </div>
          <div className="hdr-clock">
            <span className="live-dot"/>{now.toLocaleTimeString("en-ZA",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
          </div>
        </div>
      </motion.header>

      {/* ── Page ────────────────────────────────────────────────────────────── */}
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity:0, x:20 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-20 }}
            transition={{ duration:0.25, ease:"easeInOut" }}
            style={{ height:"100%" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/passenger/trains" replace />} />

              <Route
                path="/passenger"
                element={<PassengerLayout vehicles={vehicles} alerts={alerts} onDismiss={dismissAlert} />}
              >
                <Route index element={<Navigate to="trains" replace />} />
                <Route path="trains" element={<PassengerTrains vehicles={vehicles} />} />
                <Route path="lines" element={<PassengerLines vehicles={vehicles} />} />
                <Route path="buses" element={<PassengerBuses vehicles={vehicles} />} />
                <Route path="prices" element={<PassengerPrices />} />
                <Route path="alerts" element={<PassengerAlerts alerts={alerts} onDismiss={dismissAlert} />} />
              </Route>

              <Route
                path="/control"
                element={
                  <ControlCenterLayout
                    alerts={alerts}
                    onDismiss={dismissAlert}
                  />
                }
              >
                <Route index element={<Navigate to="map/train" replace />} />
                <Route path="map/bus" element={<ControlMapTab vehicles={vehicles} mode="bus" />} />
                <Route path="map/train" element={<ControlMapTab vehicles={vehicles} mode="train" />} />
                <Route path="lines" element={<ControlLinesTab vehicles={vehicles} />} />
                <Route path="overview" element={<ControlOverviewTab vehicles={vehicles} onSimulateDelay={simulateDelay} onClearDelay={clearDelay} onSendAlert={sendAlert} />} />
              </Route>

              <Route path="*" element={<Navigate to="/passenger/trains" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="app-footer">
        <span>RailTrack Demo</span>
        <span className="fsep">·</span>
        <span>PRASA Metrorail &amp; Autopax Gauteng</span>
        <span className="fsep">·</span>
        <span className="ftag">Be moved</span>
        <span className="fsep">·</span>
        <span>Simulated data — not for operational use</span>
      </footer>
    </div>
  );
}
