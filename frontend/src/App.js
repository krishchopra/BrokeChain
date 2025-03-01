import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";

/* =====================
   ICONS
   ===================== */
const Icons = {
  Home: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 
        20.7893 21.0391 20.4142 21.4142C20.0391 
        21.7893 19.5304 22 19 22H5C4.46957 
        22 3.96086 21.7893 3.58579 
        21.4142C3.21071 21.0391 3 20.5304 
        3 20V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12H15V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Dashboard: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 9H21M9 21V9M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Audit: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 9H15M9 13H15M9 17H12M5 
        7.8C5 6.11984 5 5.27976 5.32698 
        4.63803C5.6146 4.07354 6.07354 
        3.6146 6.63803 3.32698C7.27976 3 
        8.11984 3 9.8 3H14.2C15.8802 3 
        16.7202 3 17.362 3.32698C17.9265 
        3.6146 18.3854 4.07354 18.673 
        4.63803C19 5.27976 19 6.11984 
        19 7.8V16.2C19 17.8802 19 18.7202 
        18.673 19.362C18.3854 19.9265 
        17.9265 20.3854 17.362 20.673C16.7202 
        21 15.8802 21 14.2 21H9.8C8.11984 
        21 7.27976 21 6.63803 20.673C6.07354 
        20.3854 5.6146 19.9265 5.32698 
        19.362C5 18.7202 5 17.8802 
        5 16.2V7.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Library: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 19.5V4.5C4 4.22386 4.22386 4 4.5 4H19.5C19.7761 4 20 4.22386 20 4.5V19.5C20 19.7761 19.7761 20 19.5 20H4.5C4.22386 20 4 19.7761 4 19.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7H16M8 12H16M8 17H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  History: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 8V12L15 
        15M21 12C21 16.9706 16.9706 21 12 
        21C7.02944 21 3 16.9706 3 
        12C3 7.02944 7.02944 3 12 
        3C16.9706 3 21 7.02944 21 
        12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 15C13.6569 15 15 
        13.6569 15 12C15 10.3431 13.6569 
        9 12 9C10.3431 9 9 10.3431 9 
        12C9 13.6569 10.3431 15 12 
        15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15C19.2669 15.3016 
        19.2272 15.6362 19.286 
        15.9606C19.3448 16.285 19.4995 
        16.5843 19.73 16.82L19.79 
        16.88C19.976 17.0657 20.1235 
        17.2863 20.2241 17.5291C20.3248 
        17.7719 20.3766 18.0322 
        20.3766 18.295C20.3766 18.5578 
        20.3248 18.8181 20.2241 
        19.0609C20.1235 19.3037 
        19.976 19.5243 19.79 
        19.71C19.6043 19.896 19.3837 
        20.0435 19.1409 20.1441C18.8981 
        20.2448 18.6378 20.2966 
        18.375 20.2966C18.1122 
        20.2966 17.8519 20.2448 17.6091 
        20.1441C17.3663 20.0435 17.1457 
        19.896 16.96 19.71L16.9 
        19.65C16.6643 19.4195 16.365 
        19.2648 16.0406 19.206C15.7162 
        19.1472 15.3816 19.1869 
        15.08 19.32C14.7842 19.4468 
        14.532 19.6572 14.3543 
        19.9255C14.1766 20.1938 
        14.0813 20.5082 14.08 20.83V21C14.08 
        21.5304 13.8693 22.0391 
        13.4942 22.4142C13.1191 22.7893 
        12.6104 23 12.08 23C11.5496 
        23 11.0409 22.7893 10.6658 
        22.4142C10.2907 22.0391 10.08 
        21.5304 10.08 21V20.91C10.0723 
        20.579 9.96512 20.258 9.77251 
        19.9887C9.5799 19.7194 9.31074 
        19.5143 9 19.4C8.69838 
        19.2669 8.36381 19.2272 8.03941 
        19.286C7.71502 19.3448 7.41568 
        19.4995 7.18 19.73L7.12 19.79C6.93425 
        19.976 6.71368 20.1235 6.47088 
        20.2241C6.22808 20.3248 5.96783 
        20.3766 5.705 20.3766C5.44217 
        20.3766 5.18192 20.3248 4.93912 
        20.2241C4.69632 20.1235 4.47575 
        19.976 4.29 19.79C4.10405 19.6043 
        3.95653 19.3837 3.85588 
        19.1409C3.75523 18.8981 3.70343 
        18.6378 3.70343 18.375C3.70343 
        18.1122 3.75523 17.8519 3.85588 
        17.6091C3.95653 17.3663 4.10405 
        17.1457 4.29 16.96L4.35 
        16.9C4.58054 16.6643 4.73519 
        16.365 4.794 16.0406C4.85282 
        15.7162 4.81312 15.3816 4.68 
        15.08C4.55324 14.7842 4.34276 
        14.532 4.07447 14.3543C3.80618 
        14.1766 3.49179 14.0813 3.17 
        14.08H3C2.46957 14.08 1.96086 
        13.8693 1.58579 13.4942C1.21071 
        13.1191 1 12.6104 1 12.08C1 
        11.5496 1.21071 11.0409 1.58579 
        10.6658C1.96086 10.2907 2.46957 
        10.08 3 10.08H3.09C3.42099 
        10.0723 3.742 9.96512 4.0113 
        9.77251C4.28059 9.5799 4.48572 
        9.31074 4.6 9C4.73312 8.69838 
        4.77282 8.36381 4.714 8.03941C4.65519 
        7.71502 4.50054 7.41568 4.27 
        7.18L4.21 7.12C4.02405 6.93425 
        3.87653 6.71368 3.77588 6.47088C3.67523 
        6.22808 3.62343 5.96783 3.62343 
        5.705C3.62343 5.44217 3.67523 
        5.18192 3.77588 4.93912C3.87653 
        4.69632 4.02405 4.47575 4.21 
        4.29C4.39575 4.10405 4.61632 
        3.95653 4.85912 3.85588C5.10192 
        3.75523 5.36217 3.70343 5.625 
        3.70343C5.88783 3.70343 6.14808 
        3.75523 6.39088 3.85588C6.63368 
        3.95653 6.85425 4.10405 7.04 
        4.29L7.1 4.35C7.33568 4.58054 
        7.63502 4.73519 7.95941 4.794C8.28381 
        4.85282 8.61838 4.81312 8.92 
        4.68H9C9.29577 4.55324 9.54802 
        4.34276 9.72569 4.07447C9.90337 
        3.80618 9.99872 3.49179 10 
        3.17V3C10 2.46957 10.2107 1.96086 
        10.5858 1.58579C10.9609 1.21071 
        11.4696 1 12 1C12.5304 1 
        13.0391 1.21071 13.4142 1.58579C13.7893 
        1.96086 14 2.46957 14 3V3.09C14.0013 
        3.41179 14.0966 3.72618 14.2743 
        3.99447C14.452 4.26276 14.7042 
        4.47324 15 4.6C15.3016 4.73312 
        15.6362 4.77282 15.9606 4.714C16.285 
        4.65519 16.5843 4.50054 16.82 
        4.27L16.88 4.21C17.0657 4.02405 
        17.2863 3.87653 17.5291 3.77588C17.7719 
        3.67523 18.0322 3.62343 18.295 
        3.62343C18.5578 3.62343 18.8181 
        3.67523 19.0609 3.77588C19.3037 
        3.87653 19.5243 4.02405 19.71 
        4.21C19.896 4.39575 20.0435 
        4.61632 20.1441 4.85912C20.2448 
        5.10192 20.2966 5.36217 20.2966 
        5.625C20.2966 5.88783 20.2448 6.14808 
        20.1441 6.39088C20.0435 6.63368 
        19.896 6.85425 19.71 7.04L19.65 
        7.1C19.4195 7.33568 19.2648 
        7.63502 19.206 7.95941C19.1472 
        8.28381 19.1869 8.61838 19.32 
        8.92V9C19.4468 9.29577 19.6572 
        9.54802 19.9255 9.72569C20.1938 
        9.90337 20.5082 9.99872 20.83 
        10H21C21.5304 10 22.0391 10.2107 
        22.4142 10.5858C22.7893 10.9609 
        23 11.4696 23 12C23 12.5304 
        22.7893 13.0391 22.4142 13.4142C22.0391 
        13.7893 21.5304 14 21 
        14H20.91C20.5882 14.0013 20.2738 
        14.0966 20.0055 14.2743C19.7372 
        14.452 19.5268 14.7042 19.4 
        15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Download: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 15V19C21 19.5304 20.7893 20.0391 
        20.4142 20.4142C20.0391 20.7893 19.5304 
        21 19 21H5C4.46957 21 3.96086 20.7893 
        3.58579 20.4142C3.21071 20.0391 3 
        19.5304 3 19V15M7 10L12 15M12 15L17 
        10M12 15V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clear: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M19 7L18.1327 19.1425C18.0579 
        20.1891 17.187 21 16.1378 
        21H7.86224C6.81296 21 5.94208 
        20.1891 5.86732 19.1425L5 7M10 
        11V17M14 11V17M15 7V4C15 
        3.44772 14.5523 3 14 3H10C9.44772 
        3 9 3.44772 9 4V7M4 
        7H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M22 2L11 13M22 
        2L15 22L11 13M22 
        2L2 9L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6H20M4 12H20M4 18H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 13L9 17L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Alert: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Sun: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 17.75C15.1766 17.75 17.75 15.1766 17.75 12C17.75 8.82334 15.1766 6.25 12 6.25C8.82334 6.25 6.25 8.82334 6.25 12C6.25 15.1766 8.82334 17.75 12 17.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V5M12 19V21M3 12H5M19 12H21M4.9282 4.92859L6.3432 6.34359M17.6569 17.6566L19.0719 19.0716M4.9282 19.0716L6.3432 17.6566M17.6569 6.34359L19.0719 4.92859"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Filter: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 6H21M6 12H18M10 18H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Copy: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.083 2.57C15.7094 2.20466 15.2076 2.00007 14.685 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Info: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* =====================
   NAV ITEMS
   ===================== */
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <Icons.Dashboard /> },
  { id: "audit", label: "Smart Contract Audit", icon: <Icons.Audit /> },
  { id: "library", label: "Security Library", icon: <Icons.Library /> },
  { id: "history", label: "Audit History", icon: <Icons.History /> },
  { id: "settings", label: "Settings", icon: <Icons.Settings /> },
];

/* =====================
   SIDE DRAWER
   ===================== */
function SideDrawer({ currentPage, setCurrentPage, isOpen, toggleDrawer }) {
  return (
    <aside className={`side-drawer ${isOpen ? "open" : "closed"}`}>
      <div className="drawer-header">
        <div className="logo">
          <span className="logo-icon">🔒</span>
          <span className="logo-text">SecureChain</span>
        </div>
        <button className="drawer-toggle-btn" onClick={toggleDrawer}>
          {isOpen ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
        </button>
      </div>
      <nav>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={currentPage === item.id ? "active" : ""}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="drawer-footer">
        <div className="user-info">
          <div className="user-avatar">AS</div>
          <div className="user-details">
            <span className="user-name">Auditor Studio</span>
            <span className="user-role">Professional</span>
          </div>
        </div>
        <p className="version-tag">Version 2.0</p>
      </div>
    </aside>
  );
}

/* =====================
   CONFIDENCE GAUGE
   ===================== */
function ConfidenceGauge({ score }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "var(--warning)";
    return "var(--error)";
  };

  return (
    <div className="gauge-container">
      <svg className="gauge">
        <circle className="gauge-bg" cx="50%" cy="50%" r={radius} />
        <circle
          className="gauge-progress"
          cx="50%"
          cy="50%"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={getColor()}
        />
        <text x="50%" y="45%" textAnchor="middle" className="gauge-text">
          {score}%
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="gauge-label">
          Confidence
        </text>
      </svg>
    </div>
  );
}

/* =====================
   STATS WIDGET
   ===================== */
function StatsWidget({ title, value, icon, type }) {
  return (
    <motion.div
      className={`stat-widget ${type}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
    </motion.div>
  );
}

/* =====================
   VULNERABILITY CARD
   ===================== */
function VulnerabilityCard({ vuln, index, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    onCopy(vuln);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const severityColor = () => {
    switch (vuln.severity.toLowerCase()) {
      case "high":
      case "critical":
        return "high";
      case "medium":
        return "medium";
      default:
        return "low";
    }
  };

  return (
    <motion.div
      className={`vuln-card severity-${severityColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="vuln-header">
        <h3>
          <span className="vuln-index">{index + 1}</span> {vuln.type}
        </h3>
        <span className={`severity-badge ${severityColor()}`}>
          {vuln.severity}
        </span>
      </div>
      <div className="vuln-content">
        <strong>Impact:</strong> {vuln.impact || "Could lead to fund loss or contract compromise"}
      </div>
      <div className="vuln-content">
        <strong>Recommendation:</strong> {vuln.recommendation}
      </div>
      <div className="vuln-actions">
        {vuln.lineReferences && (
          <button
            className="action-btn expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Hide Code Snippet" : "View Code Snippet"}
          </button>
        )}
        <button className="action-btn copy-btn" onClick={handleCopy}>
          {showCopied ? <Icons.Check /> : <Icons.Copy />}
          <span>{showCopied ? "Copied" : "Copy Details"}</span>
        </button>
      </div>
      {expanded && vuln.lineReferences && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <pre className="code-snippet">
            <code>{vuln.lineReferences}</code>
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
}

/* =====================
   AUTO-FIX
   ===================== */
function AutoFixSuggestion({ fixCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!fixCode) return null;
  return (
    <motion.div
      className="auto-fix"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auto-fix-header">
        <h3><Icons.Info /> AI Auto-Fix Suggestion</h3>
        <button className="copy-code-btn" onClick={handleCopy}>
          {copied ? <Icons.Check /> : <Icons.Copy />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>
      <pre className="code-snippet">
        <code>{fixCode}</code>
      </pre>
    </motion.div>
  );
}

/* =====================
   REPORT SUMMARY
   ===================== */
function ReportSummary({ vulnerabilities, onExport }) {
  const getVulnerabilitiesByType = () => {
    const counts = { high: 0, medium: 0, low: 0, total: vulnerabilities.length };
    
    vulnerabilities.forEach((vuln) => {
      const severity = vuln.severity.toLowerCase();
      if (severity === "high" || severity === "critical") counts.high++;
      else if (severity === "medium") counts.medium++;
      else counts.low++;
    });
    
    return counts;
  };

  const counts = getVulnerabilitiesByType();

  return (
    <motion.div
      className="report-summary"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="summary-header">
        <h3>Audit Summary</h3>
        <button className="export-btn" onClick={onExport}>
          <Icons.Download />
          <span>Export PDF Report</span>
        </button>
      </div>
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-count">{counts.total}</span>
          <span className="stat-label">Total Issues</span>
        </div>
        <div className="stat-item high">
          <span className="stat-count">{counts.high}</span>
          <span className="stat-label">High</span>
        </div>
        <div className="stat-item medium">
          <span className="stat-count">{counts.medium}</span>
          <span className="stat-label">Medium</span>
        </div>
        <div className="stat-item low">
          <span className="stat-count">{counts.low}</span>
          <span className="stat-label">Low</span>
        </div>
      </div>
    </motion.div>
  );
}

/* =====================
   SEARCH BAR
   ===================== */
function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <Icons.Search />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button className="search-clear" onClick={() => handleChange({ target: { value: "" } })}>
          <Icons.Close />
        </button>
      )}
    </div>
  );
}

/* =====================
   DASHBOARD PAGE
   ===================== */
function Dashboard() {
  // Sample data for demonstration purposes
  const recentAudits = [
    { 
      id: 1, 
      name: "TokenSwap.sol", 
      date: "2025-02-28", 
      issues: { high: 2, medium: 3, low: 1 },
      score: 78
    },
    { 
      id: 2, 
      name: "LiquidityPool.sol", 
      date: "2025-02-25", 
      issues: { high: 0, medium: 1, low: 4 },
      score: 92
    },
    { 
      id: 3, 
      name: "NFTMarketplace.sol", 
      date: "2025-02-20", 
      issues: { high: 1, medium: 2, low: 3 },
      score: 85
    },
  ];

  const commonVulnerabilities = [
    { name: "Reentrancy", count: 24, change: "+5%" },
    { name: "Access Control", count: 18, change: "-2%" },
    { name: "Integer Overflow", count: 15, change: "-8%" },
    { name: "Front-Running", count: 12, change: "+10%" },
  ];

  return (
    <div className="page-content dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <div className="header-actions">
          <button className="primary-button">
            <Icons.Audit />
            <span>New Audit</span>
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatsWidget 
          title="Total Audits" 
          value="36" 
          icon={<Icons.Audit />} 
          type="primary"
        />
        <StatsWidget 
          title="Avg. Security Score" 
          value="82%" 
          icon={<Icons.Check />} 
          type="success"
        />
        <StatsWidget 
          title="Critical Issues" 
          value="12" 
          icon={<Icons.Alert />} 
          type="danger"
        />
        <StatsWidget 
          title="Fixes Applied" 
          value="92%" 
          icon={<Icons.Check />} 
          type="info"
        />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card recent-audits">
          <h3>Recent Audits</h3>
          <div className="audit-list">
            {recentAudits.map((audit) => (
              <div key={audit.id} className="audit-item">
                <div className="audit-info">
                  <h4>{audit.name}</h4>
                  <p className="audit-date">{audit.date}</p>
                </div>
                <div className="audit-stats">
                  <div className="audit-issues">
                    {audit.issues.high > 0 && (
                      <span className="issue-badge high">{audit.issues.high}</span>
                    )}
                    {audit.issues.medium > 0 && (
                      <span className="issue-badge medium">{audit.issues.medium}</span>
                    )}
                    {audit.issues.low > 0 && (
                      <span className="issue-badge low">{audit.issues.low}</span>
                    )}
                  </div>
                  <div className="audit-score">
                    <div className="score-circle" style={{
                      borderColor: audit.score >= 80 ? "var(--success)" : 
                                  audit.score >= 60 ? "var(--warning)" : "var(--error)"
                    }}>
                      {audit.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Audits</button>
        </div>

        <div className="dashboard-card vulnerability-trends">
          <h3>Common Vulnerabilities</h3>
          <div className="vulnerability-list">
            {commonVulnerabilities.map((vuln, index) => (
              <div key={index} className="vulnerability-item">
                <div className="vulnerability-info">
                  <h4>{vuln.name}</h4>
                  <p className="vulnerability-count">{vuln.count} occurrences</p>
                </div>
                <div className="trend-indicator">
                  <span className={vuln.change.startsWith("+") ? "up" : "down"}>
                    {vuln.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-card security-tips">
        <h3>Security Tips</h3>
        <div className="tips-content">
          <div className="tip-item">
            <div className="tip-icon">💡</div>
            <div className="tip-text">
              <h4>Implement Checks-Effects-Interactions Pattern</h4>
              <p>Always update state variables before interacting with external contracts to prevent reentrancy attacks.</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">🔒</div>
            <div className="tip-text">
              <h4>Use Access Control Lists</h4>
              <p>Implement proper access controls for sensitive functions and avoid using tx.origin for authentication.</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">⚠️</div>
            <div className="tip-text">
              <h4>Avoid Hardcoded Gas Values</h4>
              <p>With EIP-1559 and gas optimizations, avoid hardcoding gas values in your contracts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================
   SECURITY LIBRARY PAGE
   ===================== */
function SecurityLibrary() {
  const [activeTab, setActiveTab] = useState("vulnerabilities");
  const [searchQuery, setSearchQuery] = useState("");
  
  const vulnerabilityPatterns = [
    {
      id: 1,
      name: "Reentrancy",
      description: "Occurs when external contract calls are allowed to make new calls to the calling contract before the first execution is complete",
      risk: "High",
      code: `function withdrawFunds() public {
  uint256 amount = balances[msg.sender];
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Transfer failed");
  balances[msg.sender] = 0; // State update after external call
}`
    },
    {
      id: 2,
      name: "Integer Overflow/Underflow",
      description: "Arithmetic operations reaching the maximum or minimum size of the type and wrapping around",
      risk: "Medium",
      code: `function addToBalance(uint256 amount) public {
  balances[msg.sender] += amount; // Potential overflow
}`
    },
    {
      id: 3,
      name: "Access Control",
      description: "Missing or incorrect access controls allowing unauthorized actions",
      risk: "High",
      code: `function transferOwnership(address newOwner) public {
  owner = newOwner; // Missing owner check
}`
    },
    {
      id: 4,
      name: "Front-Running",
      description: "Transaction order exploitation by observing pending transactions and inserting own transaction",
      risk: "Medium",
      code: `function setPrice(uint256 newPrice) public {
  require(newPrice > 0, "Price must be positive");
  price = newPrice; // Vulnerable to front-running
}`
    },
  ];
  
  const securePatterns = [
    {
      id: 1,
      name: "Checks-Effects-Interactions Pattern",
      description: "Follow this pattern to prevent reentrancy: check conditions, update state, interact with external contracts",
      benefits: "Prevents reentrancy attacks",
      code: `function withdrawFunds() public {
  uint256 amount = balances[msg.sender]; // Check
  balances[msg.sender] = 0; // Effect (state update)
  (bool success, ) = msg.sender.call{value: amount}(""); // Interaction
  require(success, "Transfer failed");
}`
    },
    {
      id: 2,
      name: "Pull Over Push Pattern",
      description: "Allow users to withdraw funds themselves instead of pushing funds to them",
      benefits: "Reduces reentrancy risk, gas efficiency",
      code: `// Users call this function to withdraw
function withdraw() public {
  uint256 amount = pendingWithdrawals[msg.sender];
  pendingWithdrawals[msg.sender] = 0;
  payable(msg.sender).transfer(amount);
}`
    },
    {
      id: 3,
      name: "Access Control Modifiers",
      description: "Use modifiers to restrict function access",
      benefits: "Centralized access control, less error-prone",
      code: `modifier onlyOwner() {
  require(msg.sender == owner, "Not owner");
  _;
}

function sensitiveFunction() public onlyOwner {
  // Function body
}`
    },
  ];

  const filteredVulnerabilities = vulnerabilityPatterns.filter(
    (vuln) => vuln.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              vuln.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatterns = securePatterns.filter(
    (pattern) => pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pattern.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content library-page">
      <div className="page-header">
        <h2>Security Library</h2>
        <div className="header-actions">
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search vulnerabilities and patterns..." 
          />
        </div>
      </div>

      <div className="library-tabs">
        <button 
          className={activeTab === "vulnerabilities" ? "active" : ""} 
          onClick={() => setActiveTab("vulnerabilities")}
        >
          <Icons.Alert />
          <span>Vulnerability Patterns</span>
        </button>
        <button 
          className={activeTab === "secure" ? "active" : ""} 
          onClick={() => setActiveTab("secure")}
        >
          <Icons.Check />
          <span>Secure Patterns</span>
        </button>
      </div>

      <div className="library-content">
        {activeTab === "vulnerabilities" ? (
          <AnimatePresence>
            <motion.div 
              className="vulnerability-patterns"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredVulnerabilities.length > 0 ? (
                filteredVulnerabilities.map((vuln) => (
                  <motion.div 
                    key={vuln.id}
                    className="library-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="library-item-header">
                      <h3>{vuln.name}</h3>
                      <span className={`risk-level ${vuln.risk.toLowerCase()}`}>
                        {vuln.risk} Risk
                      </span>
                    </div>
                    <p className="library-item-desc">{vuln.description}</p>
                    <div className="library-code">
                      <h4>Vulnerable Code Example:</h4>
                      <pre className="code-snippet">
                        <code>{vuln.code}</code>
                      </pre>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <Icons.Search />
                  <p>No vulnerability patterns found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="secure-patterns"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredPatterns.length > 0 ? (
                filteredPatterns.map((pattern) => (
                  <motion.div 
                    key={pattern.id}
                    className="library-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="library-item-header">
                      <h3>{pattern.name}</h3>
                      <span className="pattern-benefit">
                        {pattern.benefits}
                      </span>
                    </div>
                    <p className="library-item-desc">{pattern.description}</p>
                    <div className="library-code">
                      <h4>Secure Implementation:</h4>
                      <pre className="code-snippet">
                        <code>{pattern.code}</code>
                      </pre>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <Icons.Search />
                  <p>No secure patterns found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* =====================
   HISTORY PAGE
   ===================== */
function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterBy, setFilterBy] = useState("all");
  
  const mockHistory = [
    { 
      id: 1, 
      title: "TokenSwap.sol", 
      date: "2025-02-28 14:32", 
      issueCount: { high: 2, medium: 3, low: 1 },
      score: 78,
      tags: ["DeFi", "ERC20"],
      notes: "Initial audit of token swap contract"
    },
    { 
      id: 2, 
      title: "LiquidityPool.sol", 
      date: "2025-02-25 09:15", 
      issueCount: { high: 0, medium: 1, low: 4 },
      score: 92,
      tags: ["DeFi", "Liquidity"],
      notes: "Follow-up after first round of fixes"
    },
    { 
      id: 3, 
      title: "NFTMarketplace.sol", 
      date: "2025-02-20 16:45", 
      issueCount: { high: 1, medium: 2, low: 3 },
      score: 85,
      tags: ["NFT", "Marketplace"],
      notes: "Complete marketplace contract review"
    },
    { 
      id: 4, 
      title: "Staking.sol", 
      date: "2025-02-15 11:20", 
      issueCount: { high: 3, medium: 2, low: 2 },
      score: 65,
      tags: ["Staking", "Rewards"],
      notes: "Initial review of staking mechanics"
    },
    { 
      id: 5, 
      title: "Governance.sol", 
      date: "2025-02-10 13:50", 
      issueCount: { high: 0, medium: 0, low: 2 },
      score: 96,
      tags: ["DAO", "Governance"],
      notes: "Review of voting mechanisms"
    },
  ];

  // Filter history by search term
  const filteredHistory = mockHistory.filter(item => {
    // Filter by search term
    const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by severity
    const hasHighIssues = item.issueCount.high > 0;
    const hasMediumIssues = item.issueCount.medium > 0;
    
    if (filterBy === "all") return searchMatch;
    if (filterBy === "high") return searchMatch && hasHighIssues;
    if (filterBy === "medium") return searchMatch && hasMediumIssues;
    if (filterBy === "clean") return searchMatch && !hasHighIssues && !hasMediumIssues;
    
    return searchMatch;
  });

  // Sort history based on sortBy and sortOrder
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc" 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === "score") {
      return sortOrder === "asc" 
        ? a.score - b.score
        : b.score - a.score;
    } else if (sortBy === "issues") {
      const aTotal = a.issueCount.high + a.issueCount.medium + a.issueCount.low;
      const bTotal = b.issueCount.high + b.issueCount.medium + b.issueCount.low;
      return sortOrder === "asc" ? aTotal - bTotal : bTotal - aTotal;
    }
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="page-content history-page">
      <div className="page-header">
        <h2>Audit History</h2>
        <div className="header-actions">
          <SearchBar 
            onSearch={setSearchTerm} 
            placeholder="Search by name, notes, or tags..." 
          />
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-group">
          <label>Filter by:</label>
          <select 
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Audits</option>
            <option value="high">High Severity Issues</option>
            <option value="medium">Medium Severity Issues</option>
            <option value="clean">Clean Audits</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Date</option>
            <option value="score">Security Score</option>
            <option value="issues">Issue Count</option>
          </select>
          <button className="sort-order-btn" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>
      </div>

      <div className="history-list">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((item) => (
            <motion.div 
              key={item.id}
              className="history-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: "var(--shadow-lg)" }}
            >
              <div className="history-item-header">
                <h3>{item.title}</h3>
                <div className="history-item-score" style={{
                  backgroundColor: item.score >= 80 
                    ? "var(--success)" 
                    : item.score >= 60 
                      ? "var(--warning)" 
                      : "var(--error)"
                }}>
                  {item.score}
                </div>
              </div>
              
              <div className="history-item-meta">
                <div className="history-date">
                  <Icons.History />
                  <span>{item.date}</span>
                </div>
                <div className="history-issues">
                  {item.issueCount.high > 0 && (
                    <span className="issue-count high">
                      {item.issueCount.high} High
                    </span>
                  )}
                  {item.issueCount.medium > 0 && (
                    <span className="issue-count medium">
                      {item.issueCount.medium} Medium
                    </span>
                  )}
                  {item.issueCount.low > 0 && (
                    <span className="issue-count low">
                      {item.issueCount.low} Low
                    </span>
                  )}
                </div>
              </div>
              
              <p className="history-notes">{item.notes}</p>
              
              <div className="history-tags">
                {item.tags.map((tag, index) => (
                  <span key={index} className="history-tag">{tag}</span>
                ))}
              </div>
              
              <div className="history-actions">
                <button className="history-action-btn">
                  <Icons.Download />
                  <span>Export</span>
                </button>
                <button className="history-action-btn">
                  <Icons.Audit />
                  <span>View Report</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state">
            <Icons.Search />
            <p>No audit history found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================
   SETTINGS
   ===================== */
function SettingsOption({ 
  label, 
  description, 
  defaultChecked, 
  onChange,
  id
}) {
  return (
    <div className="settings-option">
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          defaultChecked={defaultChecked} 
          onChange={(e) => onChange(id, e.target.checked)} 
        />
        <span className="toggle-slider"></span>
      </label>
      <div className="settings-label">
        <p>{label}</p>
        <span className="settings-description">{description}</span>
      </div>
    </div>
  );
}

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Apply dark mode to the document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);
  
  const handleSettingChange = (settingId, value) => {
    if (settingId === "darkMode") {
      setDarkMode(value);
    }
    // Handle other settings as needed...
  };

  return (
    <div className="page-content settings-page">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="settings-section"
      >
        <h3>Display Settings</h3>
        <div className="settings-options">
          <SettingsOption
            id="darkMode"
            label="Dark Mode"
            description="Toggle between light and dark interface"
            defaultChecked={darkMode}
            onChange={handleSettingChange}
          />
          <SettingsOption
            id="animations"
            label="Animations"
            description="Enable UI animations"
            defaultChecked={true}
            onChange={handleSettingChange}
          />
          <SettingsOption
            id="compactView"
            label="Compact View"
            description="Show more content with less padding"
            defaultChecked={false}
            onChange={handleSettingChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="settings-section"
      >
        <h3>Audit Settings</h3>
        <div className="settings-options">
          <SettingsOption
            id="autoFix"
            label="Auto-Fix Generation"
            description="Automatically generate fix suggestions"
            defaultChecked={true}
            onChange={handleSettingChange}
          />
          <SettingsOption
            id="extendedAnalysis"
            label="Extended Analysis"
            description="Use slower but more comprehensive tools"
            defaultChecked={true}
            onChange={handleSettingChange}
          />
          <SettingsOption
            id="realTimeScan"
            label="Real-time Scanning"
            description="Scan code as you type (may impact performance)"
            defaultChecked={false}
            onChange={handleSettingChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="settings-section"
      >
        <h3>Notification Settings</h3>
        <div className="settings-options">
          <SettingsOption
            id="emailNotifications"
            label="Email Notifications"
            description="Receive audit results via email"
            defaultChecked={true}
            onChange={handleSettingChange}
          />
          <SettingsOption
            id="securityAlerts"
            label="Security Alerts"
            description="Get notifications about new vulnerabilities"
            defaultChecked={true}
            onChange={handleSettingChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="settings-section"
      >
        <h3>API Configuration</h3>
        <div className="api-settings">
          <div className="api-key-container">
            <label>API Key</label>
            <div className="api-key-field">
              <input type="password" value="••••••••••••••••••••••" readOnly />
              <button className="api-key-action">
                <Icons.Copy />
              </button>
              <button className="api-key-action">
                <Icons.Download />
              </button>
            </div>
          </div>
          <button className="regenerate-key-btn">
            <span>Regenerate API Key</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* =====================
   AUDIT PAGE
   ===================== */
function Audit() {
  const [analysisType, setAnalysisType] = useState("solidity");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [autoFixCode, setAutoFixCode] = useState("");
  const typingIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Template vulnerabilities for demo
  const templateVulnerabilities = [
    {
      type: "Reentrancy Vulnerability",
      severity: "High",
      impact: "Potential theft of funds due to recursive calls",
      recommendation: "Implement the checks-effects-interactions pattern and consider using a reentrancy guard.",
      lineReferences: `function withdraw(uint256 _amount) external {
    require(balances[msg.sender] >= _amount, "Insufficient balance");
    
    // Vulnerability: State update after external call
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "Transfer failed");
    
    balances[msg.sender] -= _amount;
}`
    },
    {
      type: "Unchecked External Call",
      severity: "Medium",
      impact: "Failed calls may not be properly detected",
      recommendation: "Always check the return value of low-level calls and handle failure cases explicitly.",
      lineReferences: `function sendReward(address _recipient, uint256 _amount) external onlyOwner {
    // Vulnerability: No check on the success of the call
    _recipient.call{value: _amount}("");
}`
    },
    {
      type: "Access Control Issue",
      severity: "High",
      impact: "Unauthorized users could execute privileged functions",
      recommendation: "Implement proper access control using modifiers or role-based systems.",
      lineReferences: `function setFeeCollector(address _newCollector) external {
    // Vulnerability: Missing owner check
    feeCollector = _newCollector;
}`
    },
    {
      type: "Unchecked Return Values",
      severity: "Low",
      impact: "Functions might not work as expected if ERC20 transfers fail",
      recommendation: "Check the return values of ERC20 token transfers and handle errors.",
      lineReferences: `function transferTokens(address _token, address _to, uint256 _amount) external {
    // Vulnerability: Return value not checked
    IERC20(_token).transfer(_to, _amount);
}`
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatReport = (report) => {
    if (!report?.vulnerabilities?.length) {
      return "# No vulnerabilities found.\nEverything looks good!";
    }
    let md = "# Vulnerability Report\n\n";
    report.vulnerabilities.forEach((vuln, i) => {
      md += `## ${i + 1}. ${vuln.type}\n`;
      md += `**Severity:** ${vuln.severity}\n\n`;
      md += `**Impact:** ${vuln.impact || "Could lead to fund loss or contract compromise"}\n\n`;
      md += `**Recommendation:** ${vuln.recommendation}\n\n`;
    });
    return md;
  };

  const startTyping = (finalText) => {
    let currentIndex = 0;
    setTypingMessage("");

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < finalText.length) {
        setTypingMessage((prev) => prev + finalText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 5);
  };

  // Update bot message with typed text
  useEffect(() => {
    if (!messages.length) return;
    
    const updated = [...messages];
    const lastIdx = updated.length - 1;
    
    if (updated[lastIdx].sender === "bot") {
      updated[lastIdx] = { ...updated[lastIdx], text: typingMessage };
      setMessages(updated);
    }
  }, [typingMessage, messages]);

  // Mock API integration for demo purposes
  const analyzeContract = async (code) => {
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly select 2-4 vulnerabilities from the template
        const count = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...templateVulnerabilities].sort(() => 0.5 - Math.random());
        const selectedVulnerabilities = shuffled.slice(0, count);
        
        // Generate random confidence score between 60-95
        const score = Math.floor(Math.random() * 36) + 60;
        
        // Generate auto-fix code for one vulnerability
        const fixedCode = selectedVulnerabilities[0].lineReferences.replace(
          /function withdraw\(uint256 _amount\) external {[\s\S]*?}/,
          `function withdraw(uint256 _amount) external nonReentrant {
    require(balances[msg.sender] >= _amount, "Insufficient balance");
    
    // Update state before external call
    balances[msg.sender] -= _amount;
    
    // Make external call after state changes
    (bool success, ) = msg.sender.call{value: _amount}("");
    require(success, "Transfer failed");
}`
        );
        
        resolve({
          vulnerabilities: selectedVulnerabilities,
          confidenceScore: score,
          autoFixCode: fixedCode
        });
      }, 3000); // Simulate 3 second processing time
    });
  };

  const handleCopyVulnerability = (vuln) => {
    const text = `Vulnerability: ${vuln.type}
Severity: ${vuln.severity}
Impact: ${vuln.impact || "Could lead to fund loss or contract compromise"}
Recommendation: ${vuln.recommendation}

${vuln.lineReferences || ""}`;

    navigator.clipboard.writeText(text);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      // Use the mock API function
      const result = await analyzeContract(input);
      
      setVulnerabilities(result.vulnerabilities);
      setConfidenceScore(result.confidenceScore);
      setAutoFixCode(result.autoFixCode);

      // Build a final "report-like" text for chat
      const finalReport = {
        vulnerabilities: result.vulnerabilities,
      };
      const finalText = formatReport(finalReport);

      // Add a "bot" message and start typed effect
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      startTyping(finalText);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error analyzing input. Please try again." },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  const exportPDF = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setVulnerabilities([]);
    setTypingMessage("");
    setConfidenceScore(0);
    setAutoFixCode("");
  };

  // Placeholder code samples for quick testing
  const codeExamples = [
    {
      name: "Simple Token",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    address public owner;
    
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
        owner = msg.sender;
    }
    
    function transfer(address _to, uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }
    
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= _amount;
    }
}`
    },
    {
      name: "NFT Marketplace",
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMarketplace {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public pendingWithdrawals;
    
    function listNFT(uint256 _tokenId, uint256 _price) external {
        // Missing ownership verification
        listings[_tokenId] = Listing(msg.sender, _price, true);
    }
    
    function buyNFT(uint256 _tokenId) external payable {
        Listing storage listing = listings[_tokenId];
        require(listing.active, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Vulnerable to reentrancy
        listing.active = false;
        pendingWithdrawals[listing.seller] += msg.value;
        
        // Missing NFT transfer
    }
    
    function withdraw() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}`
    }
  ];

  return (
    <div className="page-content audit-page">
      <div className="page-header">
        <h2>Smart Contract Audit</h2>
        <div className="header-actions">
          {vulnerabilities.length > 0 && (
            <button className="primary-button" onClick={exportPDF}>
              <Icons.Download />
              <span>Export Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="audit-dashboard">
        {confidenceScore > 0 && (
          <div className="audit-summary">
            <ConfidenceGauge score={confidenceScore} />
            <ReportSummary 
              vulnerabilities={vulnerabilities} 
              onExport={exportPDF} 
            />
          </div>
        )}

        <div className="chat-container">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
              <p>Analyzing your smart contract...</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`message ${msg.sender}`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {vulnerabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="vuln-list"
          >
            <h3 className="section-title">Detected Vulnerabilities</h3>
            {vulnerabilities.map((vuln, i) => (
              <VulnerabilityCard 
                vuln={vuln} 
                index={i} 
                key={i} 
                onCopy={handleCopyVulnerability}
              />
            ))}
          </motion.div>
        )}

        {autoFixCode && <AutoFixSuggestion fixCode={autoFixCode} />}

        <div className="audit-controls">
          {messages.length > 0 && (
            <button className="secondary-button" onClick={clearChat}>
              <Icons.Clear />
              <span>Clear Analysis</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-header">
            <div className="input-options">
              <label className={analysisType === "solidity" ? "active" : ""}>
                <input
                  type="radio"
                  value="solidity"
                  checked={analysisType === "solidity"}
                  onChange={() => setAnalysisType("solidity")}
                />
                <span>Solidity Code</span>
              </label>
              <label className={analysisType === "github" ? "active" : ""}>
                <input
                  type="radio"
                  value="github"
                  checked={analysisType === "github"}
                  onChange={() => setAnalysisType("github")}
                />
                <span>GitHub URL</span>
              </label>
            </div>
            <div className="code-samples">
              <span>Try example:</span>
              {codeExamples.map((example, i) => (
                <button
                  key={i}
                  type="button"
                  className="sample-btn"
                  onClick={() => setInput(example.code)}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder={
              analysisType === "solidity"
                ? "Paste Solidity code here..."
                : "Enter GitHub repository URL..."
            }
            rows="8"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="button-row">
            <button type="submit" className="submit-btn" disabled={loading}>
              <Icons.Send />
              <span>Analyze Contract</span>
            </button>
          </div>
        </form>

        {showSuccessMessage && (
          <div className="toast-message">
            <Icons.Check /> Action completed successfully
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================
   MAIN APP
   ===================== */
export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const pages = {
    dashboard: <Dashboard />,
    audit: <Audit />,
    library: <SecurityLibrary />,
    history: <History />,
    settings: <Settings />,
  };

  return (
    <div className={`app-layout ${isDrawerOpen ? "drawer-open" : "drawer-closed"}`}>
      <SideDrawer 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <div className={`main-container ${isDrawerOpen ? "drawer-open" : ""}`}>
        {pages[currentPage] || <Dashboard />}
      </div>
    </div>
  );
}
