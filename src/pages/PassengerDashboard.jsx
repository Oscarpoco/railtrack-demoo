/**
 * PassengerDashboard.jsx — Public-facing, Framer Motion animated
 */

import { motion } from "framer-motion";
import { MapView }    from "../components/MapView.jsx";
import { TrainList }  from "../components/TrainList.jsx";
import { AlertPanel } from "../components/AlertPanel.jsx";
import { Icon }       from "../components/Icons.jsx";
import { stations, routes } from "../data/stations.js";

const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.4,ease:"easeOut"}} };
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.08 } } };

export function PassengerDashboard({ vehicles, alerts, onDismiss }) {
  const trains    = vehicles.filter(v => v.vehicleType==="train");
  const buses     = vehicles.filter(v => v.vehicleType==="bus");
  const onTime    = vehicles.filter(v => v.status==="On Time").length;
  const delayed   = vehicles.filter(v => v.status==="Delayed").length;
  const boarding  = vehicles.filter(v => v.dwellRemaining>0).length;

  const stats = [
    { val: vehicles.length, lbl:"Active Vehicles", color:"var(--prasa-blue)" },
    { val: trains.length,   lbl:"Metrorail Trains", color:"var(--prasa-blue)" },
    { val: buses.length,    lbl:"Autopax Buses",    color:"var(--bus-orange)" },
    { val: onTime,          lbl:"On Time",          color:"var(--green)" },
    { val: boarding,        lbl:"At Platform",      color:"var(--amber)" },
    { val: delayed,         lbl:"Delayed",          color:"var(--red)" },
  ];

  return (
    <motion.div className="page"
      variants={stagger} initial="hidden" animate="show">

      <AlertPanel alerts={alerts} onDismiss={onDismiss} />

      {/* Stats bar */}
      <motion.div className="stats-bar" variants={stagger}>
        {stats.map(s => (
          <motion.div key={s.lbl} className="stat-chip" variants={fadeUp}
            whileHover={{ y:-3, boxShadow:"0 8px 24px rgba(0,168,225,0.15)" }}
            transition={{ type:"spring", stiffness:300 }}>
            <span className="stat-val" style={{ color:s.color }}>{s.val}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Body */}
      <div className="dash-body">
        {/* Map */}
        <motion.section className="panel map-panel" variants={fadeUp}>
          <div className="panel-hdr">
            <div className="panel-ttl">
              <Icon name="map" size={14}/>
              Live Network Map
            </div>
            <div className="hdr-right">
              <span className="live-tag"><span className="live-dot"/>LIVE</span>
            </div>
          </div>
          <div className="map-wrap"><MapView vehicles={vehicles}/></div>
          <div className="map-legend">
            {Object.values(routes).map(r => (
              <span key={r.id} className="leg-item">
                <span className="leg-dot" style={{background:r.color}}/>
                <span>{r.shortName}</span>
                <span className="leg-op">· {r.operator}</span>
              </span>
            ))}
          </div>
        </motion.section>

        {/* Vehicle list + route cards */}
        <motion.section className="panel list-panel" variants={fadeUp}>
          <div className="panel-hdr">
            <div className="panel-ttl">
              <Icon name="signal" size={14}/>
              Vehicle Status Board
            </div>
          </div>
          <TrainList vehicles={vehicles} compact={false}/>

          {/* Route summary cards */}
          <div className="route-summary">
            <div className="eyebrow">Network Lines</div>
            <div className="route-grid">
              {Object.values(routes).map(r => {
                const rv      = vehicles.filter(v=>v.routeId===r.id);
                const rdel    = rv.filter(v=>v.status==="Delayed").length;
                const isBus   = r.vehicleType==="bus";
                return (
                  <motion.div key={r.id} className="rcard"
                    style={{ borderLeft:`3px solid ${r.color}` }}
                    whileHover={{ x:4 }} transition={{ type:"spring", stiffness:400 }}>
                    <div className="rc-top">
                      <span className="rc-badge" style={{background:r.color}}>
                        <Icon name={isBus?"bus":"train"} size={10} style={{marginRight:3}}/>
                        {r.shortName}
                      </span>
                      <span className="rc-name">{r.name}</span>
                      <span className="rc-op">· {r.operator}</span>
                      {rdel>0 && (
                        <span className="rc-warn">
                          <Icon name="warning" size={11}/>
                          {rdel} delayed
                        </span>
                      )}
                    </div>
                    <div className="rc-desc">{r.description}</div>
                    <div className="rc-dots">
                      {rv.map(v => (
                        <motion.span key={v.id} className={`rc-dot ${v.status==="Delayed"?"rcd-d":v.dwellRemaining>0?"rcd-b":"rcd-ok"}`}
                          style={{"--dc":r.color}}
                          animate={{scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:2,delay:Math.random()*2}}
                          title={v.id}/>
                      ))}
                      <span className="rc-cnt">{rv.length} vehicle{rv.length!==1?"s":""}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
