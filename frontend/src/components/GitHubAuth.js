import { motion } from "framer-motion";
import { Icons } from "../App";
import { useState } from "react";
import config from "../config";

export function GitHubAuth() {
	const [isLoading, setIsLoading] = useState(false);

	const handleGitHubLogin = () => {
		setIsLoading(true);

		// Generate a random state value for security
		const state = Math.random().toString(36).substring(2, 15);

		// Store the state in localStorage
		localStorage.setItem("github_oauth_state", state);
		console.log("Setting state before redirect:", state);

		// Add a timestamp to detect if this was too long ago
		localStorage.setItem("github_oauth_timestamp", Date.now());

		// GitHub OAuth parameters
		const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
		const redirectUri = encodeURIComponent(config.githubRedirectUri);
		const scope = encodeURIComponent(
			"repo:status repo:read user:read repo"
		);

		// Redirect to GitHub's OAuth authorization URL
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
	};

	return (
		<motion.div
			className="github-auth-container"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="github-auth-content">
				<Icons.GitHub />
				<h3>
					Connect with GitHub - analyze security across your
					repositories!
				</h3>
				<button
					className="github-auth-btn mt-2"
					onClick={handleGitHubLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="loading-spinner"></span>
					) : (
						<>
							<Icons.GitHub />
							<span>Login with GitHub</span>
						</>
					)}
				</button>
			</div>
		</motion.div>
	);
}
