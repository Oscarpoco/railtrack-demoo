import { motion } from "framer-motion";
import { routes } from "../../data/stations.js";
import { Icon } from "../../components/Icons.jsx";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };

function priceBands(route) {
  const stops = route.stations.length;
  const isBus = route.vehicleType === "bus";

  // Simple demo pricing (replace with real fare rules when available)
  const base = isBus ? 12 : 10;
  const step = isBus ? 4 : 3;

  const band1 = { label: "1–3 stops", price: base };
  const band2 = { label: "4–7 stops", price: base + step * 1 };
  const band3 = { label: "8+ stops", price: base + step * 2 };

  return { stops, bands: [band1, band2, band3] };
}

export function PassengerPrices() {
  const all = Object.values(routes);

  return (
    <div className="passenger-stack">
      <motion.section className="panel" variants={fadeUp} initial="hidden" animate="show">
        <div className="panel-hdr">
          <div className="panel-ttl">
            <Icon name="ticket" size={14} />
            Indicative Prices
          </div>
          <span className="cnt-tag">Demo fares</span>
        </div>

        <div className="prices-wrap">
          {all.map((r) => {
            const { stops, bands } = priceBands(r);
            return (
              <div key={r.id} className="price-card" style={{ borderLeft: `4px solid ${r.color}` }}>
                <div className="price-head">
                  <div className="price-title">
                    <span className="rc-badge" style={{ background: r.color }}>
                      <Icon name={r.vehicleType === "bus" ? "bus" : "train"} size={10} style={{ marginRight: 3 }} />
                      {r.shortName}
                    </span>
                    <span className="price-name">{r.name}</span>
                  </div>
                  <div className="price-meta">
                    <span className="mono">{stops} stops</span>
                    <span className="mono">· {r.operator}</span>
                  </div>
                </div>

                <table className="price-table">
                  <tbody>
                    {bands.map((b) => (
                      <tr key={b.label}>
                        <td>{b.label}</td>
                        <td className="price-val">R {b.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}

