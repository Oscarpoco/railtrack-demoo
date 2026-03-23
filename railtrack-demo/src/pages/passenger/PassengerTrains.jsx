import { motion } from "framer-motion";
import { TrainList } from "../../components/TrainList.jsx";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

export function PassengerTrains({ vehicles }) {
  const trains = vehicles.filter((v) => v.vehicleType === "train");

  return (
    <div className="passenger-stack">
      <motion.section className="panel" variants={fadeUp} initial="hidden" animate="show">
        <div className="panel-hdr">
          <div className="panel-ttl">
            <Icon name="signal" size={14} />
            Train Status Board
          </div>
        </div>
        <TrainList vehicles={trains} compact={false} />
      </motion.section>
    </div>
  );
}

