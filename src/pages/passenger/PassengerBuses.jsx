import { motion } from "framer-motion";
import { TrainList } from "../../components/TrainList.jsx";
import { routes } from "../../data/stations.js";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

export function PassengerBuses({ vehicles }) {
  const buses = vehicles.filter((v) => v.vehicleType === "bus");
  const busRoutes = Object.values(routes).filter((r) => r.vehicleType === "bus");

  return (
    <div className="passenger-stack">
      <motion.section className="panel" variants={fadeUp} initial="hidden" animate="show">
        <div className="panel-hdr">
          <div className="panel-ttl">
            <Icon name="signal" size={14} />
            Bus Status Board
          </div>
        </div>
        <TrainList vehicles={buses} compact={false} />
      </motion.section>

      <motion.section className="panel" variants={fadeUp} initial="hidden" animate="show">
        <div className="panel-hdr">
          <div className="panel-ttl">
            <Icon name="route" size={14} />
            Bus Lines
          </div>
        </div>
        <div className="route-summary">
          <div className="route-grid">
            {busRoutes.map((r) => {
              const rv = buses.filter((v) => v.routeId === r.id);
              const rdel = rv.filter((v) => v.status === "Delayed").length;
              return (
                <motion.div
                  key={r.id}
                  className="rcard"
                  style={{ borderLeft: `3px solid ${r.color}` }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="rc-top">
                    <span className="rc-badge" style={{ background: r.color }}>
                      <Icon name="bus" size={10} style={{ marginRight: 3 }} />
                      {r.shortName}
                    </span>
                    <span className="rc-name">{r.name}</span>
                    <span className="rc-op">· {r.operator}</span>
                    {rdel > 0 && (
                      <span className="rc-warn">
                        <Icon name="warning" size={11} />
                        {rdel} delayed
                      </span>
                    )}
                  </div>
                  <div className="rc-desc">{r.description}</div>
                  <div className="rc-dots">
                    {rv.map((v) => (
                      <motion.span
                        key={v.id}
                        className={`rc-dot ${v.status === "Delayed" ? "rcd-d" : v.dwellRemaining > 0 ? "rcd-b" : "rcd-ok"}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: Math.random() * 2 }}
                        title={v.id}
                      />
                    ))}
                    <span className="rc-cnt">
                      {rv.length} vehicle{rv.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

