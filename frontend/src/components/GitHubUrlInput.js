import { useState } from "react";

export default function GitHubUrlInput({ onFetchRepository, repoFetched }) {
	const [githubUrl, setGithubUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
			const match = githubUrl.match(urlPattern);

			if (!match) {
				throw new Error(
					"Invalid GitHub URL. Please enter a valid repository URL."
				);
			}

			const [, owner, repo] = match;

			// Call the parent function with owner and repo
			await onFetchRepository(owner, repo);
		} catch (error) {
			console.error("Error parsing GitHub URL:", error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="github-url-input">
			<div className="input-group">
				<input
					type="text"
					value={githubUrl}
					onChange={(e) => setGithubUrl(e.target.value)}
					placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
					className="github-url-field"
				/>
				<button
					type="button"
					className="primary-button"
					onClick={handleSubmit}
					disabled={isLoading || !githubUrl.trim()}
				>
					{isLoading ? (
						<div className="spinner"></div>
					) : (
						"Fetch Repository"
					)}
				</button>
			</div>

			{error && <div className="error-message">{error}</div>}
		</div>
	);
}
