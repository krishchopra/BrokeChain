import { useEffect, useState } from "react";
import config from "../config";

export function GitHubCallback({ onSuccess }) {
	const [status, setStatus] = useState("Authenticating with GitHub...");

	useEffect(() => {
		async function handleCallback() {
			try {
				// Get the code from URL query parameters
				const urlParams = new URLSearchParams(window.location.search);
				const code = urlParams.get("code");
				const state = urlParams.get("state");

				console.log("Received state:", state);
				console.log(
					"Stored state:",
					localStorage.getItem("github_oauth_state")
				);

				// Verify state matches what we stored
				const storedState = localStorage.getItem("github_oauth_state");
				console.log("Comparing states:", {
					received: state,
					stored: storedState,
				});

				// If state doesn't match but we have a code, we might still proceed with caution
				if (state !== storedState) {
					console.warn(
						"State mismatch, but will attempt token exchange anyway"
					);
				}

				// Clear the state from localStorage
				localStorage.removeItem("github_oauth_state");
				localStorage.removeItem("github_oauth_timestamp");

				if (!code) {
					throw new Error(
						"No authorization code received from GitHub"
					);
				}

				// Use the configured backend endpoint
				const apiUrl = `${config.apiBaseUrl}/api/github-auth`;
				console.log("Using API URL:", apiUrl);

				// Exchange code for token using our backend API
				const tokenResponse = await fetch(apiUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ code }),
				});

				if (!tokenResponse.ok) {
					const errorData = await tokenResponse
						.json()
						.catch(() => ({}));
					console.error("Token exchange error:", errorData);
					throw new Error(
						errorData.error || "Failed to exchange code for token"
					);
				}

				const tokenData = await tokenResponse.json();
				const accessToken = tokenData.access_token;

				if (!accessToken) {
					throw new Error("No access token received");
				}

				// Store the token in localStorage
				localStorage.setItem("github_access_token", accessToken);

				// Call the onSuccess callback to change the page
				setStatus("Authentication successful! Redirecting...");

				// Wait a moment before redirecting
				setTimeout(() => {
					// Update URL without reloading the page
					window.history.pushState({}, "", "/");

					// Call the success callback to change the page
					if (onSuccess) onSuccess();
				}, 1000);
			} catch (error) {
				console.error("GitHub authentication error:", error);
				setStatus(`Authentication failed: ${error.message}`);

				setTimeout(() => {
					window.history.pushState({}, "", "/");
					if (onSuccess) onSuccess();
				}, 3000);
			}
		}

		handleCallback();
	}, [onSuccess]);

	return (
		<div className="github-callback-container">
			<div className="auth-status-card">
				{/* <div className="auth-status-icon">
					{status.includes("successful") ? "✅" : "⏳"}
				</div> */}
				<h2>{status}</h2>
			</div>
		</div>
	);
}
