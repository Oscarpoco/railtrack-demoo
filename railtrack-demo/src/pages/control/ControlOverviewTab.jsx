import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../../components/Icons.jsx";
import { routes } from "../../data/stations.js";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

export function ControlOverviewTab({ vehicles, onSimulateDelay, onClearDelay, onSendAlert }) {
  const [expanded, setExpanded] = useState(null);
  const [delayMins, setDelayMins] = useState({});
  const [alertMsgs, setAlertMsgs] = useState({});

  const rGroups = Object.values(routes).map((r) => ({
    route: r,
    vehicles: vehicles.filter((v) => v.routeId === r.id),
  }));

  function applyDelay(id) {
    onSimulateDelay(id, parseInt(delayMins[id] ?? "10", 10));
  }
  function sendMsg(id) {
    const m = (alertMsgs[id] ?? "").trim();
    if (m) {
      onSendAlert(id, m);
      setAlertMsgs((p) => ({ ...p, [id]: "" }));
    }
  }

  return (
    <div className="cc-grid">
      <motion.div className="cc-left" variants={fadeUp} initial="hidden" animate="show">
        {rGroups.map(({ route: r, vehicles: rv }) => {
          const isBus = r.vehicleType === "bus";
          return (
            <section key={r.id} className="panel">
              <div className="panel-hdr" style={{ borderLeft: `4px solid ${r.color}` }}>
                <div className="panel-ttl" style={{ color: r.color }}>
                  <Icon name={isBus ? "bus" : "route"} size={14} />
                  {r.name}
                  <span className="rh-op">· {r.operator}</span>
                  <span className="rh-desc">{r.description}</span>
                </div>
                <span className="cnt-tag">
                  {rv.length} vehicle{rv.length !== 1 ? "s" : ""}
                </span>
              </div>

              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Status</th>
                    <th>Direction</th>
                    <th>Next Stop</th>
                    <th>ETA</th>
                    <th>Speed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rv.map((v) => {
                    const isExp = expanded === v.id;
                    const isDelayed = v.status === "Delayed";
                    const isBoarding = v.dwellRemaining > 0;
                    return (
                      <>
                        <motion.tr
                          key={v.id}
                          className={`cc-row ${isExp ? "cc-open" : ""} ${isDelayed ? "cc-del" : ""}`}
                          onClick={() => setExpanded(isExp ? null : v.id)}
                          whileHover={{ backgroundColor: "rgba(0,168,225,0.05)" }}
                        >
                          <td>
                            <span className="vid" style={{ color: r.color }}>
                              {v.id}
                            </span>
                          </td>
                          <td>
                            <motion.span
                              className={`spill ${isDelayed ? "spill-d" : isBoarding ? "spill-b" : "spill-ok"}`}
                              animate={isDelayed ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                              transition={isDelayed ? { repeat: Infinity, duration: 1.5 } : {}}
                            >
                              {isBoarding ? "Boarding" : v.status}
                            </motion.span>
                          </td>
                          <td>
                            <span className="dir-cell">
                              <Icon name={v.direction === 1 ? "northbound" : "southbound"} size={12} />
                              {v.dirLabel}
                            </span>
                          </td>
                          <td className="scell">{isBoarding ? `● ${v.nextStation}` : v.nextStation}</td>
                          <td className="mono">{isBoarding ? "—" : `${v.eta} min`}</td>
                          <td className="mono">{isBoarding ? 0 : v.speed} km/h</td>
                          <td>
                            <div className="act-row">
                              {isDelayed ? (
                                <motion.button
                                  className="btn btn-ok"
                                  whileTap={{ scale: 0.94 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onClearDelay(v.id);
                                  }}
                                >
                                  <Icon name="check" size={12} />
                                  Clear
                                </motion.button>
                              ) : (
                                <motion.button
                                  className="btn btn-warn"
                                  whileTap={{ scale: 0.94 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyDelay(v.id);
                                  }}
                                >
                                  <Icon name="delay" size={12} />
                                  Delay
                                </motion.button>
                              )}
                              <motion.button
                                className="btn btn-ghost"
                                whileTap={{ scale: 0.94 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpanded(isExp ? null : v.id);
                                }}
                              >
                                <Icon name={isExp ? "chevronUp" : "chevronDown"} size={12} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>

                        <AnimatePresence>
                          {isExp && (
                            <tr key={`${v.id}-exp`}>
                              <td colSpan={7} style={{ padding: 0 }}>
                                <motion.div
                                  className="exp-row"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                >
                                  <div className="exp-sec">
                                    <label className="exp-lbl">
                                      <Icon name="delay" size={11} />
                                      Delay (minutes)
                                    </label>
                                    <div className="exp-inp-row">
                                      <input
                                        className="cc-input"
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={delayMins[v.id] ?? 10}
                                        onChange={(e) => setDelayMins((p) => ({ ...p, [v.id]: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <motion.button
                                        className="btn btn-warn"
                                        whileTap={{ scale: 0.94 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          applyDelay(v.id);
                                        }}
                                      >
                                        Apply
                                      </motion.button>
                                    </div>
                                  </div>

                                  <div className="exp-sec exp-wide">
                                    <label className="exp-lbl">
                                      <Icon name="broadcast" size={11} />
                                      Broadcast Alert
                                    </label>
                                    <div className="exp-inp-row">
                                      <input
                                        className="cc-input cc-wide"
                                        type="text"
                                        placeholder="Enter message…"
                                        value={alertMsgs[v.id] ?? ""}
                                        onChange={(e) => setAlertMsgs((p) => ({ ...p, [v.id]: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") sendMsg(v.id);
                                        }}
                                      />
                                      <motion.button
                                        className="btn btn-blue"
                                        whileTap={{ scale: 0.94 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          sendMsg(v.id);
                                        }}
                                      >
                                        <Icon name="broadcast" size={12} />
                                        Send
                                      </motion.button>
                                    </div>
                                  </div>

                                  <div className="exp-sec">
                                    <label className="exp-lbl">
                                      <Icon name="person" size={11} />
                                      Passenger Load — {Math.round((v.passengerLoad / v.capacity) * 100)}%
                                    </label>
                                    <div className="exp-load-track">
                                      <motion.div
                                        className={`load-fill ${
                                          v.passengerLoad / v.capacity >= 1 ? "lf-full" : v.passengerLoad / v.capacity >= 0.8 ? "lf-hi" : "lf-ok"
                                        }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.round((v.passengerLoad / v.capacity) * 100))}%` }}
                                        transition={{ duration: 0.6 }}
                                      />
                                    </div>
                                    <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                      {v.passengerLoad} / {v.capacity}
                                    </span>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </motion.div>

      <motion.div className="cc-right" variants={fadeUp} initial="hidden" animate="show">
        <section className="panel">
          <div className="panel-hdr">
            <div className="panel-ttl">
              <Icon name="dashboard" size={14} />
              System Overview
            </div>
          </div>
          <div className="mini-grid">
            {vehicles.map((v) => {
              const r = routes[v.routeId] ?? {};
              const lp = Math.round((v.passengerLoad / v.capacity) * 100);
              return (
                <motion.div
                  key={v.id}
                  className={`mini-card ${v.status === "Delayed" ? "mc-del" : ""}`}
                  whileHover={{ y: -3, boxShadow: `0 8px 20px ${r.color}22` }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mc-id" style={{ color: r.color }}>
                    {v.id}
                  </div>
                  <div className="mc-name">{v.name}</div>
                  <div className="mc-row">
                    <span>Line</span>
                    <span>{r.shortName}</span>
                  </div>
                  <div className="mc-row">
                    <span>Load</span>
                    <span>{lp}%</span>
                  </div>
                  <div className="mc-bar">
                    <motion.div
                      className={`load-fill ${lp >= 100 ? "lf-full" : lp >= 80 ? "lf-hi" : "lf-ok"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, lp)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </motion.div>
    </div>
  );
}

