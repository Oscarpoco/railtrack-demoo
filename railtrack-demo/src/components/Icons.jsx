/**
 * Icons.jsx — Inline SVG icon library (square-line style, no emojis)
 */

const ICONS = {
  train: <><rect x="3" y="5" width="18" height="12" strokeWidth="1.6" stroke="currentColor" fill="none"/><rect x="6" y="8" width="4" height="3" fill="currentColor"/><rect x="14" y="8" width="4" height="3" fill="currentColor"/><line x1="3" y1="13" x2="21" y2="13" strokeWidth="1.6" stroke="currentColor"/><line x1="3" y1="17" x2="6" y2="20" strokeWidth="1.6" stroke="currentColor"/><line x1="21" y1="17" x2="18" y2="20" strokeWidth="1.6" stroke="currentColor"/><circle cx="8" cy="19" r="1.5" fill="currentColor"/><circle cx="16" cy="19" r="1.5" fill="currentColor"/></>,
  bus: <><rect x="2" y="5" width="20" height="13" strokeWidth="1.6" stroke="currentColor" fill="none"/><line x1="2" y1="10" x2="22" y2="10" strokeWidth="1.6" stroke="currentColor"/><line x1="8" y1="5" x2="8" y2="18" strokeWidth="1.2" stroke="currentColor" opacity="0.5"/><line x1="16" y1="5" x2="16" y2="18" strokeWidth="1.2" stroke="currentColor" opacity="0.5"/><circle cx="7" cy="21" r="2" fill="currentColor"/><circle cx="17" cy="21" r="2" fill="currentColor"/><line x1="7" y1="18" x2="7" y2="20" strokeWidth="1.6" stroke="currentColor"/><line x1="17" y1="18" x2="17" y2="20" strokeWidth="1.6" stroke="currentColor"/></>,
  map: <><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" strokeWidth="1.6" stroke="currentColor" fill="none" strokeLinejoin="miter"/><line x1="9" y1="3" x2="9" y2="18" strokeWidth="1.6" stroke="currentColor"/><line x1="15" y1="6" x2="15" y2="21" strokeWidth="1.6" stroke="currentColor"/></>,
  warning: <><polygon points="12,2 22,20 2,20" strokeWidth="1.6" stroke="currentColor" fill="none" strokeLinejoin="miter"/><line x1="12" y1="9" x2="12" y2="14" strokeWidth="1.6" stroke="currentColor"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/></>,
  info: <><circle cx="12" cy="12" r="9" strokeWidth="1.6" stroke="currentColor" fill="none"/><line x1="12" y1="11" x2="12" y2="16" strokeWidth="1.6" stroke="currentColor"/><circle cx="12" cy="8" r="0.8" fill="currentColor"/></>,
  check: <><circle cx="12" cy="12" r="9" strokeWidth="1.6" stroke="currentColor" fill="none"/><polyline points="8,12 11,15 16,9" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  close: <><line x1="6" y1="6" x2="18" y2="18" strokeWidth="1.6" stroke="currentColor"/><line x1="18" y1="6" x2="6" y2="18" strokeWidth="1.6" stroke="currentColor"/></>,
  gear: <><circle cx="12" cy="12" r="3" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="1.6" stroke="currentColor"/></>,
  delay: <><circle cx="12" cy="12" r="9" strokeWidth="1.6" stroke="currentColor" fill="none"/><polyline points="12,7 12,12 9,15" strokeWidth="1.6" stroke="currentColor"/><line x1="16" y1="3" x2="20" y2="5" strokeWidth="1.6" stroke="currentColor"/><line x1="4" y1="3" x2="8" y2="5" strokeWidth="1.6" stroke="currentColor"/></>,
  signal: <><circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M8.5 8.5a5 5 0 0 0 0 7.07M15.5 8.5a5 5 0 0 1 0 7.07" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  broadcast: <><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  ticket: <><path d="M6 7h12a2 2 0 0 1 2 2v1a2.5 2.5 0 0 0 0 5v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a2.5 2.5 0 0 0 0-5V9a2 2 0 0 1 2-2Z" strokeWidth="1.6" stroke="currentColor" fill="none"/><line x1="12" y1="8.5" x2="12" y2="15.5" strokeWidth="1.6" stroke="currentColor" strokeDasharray="2 2"/></>,
  northbound: <><line x1="12" y1="19" x2="12" y2="5" strokeWidth="1.6" stroke="currentColor"/><polyline points="6,11 12,5 18,11" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  southbound: <><line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.6" stroke="currentColor"/><polyline points="6,13 12,19 18,13" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  person: <><circle cx="12" cy="7" r="3.5" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  route: <><circle cx="5" cy="6" r="2" strokeWidth="1.6" stroke="currentColor" fill="none"/><circle cx="19" cy="18" r="2" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M5 8c0 4 4 6 7 6s7 2 7 6" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  chevronDown: <polyline points="6,9 12,15 18,9" strokeWidth="1.6" stroke="currentColor" fill="none"/>,
  chevronUp:   <polyline points="6,15 12,9 18,15" strokeWidth="1.6" stroke="currentColor" fill="none"/>,
  dashboard:   <><rect x="3" y="3" width="7" height="7" strokeWidth="1.6" stroke="currentColor" fill="none"/><rect x="14" y="3" width="7" height="7" strokeWidth="1.6" stroke="currentColor" fill="none"/><rect x="3" y="14" width="7" height="7" strokeWidth="1.6" stroke="currentColor" fill="none"/><rect x="14" y="14" width="7" height="7" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  bell:        <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="1.6" stroke="currentColor" fill="none"/></>,
  automation:  <><circle cx="12" cy="12" r="3" strokeWidth="1.6" stroke="currentColor" fill="none"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" strokeWidth="1.6" stroke="currentColor"/></>,
  lightning:   <><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" strokeWidth="1.6" stroke="currentColor" fill="none" strokeLinejoin="round"/></>,
};

export function Icon({ name, size = 16, color = "currentColor", className = "", style = {} }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" color={color}
      className={className} style={{ flexShrink: 0, display:"block", ...style }} aria-hidden="true">
      {paths}
    </svg>
  );
}
