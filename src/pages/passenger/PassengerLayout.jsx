import { motion } from "framer-motion";
import { NavLink, Outlet } from "react-router-dom";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function PassengerLayout({ vehicles, alerts, onDismiss }) {
  const trains = vehicles.filter((v) => v.vehicleType === "train").length;
  const buses = vehicles.filter((v) => v.vehicleType === "bus").length;
  const onTime = vehicles.filter((v) => v.status === "On Time").length;
  const delayed = vehicles.filter((v) => v.status === "Delayed").length;
  const boarding = vehicles.filter((v) => v.dwellRemaining > 0).length;

  const stats = [
    { val: vehicles.length, lbl: "Active Vehicles", color: "var(--prasa-blue)" },
    { val: trains, lbl: "Metrorail Trains", color: "var(--prasa-blue)" },
    { val: buses, lbl: "Autopax Buses", color: "var(--bus-orange)" },
    { val: onTime, lbl: "On Time", color: "var(--green)" },
    { val: boarding, lbl: "At Platform", color: "var(--amber)" },
    { val: delayed, lbl: "Delayed", color: "var(--red)" },
  ];

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">

      <motion.div className="stats-bar" variants={stagger}>
        {stats.map((s) => (
          <motion.div
            key={s.lbl}
            className="stat-chip"
            variants={fadeUp}
            whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,168,225,0.15)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="stat-val" style={{ color: s.color }}>
              {s.val}
            </span>
            <span className="stat-lbl">{s.lbl}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.nav className="tabs" variants={fadeUp}>
        {[
          { to: "/passenger/trains", label: "Trains", icon: "train" },
          { to: "/passenger/lines", label: "Rail Lines", icon: "route" },
          { to: "/passenger/buses", label: "Buses", icon: "bus" },
          { to: "/passenger/prices", label: "Prices", icon: "ticket" },
          { to: "/passenger/alerts", label: "Alerts", icon: "bell", badge: alerts?.filter(a => a.type === "warning" || a.type === "error").length },
        ].map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => `tab ${isActive ? "tab-active" : ""}`}>
            <Icon name={t.icon} size={13} />
            {t.label}
            {t.badge > 0 && (
              <motion.span
                className="tab-alert-badge"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {t.badge}
              </motion.span>
            )}
          </NavLink>
        ))}
      </motion.nav>

      <motion.div variants={fadeUp} style={{ minHeight: 0 }}>
        <Outlet />
      </motion.div>
    </motion.div>
  );
}

