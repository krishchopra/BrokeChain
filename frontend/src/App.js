import React, { useState, useEffect, useRef, useCallback } from "react";
import { GitHubAudit } from "./components/GitHubAudit";
import { GitHubCallback } from "./components/GitHubCallback";
import ReactMarkdown from "react-markdown";
import preTrainData from './pre-train.json';
import "./App.css";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import GitHubUrlInput from "./components/GitHubUrlInput";
import { Octokit } from "@octokit/core";
import FileSelector from "./components/FileSelector";
import { getAllFiles } from "./utils/getAllFiles";

/* =====================
   ICONS
   ===================== */
export const Icons = {
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
        21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 
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
	GitHub: () => (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
		</svg>
	),
};

/* =====================
   NAV ITEMS
   ===================== */
const navItems = [
	{ id: "dashboard", label: "Dashboard", icon: <Icons.Dashboard /> },
	{ id: "audit", label: "Smart Contract Audit", icon: <Icons.Audit /> },
	{ id: "github-audit", label: "GitHub Audit", icon: <Icons.GitHub /> },
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
					<span className="logo-icon"></span>
					<span className="logo-text">BrokeChain</span>
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
				{/* <p className="version-tag">Version 2.0</p> */}
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
				<text
					x="50%"
					y="45%"
					textAnchor="middle"
					className="gauge-text"
				>
					{score}%
				</text>
				<text
					x="50%"
					y="60%"
					textAnchor="middle"
					className="gauge-label"
				>
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
				<strong>Impact:</strong>{" "}
				{vuln.impact ||
					"Could lead to fund loss or contract compromise"}
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
				<h3>
					<Icons.Info /> AI Auto-Fix Suggestion
				</h3>
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
		const counts = {
			high: 0,
			medium: 0,
			low: 0,
			total: vulnerabilities.length,
		};

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
				<button
					className="search-clear"
					onClick={() => handleChange({ target: { value: "" } })}
				>
					<Icons.Close />
				</button>
			)}
		</div>
	);
}

/* =====================
   DASHBOARD PAGE
   ===================== */
function Dashboard({ setCurrentPage }) {
	// Sample data for demonstration purposes
	const recentAudits = [
		{
			id: 1,
			name: "TokenSwap.sol",
			date: "2025-02-28",
			issues: { high: 2, medium: 3, low: 1 },
			score: 78,
		},
		{
			id: 2,
			name: "LiquidityPool.sol",
			date: "2025-02-25",
			issues: { high: 0, medium: 1, low: 4 },
			score: 92,
		},
		{
			id: 3,
			name: "NFTMarketplace.sol",
			date: "2025-02-20",
			issues: { high: 1, medium: 2, low: 3 },
			score: 85,
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
					<button
						className="primary-button"
						onClick={() => setCurrentPage("audit")}
					>
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
											<span className="issue-badge high">
												{audit.issues.high}
											</span>
										)}
										{audit.issues.medium > 0 && (
											<span className="issue-badge medium">
												{audit.issues.medium}
											</span>
										)}
										{audit.issues.low > 0 && (
											<span className="issue-badge low">
												{audit.issues.low}
											</span>
										)}
									</div>
									<div className="audit-score">
										<div
											className="score-circle"
											style={{
												borderColor:
													audit.score >= 80
														? "var(--success)"
														: audit.score >= 60
														? "var(--warning)"
														: "var(--error)",
											}}
										>
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
									<p className="vulnerability-count">
										{vuln.count} occurrences
									</p>
								</div>
								<div className="trend-indicator">
									<span
										className={
											vuln.change.startsWith("+")
												? "up"
												: "down"
										}
									>
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
							<h4>
								Implement Checks-Effects-Interactions Pattern
							</h4>
							<p>
								Always update state variables before interacting
								with external contracts to prevent reentrancy
								attacks.
							</p>
						</div>
					</div>
					<div className="tip-item">
						<div className="tip-icon">🔒</div>
						<div className="tip-text">
							<h4>Use Access Control Lists</h4>
							<p>
								Implement proper access controls for sensitive
								functions and avoid using tx.origin for
								authentication.
							</p>
						</div>
					</div>
					<div className="tip-item">
						<div className="tip-icon">⚠️</div>
						<div className="tip-text">
							<h4>Avoid Hardcoded Gas Values</h4>
							<p>
								With EIP-1559 and gas optimizations, avoid
								hardcoding gas values in your contracts.
							</p>
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
			description:
				"Occurs when external contract calls are allowed to make new calls to the calling contract before the first execution is complete",
			risk: "High",
			code: `function withdrawFunds() public {
  uint256 amount = balances[msg.sender];
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Transfer failed");
  balances[msg.sender] = 0; // State update after external call
}`,
		},
		{
			id: 2,
			name: "Integer Overflow/Underflow",
			description:
				"Arithmetic operations reaching the maximum or minimum size of the type and wrapping around",
			risk: "Medium",
			code: `function addToBalance(uint256 amount) public {
  balances[msg.sender] += amount; // Potential overflow
}`,
		},
		{
			id: 3,
			name: "Access Control",
			description:
				"Missing or incorrect access controls allowing unauthorized actions",
			risk: "High",
			code: `function transferOwnership(address newOwner) public {
  owner = newOwner; // Missing owner check
}`,
		},
		{
			id: 4,
			name: "Front-Running",
			description:
				"Transaction order exploitation by observing pending transactions and inserting own transaction",
			risk: "Medium",
			code: `function setPrice(uint256 newPrice) public {
  require(newPrice > 0, "Price must be positive");
  price = newPrice; // Vulnerable to front-running
}`,
		},
	];

	const securePatterns = [
		{
			id: 1,
			name: "Checks-Effects-Interactions Pattern",
			description:
				"Follow this pattern to prevent reentrancy: check conditions, update state, interact with external contracts",
			benefits: "Prevents reentrancy attacks",
			code: `function withdrawFunds() public {
  uint256 amount = balances[msg.sender]; // Check
  balances[msg.sender] = 0; // Effect (state update)
  (bool success, ) = msg.sender.call{value: amount}(""); // Interaction
  require(success, "Transfer failed");
}`,
		},
		{
			id: 2,
			name: "Pull Over Push Pattern",
			description:
				"Allow users to withdraw funds themselves instead of pushing funds to them",
			benefits: "Reduces reentrancy risk, gas efficiency",
			code: `// Users call this function to withdraw
function withdraw() public {
  uint256 amount = pendingWithdrawals[msg.sender];
  pendingWithdrawals[msg.sender] = 0;
  payable(msg.sender).transfer(amount);
}`,
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
}`,
		},
	];

	const filteredVulnerabilities = vulnerabilityPatterns.filter(
		(vuln) =>
			vuln.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vuln.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const filteredPatterns = securePatterns.filter(
		(pattern) =>
			pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			pattern.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
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
											<span
												className={`risk-level ${vuln.risk.toLowerCase()}`}
											>
												{vuln.risk} Risk
											</span>
										</div>
										<p className="library-item-desc">
											{vuln.description}
										</p>
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
									<p>
										No vulnerability patterns found matching
										"{searchQuery}"
									</p>
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
										<p className="library-item-desc">
											{pattern.description}
										</p>
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
									<p>
										No secure patterns found matching "
										{searchQuery}"
									</p>
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
			notes: "Initial audit of token swap contract",
		},
		{
			id: 2,
			title: "LiquidityPool.sol",
			date: "2025-02-25 09:15",
			issueCount: { high: 0, medium: 1, low: 4 },
			score: 92,
			tags: ["DeFi", "Liquidity"],
			notes: "Follow-up after first round of fixes",
		},
		{
			id: 3,
			title: "NFTMarketplace.sol",
			date: "2025-02-20 16:45",
			issueCount: { high: 1, medium: 2, low: 3 },
			score: 85,
			tags: ["NFT", "Marketplace"],
			notes: "Complete marketplace contract review",
		},
		{
			id: 4,
			title: "Staking.sol",
			date: "2025-02-15 11:20",
			issueCount: { high: 3, medium: 2, low: 2 },
			score: 65,
			tags: ["Staking", "Rewards"],
			notes: "Initial review of staking mechanics",
		},
		{
			id: 5,
			title: "Governance.sol",
			date: "2025-02-10 13:50",
			issueCount: { high: 0, medium: 0, low: 2 },
			score: 96,
			tags: ["DAO", "Governance"],
			notes: "Review of voting mechanisms",
		},
	];

	// Filter history by search term
	const filteredHistory = mockHistory.filter((item) => {
		// Filter by search term
		const searchMatch =
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		// Filter by severity
		const hasHighIssues = item.issueCount.high > 0;
		const hasMediumIssues = item.issueCount.medium > 0;

		if (filterBy === "all") return searchMatch;
		if (filterBy === "high") return searchMatch && hasHighIssues;
		if (filterBy === "medium") return searchMatch && hasMediumIssues;
		if (filterBy === "clean")
			return searchMatch && !hasHighIssues && !hasMediumIssues;

		return searchMatch;
	});

	// Sort history based on sortBy and sortOrder
	const sortedHistory = [...filteredHistory].sort((a, b) => {
		if (sortBy === "date") {
			return sortOrder === "asc"
				? new Date(a.date) - new Date(b.date)
				: new Date(b.date) - new Date(a.date);
		} else if (sortBy === "score") {
			return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
		} else if (sortBy === "issues") {
			const aTotal =
				a.issueCount.high + a.issueCount.medium + a.issueCount.low;
			const bTotal =
				b.issueCount.high + b.issueCount.medium + b.issueCount.low;
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
					<button
						className="sort-order-btn"
						onClick={toggleSortOrder}
					>
						{sortOrder === "asc" ? (
							<Icons.ChevronRight />
						) : (
							<Icons.ChevronLeft />
						)}
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
							whileHover={{
								y: -5,
								boxShadow: "var(--shadow-lg)",
							}}
						>
							<div className="history-item-header">
								<h3>{item.title}</h3>
								<div
									className="history-item-score"
									style={{
										backgroundColor:
											item.score >= 80
												? "var(--success)"
												: item.score >= 60
												? "var(--warning)"
												: "var(--error)",
									}}
								>
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
									<span key={index} className="history-tag">
										{tag}
									</span>
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
function SettingsOption({ label, description, defaultChecked, onChange, id }) {
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
							<input
								type="password"
								value="••••••••••••••••••••••"
								readOnly
							/>
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
function Audit({ contractInput, setContractInput }) {
	const [activeStep, setActiveStep] = useState(0);
	const [fileUploadStatus, setFileUploadStatus] = useState("");
	const [analysisType, setAnalysisType] = useState("solidity");
	const [input, setInput] = useState(contractInput || "");
	const [preTrainedDataText, setPreTrainedDataText] = useState(JSON.stringify(preTrainData));
	const [loading, setLoading] = useState(false);
	const [typingMessage, setTypingMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [vulnerabilities, setVulnerabilities] = useState([]);
	const [fixedVulnerabilities, setFixedVulnerabilities] = useState([]);
	const [confidenceScore, setConfidenceScore] = useState(0);
	const [autoFixCode, setAutoFixCode] = useState("");
	const [contractName, setContractName] = useState("");
	const [contractStats, setContractStats] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [gasSavings, setGasSavings] = useState(0);
	const [auditHistory, setAuditHistory] = useState([]);
	const [initialLoad, setInitialLoad] = useState(true);
	const [apiError, setApiError] = useState(null);

	const typingIntervalRef = useRef(null);
	const messagesEndRef = useRef(null);
	const chatContainerRef = useRef(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [repoFiles, setRepoFiles] = useState([]);
	const [showFileSelector, setShowFileSelector] = useState(false);
	const [loadingFiles, setLoadingFiles] = useState(false);
	const [repoOwner, setRepoOwner] = useState(null);
	const [repoName, setRepoName] = useState(null);

	// Setup audit steps
	const auditSteps = [
		{ id: "input", title: "Contract Input", icon: <Icons.Audit /> },
		{ id: "analyze", title: "Analysis", icon: <Icons.Search /> },
		{ id: "report", title: "Audit Report", icon: <Icons.Library /> },
	];

	// Initialize audit history from localStorage if available
	useEffect(() => {
		if (initialLoad) {
			const savedHistory = localStorage.getItem("auditHistory");
			if (savedHistory) {
				try {
					setAuditHistory(JSON.parse(savedHistory));
				} catch (e) {
					console.error("Error loading audit history:", e);
					// Fallback to empty history
					setAuditHistory([]);
				}
			}
			setInitialLoad(false);
		}
	}, [initialLoad]);

	// Save audit history to localStorage when it changes
	useEffect(() => {
		if (!initialLoad && auditHistory.length > 0) {
			localStorage.setItem("auditHistory", JSON.stringify(auditHistory));
		}
	}, [auditHistory, initialLoad]);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				chatContainerRef.current;
			const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

			if (isNearBottom) {
				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	// Remove all auto-scrolling behavior
	useEffect(() => {
		// Deliberately empty - removing all auto-scrolling behavior
	}, [messages, loading]);

	const formatReport = (report) => {
		if (!report?.vulnerabilities?.length) {
			return "# No vulnerabilities found.\nEverything looks good!";
		}

		let md = "# Vulnerability Report\n\n";

		report.vulnerabilities.forEach((vuln, i) => {
			md += `## ${i + 1}. ${vuln.type}\n`;
			md += `**Severity:** ${vuln.severity}\n\n`;
			md += `**Recommendation:** ${vuln.recommendation}\n\n`;

			if (vuln.lineReferences) {
				md +=
					"**Code:**\n\n```solidity\n" +
					vuln.lineReferences +
					"\n```\n\n";
			}
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
		}, 2);
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

	// Extract contract name from code
	const extractContractName = (code) => {
		const contractMatch = code.match(/contract\s+(\w+)/);
		return contractMatch ? contractMatch[1] : "Unnamed Contract";
	};

	// Calculate contract statistics
	const analyzeContractStats = (code) => {
		const lines = code.split("\n").length;
		const functions = (code.match(/function\s+\w+/g) || []).length;
		const variables = (
			code.match(/\b(uint|int|bool|address|string|bytes|mapping)\b/g) ||
			[]
		).length;

		return {
			lines,
			functions,
			variables,
			complexity: Math.round(functions * 1.5 + variables * 0.8),
		};
	};

	const handleCopyVulnerability = (vuln) => {
		const text = `Vulnerability: ${vuln.type}
Severity: ${vuln.severity}
Recommendation: ${vuln.recommendation}

${vuln.lineReferences || ""}`;

		navigator.clipboard.writeText(text);
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		// Move to analysis step
		setActiveStep(1);

		// Add user message
		setMessages((prev) => [
			...prev,
			{
				sender: "user",
				text: `Analyzing contract code:\n\n\`\`\`solidity\n${
					input.length > 200 ? input.substring(0, 200) + "..." : input
				}\n\`\`\``,
			},
		]);
		setLoading(true);
		setApiError(null);

		try {
			// Extract contract name and analyze stats before API call
			const name = extractContractName(input);
			setContractName(name);

			// // Analyze contract statistics
			// const stats = analyzeContractStats(input);
			// setContractStats(stats);

			// API integration with Hugging Face
			const apiKey = process.env.REACT_APP_OPENAI_SECRET_KEY || "";
			console.log(preTrainedDataText)

			const payload = {
				api_key: apiKey,
				pre_traineddata_text: preTrainedDataText,
				prompt: input,
			};

			const response = await fetch(
				"https://daniyalmoha-solidity-contract-auditor.hf.space/analyze_smart_contract",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				throw new Error(
					`API request failed: ${response.status} ${response.statusText}`
				);
			}

			const result = await response.json();
			console.log("API Result:", result);

			// Convert the vulnerabilities to our format
			const convertedVulnerabilities = (result.vulnerabilities || []).map(
				(vuln, index) => ({
					id: `V-${String(index + 1).padStart(3, "0")}`,
					type: vuln.title,
					category: categorizeVulnerability(vuln.title),
					severity:
						vuln.severity.charAt(0).toUpperCase() +
						vuln.severity.slice(1),
					impact:
						"Could lead to " +
						getImpactDescription(vuln.title, vuln.severity),
					recommendation: vuln.description,
					lineReferences: vuln.codeSnippet,
					affectedLines: getAffectedLines(vuln.codeSnippet),
					fixApplied: false,
					gasSaved: estimateGasSavings(vuln.title, vuln.severity),
				})
			);

			setVulnerabilities(convertedVulnerabilities);

			setContractStats({
				lines: result.number_of_lines,
				functions: result.number_of_functions,
				complexity: result.complexity_score,
				security_score: result.security_score,
			});

			setConfidenceScore(result.security_score);

			// Calculate total gas savings
			const totalGasSavings = convertedVulnerabilities.reduce(
				(sum, vuln) => sum + (vuln.gasSaved || 0),
				0
			);
			setGasSavings(totalGasSavings);
			const shortSummary = result.analysis_text;

			// Set a confidence score based on the vulnerabilities
			const highSeverityCount = convertedVulnerabilities.filter(
				(v) => v.severity === "High" || v.severity === "Critical"
			).length;
			const mediumSeverityCount = convertedVulnerabilities.filter(
				(v) => v.severity === "Medium"
			).length;

			// Set automatic fix code if available
			if (result.autoFixCode) {
				setAutoFixCode(result.autoFixCode);
			} else if (convertedVulnerabilities.length > 0) {
				// Generate a simple example fix for the first vulnerability
				const firstVuln = convertedVulnerabilities[0];
				if (firstVuln.lineReferences) {
					const fixedCode = generateFixSuggestion(firstVuln);
					if (fixedCode) {
						setAutoFixCode(fixedCode);
						// Add to fixed vulnerabilities
						setFixedVulnerabilities([
							{ ...firstVuln, fixApplied: true },
						]);
					}
				}
			}

			// Add result to audit history
			const newAudit = {
				id: `A-${String(auditHistory.length + 1).padStart(3, "0")}`,
				date: new Date().toLocaleString(),
				contractName: name,
				issueCount: {
					high: convertedVulnerabilities.filter(
						(v) =>
							v.severity === "High" || v.severity === "Critical"
					).length,
					medium: convertedVulnerabilities.filter(
						(v) => v.severity === "Medium"
					).length,
					low: convertedVulnerabilities.filter(
						(v) => v.severity === "Low"
					).length,
					info: convertedVulnerabilities.filter(
						(v) => v.severity === "Info"
					).length,
				},
				score: result.security_score,
				code:
					input.substring(0, 200) + (input.length > 200 ? "..." : ""),
			};

			setAuditHistory((prev) => [newAudit, ...prev]);

			// Build a final "report-like" text for chat
			const finalReport = {
				vulnerabilities: convertedVulnerabilities,
			};
			const finalText = formatReport(finalReport);

			// Move to report step
			setActiveStep(2);
			setMessages((prev) => [
				...prev,
				{ sender: "bot", text: shortSummary },
			]);

			// Add a "bot" message and start typed effect
			setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
			startTyping(finalText);
		} catch (err) {
			console.error("Error during analysis:", err);
			setApiError(err.message);

			// Generate some mock results for demo purposes if API fails
			const mockVulnerabilities = generateMockVulnerabilities(input);
			setVulnerabilities(mockVulnerabilities);

			// Calculate mock confidence score
			const score = 75 - mockVulnerabilities.length * 5;
			setConfidenceScore(score);

			// Add mock result to audit history
			const newAudit = {
				id: `A-${String(auditHistory.length + 1).padStart(3, "0")}`,
				date: new Date().toLocaleString(),
				contractName: contractName,
				issueCount: {
					high: mockVulnerabilities.filter(
						(v) => v.severity === "High"
					).length,
					medium: mockVulnerabilities.filter(
						(v) => v.severity === "Medium"
					).length,
					low: mockVulnerabilities.filter((v) => v.severity === "Low")
						.length,
					info: mockVulnerabilities.filter(
						(v) => v.severity === "Info"
					).length,
				},
				score: score,
				code:
					input.substring(0, 200) + (input.length > 200 ? "..." : ""),
			};

			setAuditHistory((prev) => [newAudit, ...prev]);

			// Build a report with mock vulnerabilities
			const mockReport = {
				vulnerabilities: mockVulnerabilities,
			};
			const reportText = formatReport(mockReport);

			// Add warning about API failure
			const warningText = `# API Error: ${err.message}\n\nFalling back to mock results for demonstration purposes. In a production environment, you would need to fix the API connection.\n\n${reportText}`;

			// Move to report step
			setActiveStep(2);

			// Add a "bot" message with the warning and mock results
			setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
			startTyping(warningText);
		}

		setLoading(false);
	};

	const handleJSONFileSelect = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		// Basic validation check
		if (file.type !== "application/json") {
		  setFileUploadStatus("Please select a valid JSON file.");
		  return;
		}
	  
		const reader = new FileReader();
		reader.onload = (e) => {
		  const fileText = e.target.result;
		  setPreTrainedDataText(fileText);
		  setFileUploadStatus(`${file.name} has been successfully uploaded for pre-training.`);
		};
		reader.readAsText(file);
	  };
	
	/* --- Add these new state + drag handlers below handleJSONFileSelect --- */
	
	// Track drag state so we can highlight the box when hovering a file
	const [isDragOver, setIsDragOver] = useState(false);
	
	// If a user drags a file over the drop area
	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};
	
	// If they leave the drop area
	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};
	
	// If they actually drop the file
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files?.[0];
		if (!file) return;
	
		// Basic validation check
		if (file.type !== "application/json") {
		alert("Please drop a valid JSON file.");
		return;
		}
	
		const reader = new FileReader();
		reader.onload = (event) => {
		const fileText = event.target.result;
		setPreTrainedDataText(fileText);
		alert("JSON loaded successfully via drag & drop!");
		};
		reader.readAsText(file);
	};
  
	// Helper functions to enhance mock data
	const categorizeVulnerability = (title) => {
		const lowerTitle = title.toLowerCase();
		if (
			lowerTitle.includes("reentrancy") ||
			lowerTitle.includes("overflow") ||
			lowerTitle.includes("underflow") ||
			lowerTitle.includes("access control") ||
			lowerTitle.includes("authorization") ||
			lowerTitle.includes("authentication")
		) {
			return "Security";
		} else if (
			lowerTitle.includes("gas") ||
			lowerTitle.includes("optimiz")
		) {
			return "Optimization";
		} else {
			return "Reliability";
		}
	};

	const getImpactDescription = (title, severity) => {
		const lowerTitle = title.toLowerCase();
		if (lowerTitle.includes("reentrancy")) {
			return "fund theft through recursive calls";
		} else if (
			lowerTitle.includes("overflow") ||
			lowerTitle.includes("underflow")
		) {
			return "incorrect balance calculations";
		} else if (lowerTitle.includes("access control")) {
			return "unauthorized access to restricted functions";
		} else if (lowerTitle.includes("gas")) {
			return "excessive transaction costs";
		} else if (severity.toLowerCase() === "high") {
			return "potential loss of funds or contract compromise";
		} else if (severity.toLowerCase() === "medium") {
			return "unexpected contract behavior";
		} else {
			return "reduced contract efficiency or minor issues";
		}
	};

	const getAffectedLines = (codeSnippet) => {
		if (!codeSnippet) return [];
		// Simplistic approach - in real implementation would need more sophisticated parsing
		const lines = codeSnippet.split("\n");
		return Array.from({ length: lines.length }, (_, i) => i + 1);
	};

	const estimateGasSavings = (title, severity) => {
		const lowerTitle = title.toLowerCase();
		if (lowerTitle.includes("gas")) {
			return Math.floor(Math.random() * 15000) + 5000; // 5000-20000 gas
		} else if (
			lowerTitle.includes("storage") ||
			lowerTitle.includes("memory")
		) {
			return Math.floor(Math.random() * 10000) + 3000; // 3000-13000 gas
		} else if (lowerTitle.includes("loop")) {
			return Math.floor(Math.random() * 25000) + 10000; // 10000-35000 gas
		} else if (severity.toLowerCase() === "low" && Math.random() > 0.7) {
			return Math.floor(Math.random() * 2000) + 1000; // 1000-3000 gas for some low severity issues
		}
		return 0;
	};

	const generateFixSuggestion = (vulnerability) => {
		const lowerType = vulnerability.type.toLowerCase();
		if (lowerType.includes("reentrancy")) {
			return vulnerability.lineReferences.replace(
				/(bool success[^;]*;)[^}]*(balances\[msg\.sender\])/s,
				"balances[msg.sender] -= _amount; // Update state before external call\n\n    $1 // Make external call after state changes"
			);
		} else if (
			lowerType.includes("overflow") ||
			lowerType.includes("underflow")
		) {
			return vulnerability.lineReferences.replace(
				/uint(\d*)/g,
				"uint$1 // Consider using SafeMath for Solidity <0.8.0 or rely on built-in checks for >=0.8.0"
			);
		} else if (lowerType.includes("access control")) {
			return vulnerability.lineReferences
				.replace(
					/function\s+(\w+)/,
					"function $1 // Add onlyOwner or access control modifier"
				)
				.replace(
					/{\s*\n/,
					'{\n    require(msg.sender == owner, "Not authorized"); // Add access control check\n'
				);
		}
		return null;
	};

	const generateMockVulnerabilities = (code) => {
		// Generate 2-4 mock vulnerabilities based on the code for demo purposes
		const vulnerabilityTypes = [
			{
				title: "Reentrancy Vulnerability",
				severity: "High",
				category: "Security",
				description:
					"The contract is vulnerable to reentrancy attacks. Consider implementing checks-effects-interactions pattern.",
			},
			{
				title: "Unchecked Return Values",
				severity: "Medium",
				category: "Reliability",
				description:
					"Return values of external calls are not checked, which may lead to unexpected behavior.",
			},
			{
				title: "Gas Optimization",
				severity: "Low",
				category: "Optimization",
				description:
					"The contract uses inefficient patterns that consume excessive gas. Consider optimizing storage access.",
			},
			{
				title: "Access Control Issue",
				severity: "High",
				category: "Security",
				description:
					"Critical functions lack proper access controls. Implement permission checks or modifiers.",
			},
			{
				title: "Uninitialized Storage Variables",
				severity: "Medium",
				category: "Reliability",
				description:
					"Some storage variables may be uninitialized, leading to unexpected default values.",
			},
		];

		// Randomly select 2-4 vulnerability types
		const count = Math.floor(Math.random() * 3) + 2;
		const shuffled = [...vulnerabilityTypes].sort(
			() => 0.5 - Math.random()
		);
		const selectedTypes = shuffled.slice(0, count);

		// Extract code snippets for each vulnerability
		const codeLines = code.split("\n");
		const functionMatches = [
			...code.matchAll(/function\s+(\w+)[^{]*{[^}]*}/g),
		];

		return selectedTypes.map((type, index) => {
			// Try to find a relevant code snippet from the contract
			let snippet = "";
			if (functionMatches.length > 0) {
				const randomFunctionIndex = Math.floor(
					Math.random() * functionMatches.length
				);
				snippet = functionMatches[randomFunctionIndex][0];
			} else if (codeLines.length > 5) {
				// Take a random 5-8 line snippet from the contract
				const startLine = Math.floor(
					Math.random() * (codeLines.length - 8)
				);
				const lineCount = Math.floor(Math.random() * 4) + 5;
				snippet = codeLines
					.slice(startLine, startLine + lineCount)
					.join("\n");
			} else {
				// Use the entire contract if it's very short
				snippet = code;
			}

			return {
				id: `V-${String(index + 1).padStart(3, "0")}`,
				type: type.title,
				category: type.category,
				severity: type.severity,
				impact:
					"Could lead to " +
					getImpactDescription(type.title, type.severity),
				recommendation: type.description,
				lineReferences: snippet,
				affectedLines: getAffectedLines(snippet),
				fixApplied: false,
				gasSaved: estimateGasSavings(type.title, type.severity),
			};
		});
	};

	const applyFix = (vulnerability) => {
		setFixedVulnerabilities((prev) => {
			// Check if already fixed
			const alreadyFixed = prev.some((v) => v.id === vulnerability.id);
			if (alreadyFixed) return prev;

			// Add to fixed vulnerabilities
			return [...prev, { ...vulnerability, fixApplied: true }];
		});

		// Update gas savings if applicable
		if (vulnerability.gasSaved) {
			setGasSavings((prev) => prev + vulnerability.gasSaved);
		}

		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	// Export as PDF using jsPDF
	const exportPDF = () => {
		const doc = new jsPDF();
		const reportText = formatReport({ vulnerabilities });
		// Add text with basic margin; adjust as needed for layout
		doc.text(reportText, 10, 10);
		doc.save("audit_report.pdf");
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	// Export as Markdown
	const exportMarkdown = () => {
		const markdownReport = formatReport({ vulnerabilities });
		const blob = new Blob([markdownReport], {
			type: "text/markdown;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "audit_report.md";
		a.click();
		URL.revokeObjectURL(url);
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	// Export as plain Text
	const exportText = () => {
		const reportText = formatReport({ vulnerabilities });
		const blob = new Blob([reportText], {
			type: "text/plain;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "audit_report.txt";
		a.click();
		URL.revokeObjectURL(url);
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	// Export as JSON
	const exportJSON = () => {
		const reportJSON = JSON.stringify({ vulnerabilities }, null, 2);
		const blob = new Blob([reportJSON], {
			type: "application/json;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "audit_report.json";
		a.click();
		URL.revokeObjectURL(url);
		setShowSuccessMessage(true);
		setTimeout(() => setShowSuccessMessage(false), 2000);
	};

	const clearChat = () => {
		setMessages([]);
		setVulnerabilities([]);
		setFixedVulnerabilities([]);
		setTypingMessage("");
		setConfidenceScore(0);
		setAutoFixCode("");
		setContractName("");
		setContractStats(null);
		setGasSavings(0);
		setActiveStep(0);
		setApiError(null);
	};

	const filterVulnerabilities = () => {
		if (selectedCategory === "all") return vulnerabilities;
		return vulnerabilities.filter((v) => v.category === selectedCategory);
	};

	const getVulnerabilityCounts = () => {
		const counts = {
			Security: vulnerabilities.filter((v) => v.category === "Security")
				.length,
			Reliability: vulnerabilities.filter(
				(v) => v.category === "Reliability"
			).length,
			Optimization: vulnerabilities.filter(
				(v) => v.category === "Optimization"
			).length,
			total: vulnerabilities.length,
		};
		return counts;
	};

	const getSeverityCounts = () => {
		const counts = {
			high: vulnerabilities.filter(
				(v) => v.severity === "High" || v.severity === "Critical"
			).length,
			medium: vulnerabilities.filter((v) => v.severity === "Medium")
				.length,
			low: vulnerabilities.filter((v) => v.severity === "Low").length,
			info: vulnerabilities.filter((v) => v.severity === "Info").length,
			total: vulnerabilities.length,
		};
		return counts;
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
}`,
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
}`,
		},
	];

	// Contract Audit Progress Steps Component
	const AuditSteps = () => (
		<div className="audit-steps">
			{auditSteps.map((step, index) => (
				<div
					key={step.id}
					className={`audit-step ${
						activeStep >= index ? "completed" : ""
					} ${activeStep === index ? "active" : ""}`}
					onClick={() => activeStep > index && setActiveStep(index)}
				>
					<div className="step-icon">
						{activeStep > index ? <Icons.Check /> : step.icon}
					</div>
					<div className="step-content">
						<span className="step-number">Step {index + 1}</span>
						<span className="step-title">{step.title}</span>
					</div>
					{index < auditSteps.length - 1 && (
						<div className="step-connector" />
					)}
					<div className="step-progress"></div>
				</div>
			))}
		</div>
	);

	// Contract Statistics Component
	const ContractStatistics = ({ stats, name }) => (
		<div className="contract-stats">
			<div className="stats-header">
				<h3>{name}</h3>
				<span className="stats-badge">Solidity ^0.8.0</span>
			</div>
			<div className="stats-grid">
				<div className="stat-box">
					<span className="stat-value">{stats.lines}</span>
					<span className="stat-label">Lines of Code</span>
				</div>
				<div className="stat-box">
					<span className="stat-value">{stats.functions}</span>
					<span className="stat-label">Functions</span>
				</div>
				<div className="stat-box">
					<span className="stat-value">{stats.security_score}</span>
					<span className="stat-label">Security Score</span>
				</div>
				<div className="stat-box">
					<span className="stat-value">{stats.complexity}</span>
					<span className="stat-label">Complexity Score</span>
				</div>
			</div>
		</div>
	);

	// Audit Report Summary Component
	const AuditReportSummary = () => {
		const severityCounts = getSeverityCounts();
		const categoryCounts = getVulnerabilityCounts();

		return (
			<div className="audit-report-summary">
				<div className="summary-card">
					<div className="summary-header">
						<h3>Security Score</h3>
						<div
							className="score-pill"
							style={{
								backgroundColor:
									confidenceScore >= 80
										? "var(--success)"
										: confidenceScore >= 60
										? "var(--warning)"
										: "var(--error)",
							}}
						>
							{confidenceScore}%
						</div>
					</div>
					<div className="summary-content">
						<div className="score-gauge">
							<ConfidenceGauge score={confidenceScore} />
						</div>
						<div className="score-description">
							{confidenceScore >= 80 ? (
								<p>
									This contract has a <strong>good</strong>{" "}
									security score. Consider fixing the
									remaining issues before deployment.
								</p>
							) : confidenceScore >= 60 ? (
								<p>
									This contract has a{" "}
									<strong>moderate</strong> security score.
									Address high severity issues before
									deployment.
								</p>
							) : (
								<p>
									This contract has a <strong>poor</strong>{" "}
									security score. Significant security issues
									must be fixed before deployment.
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="summary-card">
					<div className="summary-header">
						<h3>Vulnerability Breakdown</h3>
						<div className="issue-count-pill">
							{severityCounts.total} issues found
						</div>
					</div>
					<div className="summary-content">
						<div className="issue-distribution">
							<div className="pie-chart">
								{/* Pie chart visualization */}
								<svg viewBox="0 0 100 100" className="pie">
									<circle
										r="25"
										cx="50"
										cy="50"
										fill="transparent"
										stroke="var(--error)"
										strokeWidth="50"
										strokeDasharray={`${
											severityCounts.high > 0
												? (severityCounts.high * 31.4) /
												  severityCounts.total
												: 0
										} 100`}
										transform="rotate(-90 50 50)"
									/>
									<circle
										r="25"
										cx="50"
										cy="50"
										fill="transparent"
										stroke="var(--warning)"
										strokeWidth="50"
										strokeDasharray={`${
											severityCounts.medium > 0
												? (severityCounts.medium *
														31.4) /
												  severityCounts.total
												: 0
										} 100`}
										strokeDashoffset={`${-(severityCounts.high >
										0
											? (severityCounts.high * 31.4) /
											  severityCounts.total
											: 0)}`}
										transform="rotate(-90 50 50)"
									/>
									<circle
										r="25"
										cx="50"
										cy="50"
										fill="transparent"
										stroke="var(--success)"
										strokeWidth="50"
										strokeDasharray={`${
											severityCounts.low > 0
												? (severityCounts.low * 31.4) /
												  severityCounts.total
												: 0
										} 100`}
										strokeDashoffset={`${-(severityCounts.high +
											severityCounts.medium >
										0
											? ((severityCounts.high +
													severityCounts.medium) *
													31.4) /
											  severityCounts.total
											: 0)}`}
										transform="rotate(-90 50 50)"
									/>
									<circle
										r="25"
										cx="50"
										cy="50"
										fill="transparent"
										stroke="var(--info)"
										strokeWidth="50"
										strokeDasharray={`${
											severityCounts.info > 0
												? (severityCounts.info * 31.4) /
												  severityCounts.total
												: 0
										} 100`}
										strokeDashoffset={`${-(severityCounts.high +
											severityCounts.medium +
											severityCounts.low >
										0
											? ((severityCounts.high +
													severityCounts.medium +
													severityCounts.low) *
													31.4) /
											  severityCounts.total
											: 0)}`}
										transform="rotate(-90 50 50)"
									/>
									<circle
										r="12.5"
										cx="50"
										cy="50"
										fill="white"
									/>
								</svg>
							</div>
							<div className="issue-legend">
								<div className="legend-item">
									<span className="legend-color high"></span>
									<span className="legend-label">
										High ({severityCounts.high})
									</span>
								</div>
								<div className="legend-item">
									<span className="legend-color medium"></span>
									<span className="legend-label">
										Medium ({severityCounts.medium})
									</span>
								</div>
								<div className="legend-item">
									<span className="legend-color low"></span>
									<span className="legend-label">
										Low ({severityCounts.low})
									</span>
								</div>
								<div className="legend-item">
									<span className="legend-color info"></span>
									<span className="legend-label">
										Info ({severityCounts.info})
									</span>
								</div>
							</div>
						</div>

						<div className="category-stats">
							<div className="category-item">
								<span className="category-name">Security</span>
								<span className="category-count">
									{categoryCounts.Security}
								</span>
							</div>
							<div className="category-item">
								<span className="category-name">
									Reliability
								</span>
								<span className="category-count">
									{categoryCounts.Reliability}
								</span>
							</div>
							<div className="category-item">
								<span className="category-name">
									Optimization
								</span>
								<span className="category-count">
									{categoryCounts.Optimization}
								</span>
							</div>
						</div>
					</div>
				</div>

				{gasSavings > 0 && (
					<div className="summary-card gas-savings">
						<div className="summary-header">
							<h3>Gas Optimization</h3>
							<div className="gas-badge">
								<Icons.Info />
							</div>
						</div>
						<div className="summary-content">
							<div className="gas-amount">
								<span className="gas-value">
									{gasSavings.toLocaleString()}
								</span>
								<span className="gas-label">
									gas potential savings
								</span>
							</div>
							<p className="gas-description">
								Implementing the suggested optimizations could
								reduce gas costs by approximately
								<strong>
									{" "}
									$
									{(
										gasSavings *
										20 *
										0.000000015 *
										2000
									).toFixed(2)}{" "}
									USD
								</strong>{" "}
								at current ETH prices.
							</p>
						</div>
					</div>
				)}

				<div className="summary-card fixes">
					<div className="summary-header">
						<h3>Applied Fixes</h3>
						<div className="fix-count">
							{fixedVulnerabilities.length}/
							{vulnerabilities.length}
						</div>
					</div>
					<div className="summary-content">
						{fixedVulnerabilities.length > 0 ? (
							<div className="fixes-list">
								{fixedVulnerabilities.map((fix) => (
									<div key={fix.id} className="fix-item">
										<div className="fix-icon">
											<Icons.Check />
										</div>
										<div className="fix-details">
											<span className="fix-name">
												{fix.type}
											</span>
											<span className="fix-id">
												{fix.id}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="no-fixes">
								<p>No fixes have been applied yet.</p>
								<p>
									Click "Apply Fix" on a vulnerability to
									implement recommended changes.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	// Recent Audits Component
	const RecentAudits = () => (
		<div className="recent-audits-container">
			<h3>Recent Audits</h3>
			<div className="recent-audits">
				{auditHistory.length > 0 ? (
					auditHistory.slice(0, 3).map((audit) => (
						<div
							key={audit.id}
							className="recent-audit-item"
							onClick={() => {
								// Load back the previous audit
								if (audit.code) {
									setInput(audit.code);
								}
							}}
						>
							<div className="audit-item-header">
								<h4>{audit.contractName}</h4>
								<div
									className="audit-score"
									style={{
										backgroundColor:
											audit.score >= 80
												? "var(--success)"
												: audit.score >= 60
												? "var(--warning)"
												: "var(--error)",
									}}
								>
									{audit.score}
								</div>
							</div>
							<div className="audit-item-meta">
								<div className="audit-item-date">
									{audit.date}
								</div>
								<div className="audit-item-issues">
									{audit.issueCount.high > 0 && (
										<span className="issue-count high">
											{audit.issueCount.high} High
										</span>
									)}
									{audit.issueCount.medium > 0 && (
										<span className="issue-count medium">
											{audit.issueCount.medium} Medium
										</span>
									)}
									{audit.issueCount.low > 0 && (
										<span className="issue-count low">
											{audit.issueCount.low} Low
										</span>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className="empty-audits">No previous audits found</div>
				)}
			</div>
		</div>
	);

	// Audit tips and info component
	const AuditTips = () => (
		<div className="audit-tips">
			<h3>Auditing Tips</h3>
			<div className="tips-list">
				<div className="tip-item">
					<div className="tip-icon">💡</div>
					<div className="tip-content">
						<h4>Focus on High Severity Issues</h4>
						<p>
							High severity vulnerabilities can lead to direct
							loss of funds and should be addressed first.
						</p>
					</div>
				</div>
				<div className="tip-item">
					<div className="tip-icon">🔒</div>
					<div className="tip-content">
						<h4>Test After Fixing</h4>
						<p>
							Always thoroughly test your contract after applying
							security fixes to avoid introducing new bugs.
						</p>
					</div>
				</div>
				<div className="tip-item">
					<div className="tip-icon">⚠️</div>
					<div className="tip-content">
						<h4>Consider Multiple Audits</h4>
						<p>
							For critical contracts, consider getting multiple
							independent audits for better security coverage.
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	// Render the appropriate step content based on activeStep
	const renderStepContent = () => {
		switch (activeStep) {
			case 0: // Contract Input
				return (
					<div className="step-content-container">
						<div className="input-container">
							<form
								onSubmit={handleSubmit}
								className="input-form elevated"
							>
								<div className="input-header">
									<div className="input-options">
										<label
											className={
												analysisType === "solidity"
													? "active"
													: ""
											}
										>
											<input
												type="radio"
												value="solidity"
												checked={
													analysisType === "solidity"
												}
												onChange={() =>
													setAnalysisType("solidity")
												}
											/>
											<span>Solidity Code</span>
										</label>
										<label
											className={
												analysisType === "github"
													? "active"
													: ""
											}
										>
											<input
												type="radio"
												value="github"
												checked={
													analysisType === "github"
												}
												onChange={() =>
													setAnalysisType("github")
												}
											/>
											<span>GitHub URL</span>
										</label>
									</div>
									<div className="input-actions">
										<button
											type="button"
											className="action-btn tooltip"
											onClick={() => setInput("")}
										>
											<Icons.Clear />
											<span className="tooltip-text">
												Clear Code
											</span>
										</button>
									</div>
								</div>

								{analysisType === "solidity" ? (
									<textarea
										placeholder="Paste Solidity code here..."
										rows="16"
										value={input}
										onChange={(e) =>
											setInput(e.target.value)
										}
										className="code-input"
									/>
								) : (
									<div className="github-url-container">
										<div className="github-url-input-group">
											<GitHubUrlInput
												onFetchRepository={async (
													owner,
													repo
												) => {
													try {
														setLoadingFiles(true);
														setRepoOwner(owner);
														setRepoName(repo);
														const token =
															localStorage.getItem(
																"github_access_token"
															);
														const octokit =
															new Octokit({
																auth: token,
															});

														// First, get the root directory contents
														const response =
															await octokit.request(
																"GET /repos/{owner}/{repo}/contents",
																{
																	owner,
																	repo,
																	headers: {
																		"X-GitHub-Api-Version":
																			"2022-11-28",
																	},
																}
															);

														// Process the files recursively to get all files
														const allFiles =
															await getAllFiles(
																octokit,
																owner,
																repo,
																response.data
															);

														// Filter for Solidity files if needed
														const solFiles =
															allFiles.filter(
																(file) =>
																	file.path.endsWith(
																		".sol"
																	)
															);
														setRepoFiles(
															solFiles.length > 0
																? solFiles
																: allFiles
														);
														setShowFileSelector(
															true
														);
													} catch (error) {
														console.error(
															"Error fetching repository:",
															error
														);
														// Handle error appropriately
													} finally {
														setLoadingFiles(false);
													}
												}}
											/>
										</div>

										{/* Show textarea for code preview */}
										<textarea
											placeholder="Code will appear here after selecting a file from the repository..."
											rows="12"
											value={input}
											onChange={(e) =>
												setInput(e.target.value)
											}
											className="code-input"
											readOnly={false}
										/>
									</div>
								)}
								<div
								className={`json-dropzone ${isDragOver ? "drag-over" : ""}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => document.getElementById("jsonFileInput").click()}
								>
								<p>Attach JSON file for pre-training (optional)</p>
								<input
									id="jsonFileInput"
									type="file"
									accept=".json"
									style={{ display: "none" }}
									onChange={handleJSONFileSelect}
								/>
								</div>
								{fileUploadStatus && (
								<div className="file-upload-status">
									{fileUploadStatus}
								</div>
								)}

								<div className="code-samples">
									<span>Try examples:</span>
									<div className="samples-list">
										{codeExamples.map((example, i) => (
											<button
												key={i}
												type="button"
												className="sample-btn pulse-animation"
												onClick={() =>
													setInput(example.code)
												}
											>
												{example.name}
											</button>
										))}
									</div>
								</div>

								<div className="button-row">
									<button
										type="submit"
										className="submit-btn"
										disabled={!input.trim()}
									>
										<Icons.Send />
										<span>Analyze Contract</span>
									</button>
							</div>
							</form>
						</div>

						<div className="sidebar-container">
							<RecentAudits />
							<AuditTips />
						</div>
					</div>
				);

			case 1: // Analysis
				return (
					<div className="step-content-container">
						<div className="analysis-loading">
							<div className="loader"></div>
							<h3>Analyzing Smart Contract</h3>
							<p>
								Scanning for vulnerabilities and security
								issues...
							</p>
							<div className="analysis-stages">
								<div className="stage completed">
									<span className="stage-check">
										<Icons.Check />
									</span>
									<span className="stage-name">
										Parsing contract code
									</span>
								</div>
								<div className="stage completed">
									<span className="stage-check">
										<Icons.Check />
									</span>
									<span className="stage-name">
										Checking syntax and structure
									</span>
								</div>
								<div className="stage active">
									<span className="stage-loader"></span>
									<span className="stage-name">
										Running security analysis
									</span>
								</div>
								<div className="stage">
									<span className="stage-number">4</span>
									<span className="stage-name">
										Generating recommendations
									</span>
								</div>
								<div className="stage">
									<span className="stage-number">5</span>
									<span className="stage-name">
										Preparing report
									</span>
								</div>
							</div>
							<div className="analysis-note">
								<Icons.Info />
								<p>
									This may take a few minutes depending on
									contract complexity
								</p>
							</div>
						</div>
					</div>
				);

			case 2: // Report
				return (
					<div className="step-content-container">
						{apiError && (
							<div className="api-error-banner">
								<Icons.Alert />
								<div className="error-text">
									<span>API Error: {apiError}</span>
									<p>
										Using fallback analysis for
										demonstration. In production, check API
										connectivity.
									</p>
								</div>
							</div>
						)}

						{contractStats && (
							<div className="contract-overview">
								<ContractStatistics
									stats={contractStats}
									name={contractName}
								/>
							</div>
						)}

						<div className="report-container">
							<div className="report-main">
								{vulnerabilities.length > 0 ? (
									<>
										<div className="vulnerability-filters">
											<h3>
												Vulnerabilities (
												{filterVulnerabilities().length}
												)
											</h3>
											<div className="filter-tabs">
												<button
													className={
														selectedCategory ===
														"all"
															? "active"
															: ""
													}
													onClick={() =>
														setSelectedCategory(
															"all"
														)
													}
												>
													All
												</button>
												<button
													className={
														selectedCategory ===
														"Security"
															? "active"
															: ""
													}
													onClick={() =>
														setSelectedCategory(
															"Security"
														)
													}
												>
													Security
												</button>
												<button
													className={
														selectedCategory ===
														"Reliability"
															? "active"
															: ""
													}
													onClick={() =>
														setSelectedCategory(
															"Reliability"
														)
													}
												>
													Reliability
												</button>
												<button
													className={
														selectedCategory ===
														"Optimization"
															? "active"
															: ""
													}
													onClick={() =>
														setSelectedCategory(
															"Optimization"
														)
													}
												>
													Optimization
												</button>
											</div>
										</div>

										<div className="vulnerability-list">
											{filterVulnerabilities().map(
												(vuln, i) => (
													<motion.div
														key={vuln.id || i}
														initial={{
															opacity: 0,
															y: 20,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															duration: 0.3,
															delay: i * 0.05,
														}}
														className={`vulnerability-card ${
															fixedVulnerabilities.some(
																(v) =>
																	v.id ===
																	vuln.id
															)
																? "fixed"
																: ""
														}`}
													>
														<div className="card-header">
															<div className="vuln-info">
																<span
																	className={`severity-indicator ${vuln.severity.toLowerCase()}`}
																></span>
																<h4>
																	{vuln.type}
																</h4>
															</div>
															<div className="vuln-meta">
																{vuln.id && (
																	<span className="vuln-id">
																		{
																			vuln.id
																		}
																	</span>
																)}
																{vuln.category && (
																	<span
																		className={`vuln-category ${vuln.category.toLowerCase()}`}
																	>
																		{
																			vuln.category
																		}
																	</span>
																)}
																{fixedVulnerabilities.some(
																	(v) =>
																		v.id ===
																		vuln.id
																) && (
																	<span className="fix-badge">
																		<Icons.Check />
																		Fixed
																	</span>
																)}
															</div>
														</div>
														<div className="card-content">
															{vuln.impact && (
																<p className="vuln-impact">
																	{
																		vuln.impact
																	}
																</p>
															)}
															<div className="vuln-recommendation">
																<strong>
																	Recommendation:
																</strong>{" "}
																{
																	vuln.recommendation
																}
															</div>
														</div>

														{vuln.lineReferences && (
															<div className="code-container">
																<div className="code-header">
																	Affected
																	Code:
																</div>
																<pre className="code-snippet">
																	<code>
																		{
																			vuln.lineReferences
																		}
																	</code>
																</pre>
															</div>
														)}

														<div className="card-footer">
															{!fixedVulnerabilities.some(
																(v) =>
																	v.id ===
																	vuln.id
															) ? (
																<button
																	className="apply-fix-btn"
																	onClick={() =>
																		applyFix(
																			vuln
																		)
																	}
																>
																	<Icons.Check />
																	Apply Fix
																</button>
															) : (
																<div className="fix-applied">
																	<Icons.Check />
																	Fix Applied
																</div>
															)}
															<button
																className="copy-btn"
																onClick={() =>
																	handleCopyVulnerability(
																		vuln
																	)
																}
															>
																<Icons.Copy />
																Copy Details
															</button>
														</div>
													</motion.div>
												)
											)}

											{filterVulnerabilities().length ===
												0 && (
												<div className="no-vulnerabilities">
													<Icons.Check />
													<p>
														No{" "}
														{selectedCategory !==
														"all"
															? selectedCategory.toLowerCase()
															: ""}{" "}
														vulnerabilities found in
														this category.
													</p>
												</div>
											)}
										</div>
									</>
								) : (
									<div className="no-vulnerabilities-found">
										<div className="success-icon">
											<Icons.Check />
										</div>
										<h3>No Vulnerabilities Found</h3>
										<p>
											Your smart contract appears to be
											secure. No issues were detected
											during the audit.
										</p>
										<p className="security-note">
											Note: While no issues were found,
											this doesn't guarantee complete
											security. Consider multiple audits
											for critical contracts.
										</p>
									</div>
								)}
							</div>

							<div className="report-sidebar">
								<AuditReportSummary />
							</div>
						</div>

						{autoFixCode && (
							<div className="auto-fix">
								<div className="auto-fix-header">
									<h3>
										<Icons.Info /> AI Auto-Fix Suggestion
									</h3>
									<button
										className="copy-code-btn"
										onClick={() => {
											navigator.clipboard.writeText(
												autoFixCode
											);
											setShowSuccessMessage(true);
											setTimeout(
												() =>
													setShowSuccessMessage(
														false
													),
												2000
											);
										}}
									>
										<Icons.Copy />
										<span>Copy Code</span>
									</button>
								</div>
								<pre className="code-snippet">
									<code>{autoFixCode}</code>
								</pre>
							</div>
						)}

						<div className="report-actions">
							<button
								className="secondary-button"
								onClick={clearChat}
							>
								<Icons.Clear />
								<span>New Audit</span>
							</button>
							<button
								className="primary-button"
								onClick={exportText}
							>
								<Icons.Download />
								<span>Export as Text</span>
							</button>
							<button
								className="primary-button"
								onClick={exportJSON}
							>
								<Icons.Download />
								<span>Export as JSON</span>
							</button>
							<button
								className="primary-button"
								onClick={exportMarkdown}
							>
								<Icons.Download />
								<span>Export as Markdown</span>
							</button>
							<button
								className="primary-button"
								onClick={exportPDF}
							>
								<Icons.Download />
								<span>Export as PDF</span>
							</button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	useEffect(() => {
		if (contractInput) {
			setInput(contractInput);
			setContractInput("");
		}
	}, [contractInput, setContractInput]);

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
				<AuditSteps />

				{renderStepContent()}

				{/* Chat container for analysis messages */}
				{messages.length > 0 && activeStep === 2 && (
					<div className="chat-section">
						<h3>Analysis Log</h3>
						<div className="chat-container" ref={chatContainerRef}>
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
										<ReactMarkdown>
											{msg.text}
										</ReactMarkdown>
									</motion.div>
								))}
							</AnimatePresence>
							<div ref={messagesEndRef} />
						</div>
					</div>
				)}

				{/* Success toast message */}
				{showSuccessMessage && (
					<div className="toast-message">
						<Icons.Check /> Action completed successfully
					</div>
				)}
			</div>

			{showFileSelector && (
				<FileSelector
					files={repoFiles}
					onSelectFile={async (file) => {
						try {
							const token = localStorage.getItem(
								"github_access_token"
							);
							const octokit = new Octokit({ auth: token });

							const contentResponse = await octokit.request(
								"GET /repos/{owner}/{repo}/contents/{path}",
								{
									owner: repoOwner,
									repo: repoName,
									path: file.path,
									headers: {
										"X-GitHub-Api-Version": "2022-11-28",
									},
								}
							);

							const fileContent = atob(
								contentResponse.data.content
							);
							setInput(fileContent);
							setShowFileSelector(false);
						} catch (error) {
							console.error(
								"Error fetching file content:",
								error
							);
							alert(`Failed to load file: ${error.message}`);
						}
					}}
					onCancel={() => {
						setShowFileSelector(false);
						setRepoFiles([]);
					}}
					singleFileMode={true}
				/>
			)}
		</div>
	);
}

/* =====================
   MAIN APP
   ===================== */
export default function App() {
	const [currentPage, setCurrentPage] = useState("dashboard");
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [contractInput, setContractInput] = useState("");

	// Check for GitHub callback in URL
	useEffect(() => {
		const path = window.location.pathname;
		if (path === "/github-callback") {
			setCurrentPage("github-callback");
		}
	}, []);

	// // When switching pages, ensure input is set to contractInput
	// useEffect(() => {
	// 	if (currentPage === "audit" && contractInput) {
	// 		setInput(contractInput);
	// 	}
	// }, [currentPage, contractInput]);

	const toggleDrawer = useCallback(() => {
		setDrawerOpen((prev) => !prev);
	}, []);

	const pages = {
		dashboard: <Dashboard setCurrentPage={setCurrentPage} />,
		audit: (
			<Audit
				contractInput={contractInput}
				setContractInput={setContractInput}
			/>
		),
		"github-audit": (
			<GitHubAudit
				setCurrentPage={setCurrentPage}
				setContractInput={setContractInput}
			/>
		),
		"github-callback": (
			<GitHubCallback onSuccess={() => setCurrentPage("github-audit")} />
		),
		library: <SecurityLibrary />,
		history: <History />,
		settings: <Settings />,
	};

	return (
		<div className="app">
			<SideDrawer
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				isOpen={drawerOpen}
				toggleDrawer={toggleDrawer}
			/>
			<main className={`main-content ${drawerOpen ? "drawer-open" : ""}`}>
				{pages[currentPage] || <Dashboard />}
			</main>
		</div>
	);
}
