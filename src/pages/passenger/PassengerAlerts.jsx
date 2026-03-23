/**
 * PassengerAlerts.jsx
 * Passenger-facing alerts tab.
 *
 * Key fix: AnimatePresence initial={false} + mode="popLayout"
 * means existing cards NEVER re-animate when a new alert arrives.
 * Only brand-new cards slide in; dismissed cards slide out.
 * The "X ago" timestamp refreshes every 30 s via a local clock,
 * completely decoupled from the parent 200 ms simulation tick.
 */

import { useState, useEffect, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../../components/Icons.jsx";

const TYPE_CONFIG = {
  warning: { icon: "warning", label: "Delay",    cls: "aw", color: "var(--amber)",      bg: "rgba(245,158,11,0.08)"  },
  error:   { icon: "warning", label: "Critical",  cls: "ae", color: "var(--red)",        bg: "rgba(239,68,68,0.08)"   },
  info:    { icon: "info",    label: "Info",      cls: "ai", color: "var(--prasa-blue)", bg: "rgba(0,168,225,0.08)"   },
  success: { icon: "check",   label: "Resolved",  cls: "as", color: "var(--green)",      bg: "rgba(34,197,94,0.08)"   },
};

const FILTERS = [
  { key: "all",     label: "All",      icon: "bell"    },
  { key: "warning", label: "Delays",   icon: "delay"   },
  { key: "error",   label: "Critical", icon: "warning" },
  { key: "info",    label: "Info",     icon: "info"    },
  { key: "success", label: "Resolved", icon: "check"   },
];

function timeAgo(date, now) {
  const secs = Math.floor((now - date.getTime()) / 1000);
  if (secs < 5)    return "just now";
  if (secs < 60)   return secs + "s ago";
  if (secs < 3600) return Math.floor(secs / 60) + "m ago";
  return Math.floor(secs / 3600) + "h ago";
}

// memo: card only re-renders when its own props change, not on parent ticks
const AlertCard = memo(function AlertCard({ a, onDismiss, now }) {
  const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
  return (
    <motion.div
      className={"pax-alert-card " + cfg.cls}
      style={{ "--alert-color": cfg.color, "--alert-bg": cfg.bg }}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, x: 48, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      layout="position"
    >
      <div className="pac-icon-wrap">
        <Icon name={cfg.icon} size={18} color={cfg.color} />
      </div>

      <div className="pac-body">
        <div className="pac-top">
          <span className="pac-type-badge" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>
          <span className="pac-time">
            {a.timestamp.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
            {" · "}{timeAgo(a.timestamp, now)}
          </span>
        </div>
        <p className="pac-message">{a.message}</p>
      </div>

      <motion.button
        className="pac-dismiss"
        onClick={() => onDismiss(a.id)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        title="Dismiss"
      >
        <Icon name="close" size={12} />
      </motion.button>
    </motion.div>
  );
});

export function PassengerAlerts({ alerts, onDismiss }) {
  const [filter, setFilter] = useState("all");

  // Slow clock — only updates every 30 s for "X ago" labels
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(iv);
  }, []);

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.type === filter);

  const counts = {};
  for (const a of alerts) counts[a.type] = (counts[a.type] || 0) + 1;

  return (
    <motion.div
      className="pax-alerts-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Filter bar */}
      <div className="pax-alert-filters">
        {FILTERS.map(f => {
          const cnt = f.key === "all" ? alerts.length : (counts[f.key] || 0);
          return (
            <motion.button
              key={f.key}
              className={"pax-filter-btn " + (filter === f.key ? "paf-active" : "")}
              onClick={() => setFilter(f.key)}
              whileTap={{ scale: 0.96 }}
            >
              <Icon name={f.icon} size={13} />
              {f.label}
              {cnt > 0 && <span className="paf-badge">{cnt}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <motion.div className="pax-no-alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Icon name="check" size={40} color="var(--green)" />
          <p className="pna-title">All clear</p>
          <p className="pna-sub">
            No {filter === "all" ? "" : ((FILTERS.find(f2 => f2.key === filter) || {}).label || "").toLowerCase() + " "}alerts at this time.
          </p>
        </motion.div>
      ) : (
        <div className="pax-alert-list">
          {/* initial={false}: cards already in the list don't animate on each new arrival */}
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map(a => (
              <AlertCard key={a.id} a={a} onDismiss={onDismiss} now={now} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="pax-alert-footer">
        <span className="live-dot" />
        <span>Live · alerts update automatically</span>
      </div>
    </motion.div>
  );
}
