import React, { useState, useEffect, useRef } from "react";
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
};

/* =====================
   NAV ITEMS
   ===================== */
const navItems = [
	{ id: "home", label: "Home", icon: <Icons.Home /> },
	{ id: "audit", label: "Audit", icon: <Icons.Audit /> },
	{ id: "history", label: "History", icon: <Icons.History /> },
	{ id: "settings", label: "Settings", icon: <Icons.Settings /> },
];

/* =====================
   SIDE DRAWER
   ===================== */
function SideDrawer({ currentPage, setCurrentPage }) {
	return (
		<aside className="side-drawer open">
			<nav>
				{navItems.map((item) => (
					<button
						key={item.id}
						className={currentPage === item.id ? "active" : ""}
						onClick={() => setCurrentPage(item.id)}
					>
						{item.icon}
						<span>{item.label}</span>
					</button>
				))}
			</nav>
			{/* <div className="drawer-footer">
        <p className="version-tag">Version 1.0</p>
      </div> */}
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
				/>
				<text
					x="50%"
					y="54%"
					textAnchor="middle"
					className="gauge-text"
				>
					{score}%
				</text>
			</svg>
			<p>Confidence Score</p>
		</div>
	);
}

/* =====================
   VULNERABILITY CARD
   ===================== */
function VulnerabilityCard({ vuln, index }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="vuln-card">
			<div className="vuln-header">
				<h3>
					{index + 1}. {vuln.type}
				</h3>
				<span
					className={`severity-badge ${vuln.severity.toLowerCase()}`}
				>
					{vuln.severity}
				</span>
			</div>
			<div className="vuln-content">
				<strong>Recommendation:</strong> {vuln.recommendation}
			</div>
			{vuln.lineReferences && (
				<button
					className="expand-btn"
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? "Hide Code Snippet" : "View Code Snippet"}
				</button>
			)}
			{expanded && vuln.lineReferences && (
				<pre className="code-snippet">
					<code>{vuln.lineReferences}</code>
				</pre>
			)}
		</div>
	);
}

/* =====================
   AUTO-FIX
   ===================== */
function AutoFixSuggestion({ fixCode }) {
	if (!fixCode) return null;
	return (
		<div className="auto-fix">
			<h3>AI Auto-Fix Suggestion</h3>
			<pre className="code-snippet">
				<code>{fixCode}</code>
			</pre>
		</div>
	);
}

/* =====================
   HOME PAGE
   ===================== */
function Home() {
	return (
		<div className="page-content home-page">
			<h2>Welcome to the BrokeChain Auditor!</h2>
			<div className="mt-10">
				<p>
					This tool analyzes Solidity code or GitHub repos for
					vulnerabilities, giving you a confidence score and
					recommended fixes.
				</p>
			</div>
			<div className="mt-5">
				<p>Use the side navigation to get started!</p>
			</div>
		</div>
	);
}

/* =====================
   HISTORY
   ===================== */
function History() {
	const mockHistory = [
		{ id: 1, date: "2025-02-28", codeSnippet: "contract MyToken {...}" },
		{
			id: 2,
			date: "2025-02-27",
			codeSnippet: "contract AnotherContract {...}",
		},
	];

	return (
		<div className="page-content history-page">
			<h2>Past Audits</h2>
			{mockHistory.map((item) => (
				<div key={item.id} className="history-item vuln-card">
					<p>
						<strong>Date:</strong> {item.date}
					</p>
					<pre className="code-snippet">
						<code>{item.codeSnippet}</code>
					</pre>
					<hr />
				</div>
			))}
		</div>
	);
}

/* =====================
   SETTINGS
   ===================== */
function SettingsOption({ label, description, defaultChecked }) {
	return (
		<div className="settings-option">
			<label className="toggle-switch">
				<input type="checkbox" defaultChecked={defaultChecked} />
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
	return (
		<div className="page-content settings-page">
			<h2>Settings</h2>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="settings-section"
			>
				<h3>Display Settings</h3>
				<div className="settings-options">
					<SettingsOption
						label="Enable Dark Mode"
						description="Toggle between light and dark interface"
						defaultChecked={false}
					/>
					<SettingsOption
						label="Animations"
						description="Enable UI animations"
						defaultChecked
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
						label="Auto-Fix Generation"
						description="Automatically generate fix suggestions"
						defaultChecked
					/>
					<SettingsOption
						label="Extended Analysis"
						description="Use slower but more comprehensive tools"
						defaultChecked
					/>
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

	const formatReport = (report) => {
		if (!report?.vulnerabilities?.length) {
			return "# No vulnerabilities found.\nEverything looks good!";
		}
		let md = "# Vulnerability Report\n\n";
		report.vulnerabilities.forEach((vuln, i) => {
			md += `## ${i + 1}. ${vuln.type}\n`;
			md += `**Severity:** ${vuln.severity}\n\n`;
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

	// *********************
	// REAL API CALL HERE
	// *********************
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		// Add user message
		setMessages((prev) => [...prev, { sender: "user", text: input }]);
		setLoading(true);

		try {
			const apiKey = process.env.REACT_APP_OPENAI_SECRET_KEY;
			console.log(apiKey);
			const preTrainedDataText = "No pre-trained data";
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
				throw new Error("API request failed.");
			}

			const result = await response.json();

			console.log(result);
			const convertedVulnerabilities = (result.vulnerabilities || []).map(
				(vuln) => ({
					type: vuln.title,
					severity:
						vuln.severity.charAt(0).toUpperCase() +
						vuln.severity.slice(1),
					recommendation: vuln.description,
					lineReferences: vuln.codeSnippet,
				})
			);

			setVulnerabilities(convertedVulnerabilities);

			// Hard-coding a confidence score (or you can derive from the result if available)
			setConfidenceScore(80);

			// If your API doesn't return auto-fix, leave it empty
			setAutoFixCode("");

			// Build a final "report-like" text for chat
			const finalReport = {
				vulnerabilities: convertedVulnerabilities,
			};
			const finalText = formatReport(finalReport);

			// Add a "bot" message and start typed effect
			setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
			startTyping(finalText);
		} catch (err) {
			console.error(err);
			setMessages((prev) => [
				...prev,
				{ sender: "bot", text: "Error analyzing input." },
			]);
		}

		setLoading(false);
		setInput("");
	};

	const exportPDF = () => {
		alert("PDF Export Coming Soon!");
	};

	const clearChat = () => {
		setMessages([]);
		setVulnerabilities([]);
		setTypingMessage("");
		setConfidenceScore(0);
		setAutoFixCode("");
	};

	return (
		<div className="page-content audit-page">
			<h2>Audit</h2>

			{confidenceScore > 0 && <ConfidenceGauge score={confidenceScore} />}

			{vulnerabilities.length > 0 && (
				<div className="summary-bar">
					<p>
						<strong>{vulnerabilities.length}</strong>{" "}
						Vulnerabilities Detected
					</p>
					<div className="severity-list">
						{vulnerabilities.map((vuln, i) => (
							<span
								key={i}
								className={`severity-tag ${vuln.severity.toLowerCase()}`}
							>
								{vuln.severity}
							</span>
						))}
					</div>
				</div>
			)}

			<div className="chat-container">
				{loading && (
					<div className="overlay">
						<div className="loader"></div>
						<p>Analyzing...</p>
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
			</div>

			{vulnerabilities.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="vuln-list"
				>
					{vulnerabilities.map((vuln, i) => (
						<VulnerabilityCard vuln={vuln} index={i} key={i} />
					))}
				</motion.div>
			)}

			<AutoFixSuggestion fixCode={autoFixCode} />

			<div className="top-row">
				{vulnerabilities.length > 0 && (
					<button className="pdf-btn btn" onClick={exportPDF}>
						<Icons.Download /> Download PDF
					</button>
				)}
				{messages.length > 0 && (
					<button className="clear-btn btn" onClick={clearChat}>
						<Icons.Clear /> Clear Chat
					</button>
				)}
			</div>

			<form onSubmit={handleSubmit} className="input-form">
				<div className="input-options">
					<label>
						<input
							type="radio"
							value="solidity"
							checked={analysisType === "solidity"}
							onChange={() => setAnalysisType("solidity")}
						/>
						Solidity Code
					</label>
					<label>
						<input
							type="radio"
							value="github"
							checked={analysisType === "github"}
							onChange={() => setAnalysisType("github")}
						/>
						GitHub URL
					</label>
				</div>

				<textarea
					placeholder={
						analysisType === "solidity"
							? "Paste Solidity code here..."
							: "Enter GitHub repository URL..."
					}
					rows="6"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>

				<div className="button-row">
					<button
						type="submit"
						className="fab-btn"
						disabled={loading}
					>
						<Icons.Send /> Analyze
					</button>
				</div>
			</form>
		</div>
	);
}

/* =====================
   MAIN APP
   ===================== */
export default function App() {
	const [currentPage, setCurrentPage] = useState("home");

	const pages = {
		home: <Home />,
		audit: <Audit />,
		history: <History />,
		settings: <Settings />,
	};

	return (
		<div className="app-layout">
			<SideDrawer
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<div className="main-container drawer-open">
				{pages[currentPage] || <Home />}
			</div>
		</div>
	);
}
