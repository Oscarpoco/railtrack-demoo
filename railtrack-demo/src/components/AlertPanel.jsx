/**
 * AlertPanel.jsx — Animated alerts with Framer Motion
 */

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "./Icons.jsx";

const CONFIG = {
  warning: { icon:"warning", label:"DELAY",    cls:"aw" },
  error:   { icon:"warning", label:"CRITICAL",  cls:"ae" },
  info:    { icon:"info",    label:"INFO",       cls:"ai" },
  success: { icon:"check",   label:"RESOLVED",  cls:"as" },
};

export function AlertPanel({ alerts, onDismiss }) {
  if (!alerts?.length) return null;
  return (
    <div className="alert-panel" role="alert" aria-live="polite">
      <AnimatePresence>
        {alerts.map(a => {
          const cfg = CONFIG[a.type] ?? CONFIG.info;
          return (
            <motion.div
              key={a.id}
              className={`aitem ${cfg.cls}`}
              initial={{ opacity:0, x:40, height:0 }}
              animate={{ opacity:1, x:0,  height:"auto" }}
              exit={{    opacity:0, x:40,  height:0, marginBottom:0 }}
              transition={{ type:"spring", stiffness:380, damping:28 }}
              layout
            >
              <div className="aicon"><Icon name={cfg.icon} size={14}/></div>
              <span className="atag">{cfg.label}</span>
              <span className="amsg">{a.message}</span>
              <span className="atime">
                {a.timestamp.toLocaleTimeString("en-ZA",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
              </span>
              <motion.button className="adis" onClick={()=>onDismiss(a.id)}
                whileHover={{scale:1.2}} whileTap={{scale:0.85}}>
                <Icon name="close" size={12}/>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
