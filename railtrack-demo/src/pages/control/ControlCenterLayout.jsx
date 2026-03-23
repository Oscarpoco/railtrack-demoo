import { motion } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";
import { AlertPanel } from "../../components/AlertPanel.jsx";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export function ControlCenterLayout({ alerts, onDismiss }) {
  const autoAlerts = alerts.filter(a => a.message.startsWith("⚠ AUTO-DELAY") || a.message.startsWith("🚨 OVERCROWDING") || a.message.startsWith("ℹ ETA") || a.message.startsWith("✓ AUTO-RECOVER") || a.message.startsWith("⚠ DISRUPTION"));
  const autoCount  = autoAlerts.length;

  return (
    <motion.div className="page cc-page" variants={stagger} initial="hidden" animate="show">
      <AlertPanel alerts={alerts} onDismiss={onDismiss} />

      <motion.div className="occ-banner" variants={fadeUp}>
        <div className="occ-left">
          <span className="occ-chip">OCC</span>
          <div>
            <div className="occ-title">Operations Control Centre</div>
            <div className="occ-sub">PRASA · Autopax — Gauteng Network</div>
          </div>
        </div>
        <div className="occ-right">
          {/* Automation engine status */}
          <div className="auto-engine-tag">
            <motion.span
              className="auto-dot"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <Icon name="automation" size={12} />
            <span>Automation Engine Active</span>
            {autoCount > 0 && (
              <motion.span
                className="auto-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {autoCount} auto-event{autoCount !== 1 ? "s" : ""}
              </motion.span>
            )}
          </div>
          <div className="live-tag">
            <span className="live-dot" />
            Simulation Active
          </div>
        </div>
      </motion.div>

      {/* Automation rules summary */}
      <motion.div className="auto-rules-bar" variants={fadeUp}>
        {[
          { icon: "warning",    color: "var(--amber)",      label: "≥95% load → Overcrowding alert" },
          { icon: "delay",      color: "var(--red)",        label: "100% load → Auto-delay" },
          { icon: "info",       color: "var(--prasa-blue)", label: "ETA >25 min → Advisory" },
          { icon: "lightning",  color: "var(--amber)",      label: "Random disruptions simulated" },
          { icon: "check",      color: "var(--green)",      label: "<88% load at station → Auto-recover" },
        ].map((rule) => (
          <div key={rule.label} className="auto-rule-chip">
            <Icon name={rule.icon} size={11} color={rule.color} />
            <span>{rule.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.nav className="tabs tabs-cc" variants={fadeUp}>
        {[
          { to: "/control/map/train", label: "Train Map", icon: "map" },
          { to: "/control/map/bus", label: "Bus Map", icon: "map" },
          { to: "/control/lines", label: "Lines", icon: "route" },
          { to: "/control/overview", label: "System Overview", icon: "dashboard" },
        ].map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}>
            <Icon name={t.icon} size={13} />
            {t.label}
          </NavLink>
        ))}
      </motion.nav>

      <motion.div variants={fadeUp} style={{ minHeight: 0 }}>
        <Outlet />
      </motion.div>
    </motion.div>
  );
}

