import { motion } from "framer-motion";
import { MapView } from "../../components/MapView.jsx";
import { routes } from "../../data/stations.js";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

export function ControlMapTab({ vehicles, mode }) {
  const routeIds = Object.values(routes)
    .filter((r) => (mode === "bus" ? r.vehicleType === "bus" : r.vehicleType === "train"))
    .map((r) => r.id);

  const filteredVehicles = vehicles.filter((v) => (mode === "bus" ? v.vehicleType === "bus" : v.vehicleType === "train"));

  return (
    <motion.section className="panel" variants={fadeUp} initial="hidden" animate="show">
      <div className="panel-hdr">
        <div className="panel-ttl">
          <Icon name="map" size={14} />
          {mode === "bus" ? "Bus Network Map" : "Rail Network Map"}
        </div>
        <span className="live-tag">
          <span className="live-dot" />
          LIVE
        </span>
      </div>
      <div className="map-wrap map-wrap-cc">
        <MapView vehicles={filteredVehicles} visibleRouteIds={routeIds} showPills={false} />
      </div>
    </motion.section>
  );
}

