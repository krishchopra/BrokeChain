import { useState, useEffect, useCallback } from "react";
import { GitHubAuth } from "./GitHubAuth";
import { RepoList } from "./RepoList";
import { Icons } from "../App";

export function GitHubAudit() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedRepo, setSelectedRepo] = useState(null);
	const [analyzing, setAnalyzing] = useState(false);
	const [analysisResult, setAnalysisResult] = useState(null);

	// Wrap fetchRepositories with useCallback to prevent infinite loops
	const fetchRepositories = useCallback(async (token) => {
		try {
			setLoading(true);
			setError(null);

			console.log(
				"Fetching repositories with token:",
				token ? "Token exists" : "No token"
			);

			const response = await fetch(
				"https://api.github.com/user/repos?sort=updated",
				{
					headers: {
						Authorization: `token ${token}`,
					},
				}
			);

			console.log("GitHub API response:", response);

			if (!response.ok) {
				throw new Error(
					`GitHub API error: ${response.status} ${response.statusText}`
				);
			}

			const repos = await response.json();
			console.log("Fetched repositories:", repos);

			// Show all repositories for now
			setRepositories(repos);
		} catch (error) {
			console.error("Error fetching repositories:", error);
			setError(`Failed to load repositories: ${error.message}`);

			// If unauthorized, clear token and reset auth state
			if (error.message.includes("401")) {
				handleLogout();
			}
		} finally {
			setLoading(false);
		}
	}, []);

	// Check for token on component mount
	useEffect(() => {
		const token = localStorage.getItem("github_access_token");
		if (token) {
			setIsAuthenticated(true);
			fetchRepositories(token);
		}
	}, [fetchRepositories]);

	const handleLogout = () => {
		localStorage.removeItem("github_access_token");
		setIsAuthenticated(false);
		setRepositories([]);
	};

	const handleSelectRepo = async (repo) => {
		try {
			setSelectedRepo(repo);
			setAnalyzing(true);
			setAnalysisResult(null);

			const token = localStorage.getItem("github_access_token");

			// First, get all files in the repository
			const treeResponse = await fetch(
				`https://api.github.com/repos/${repo.owner.login}/${repo.name}/git/trees/main?recursive=1`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			let treeData;

			if (!treeResponse.ok && treeResponse.status === 404) {
				// Try with master branch if main doesn't exist
				const masterResponse = await fetch(
					`https://api.github.com/repos/${repo.owner.login}/${repo.name}/git/trees/master?recursive=1`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!masterResponse.ok) {
					throw new Error(
						`GitHub API error: ${masterResponse.statusText}`
					);
				}

				treeData = await masterResponse.json();
			} else if (!treeResponse.ok) {
				throw new Error(`GitHub API error: ${treeResponse.statusText}`);
			} else {
				treeData = await treeResponse.json();
			}

			// Filter for Solidity files
			const solidityFiles = treeData.tree.filter(
				(file) => file.path.endsWith(".sol") && file.type === "blob"
			);

			if (solidityFiles.length === 0) {
				setAnalysisResult({
					vulnerabilities: [],
					message: "No Solidity files found in this repository",
				});
				setAnalyzing(false);
				return;
			}

			// Get content of each Solidity file
			const fileContents = await Promise.all(
				solidityFiles.map(async (file) => {
					const contentResponse = await fetch(
						`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${file.path}`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (!contentResponse.ok) {
						console.error(`Failed to fetch ${file.path}`);
						return null;
					}

					const content = await contentResponse.json();
					return {
						name: file.path,
						content: atob(content.content),
					};
				})
			);

			// Filter out any null results
			const validFiles = fileContents.filter((file) => file !== null);

			if (validFiles.length === 0) {
				setAnalysisResult({
					vulnerabilities: [],
					message:
						"Could not read any Solidity files in this repository",
				});
				setAnalyzing(false);
				return;
			}

			// Combine all files into one prompt
			const combinedCode = validFiles
				.map((file) => `File: ${file.name}\n\n${file.content}`)
				.join("\n\n");

			// Send to your analysis endpoint
			const analysisResponse = await fetch("/analyze_smart_contract", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					api_key: "your-api-key", // You should handle this securely
					pre_traineddata_text:
						"Analyze the following Solidity files from a GitHub repository",
					prompt: combinedCode,
				}),
			});

			if (!analysisResponse.ok) {
				throw new Error(
					`Analysis error: ${analysisResponse.statusText}`
				);
			}

			const analysisData = await analysisResponse.json();
			setAnalysisResult(analysisData);
		} catch (error) {
			console.error("Error analyzing repository:", error);
			setAnalysisResult({
				vulnerabilities: [],
				message: `Error: ${error.message}`,
			});
		} finally {
			setAnalyzing(false);
		}
	};

	return (
		<div className="page-content github-audit-page">
			<div className="page-header">
				<h2>GitHub Repository Audit</h2>
				{isAuthenticated && (
					<div className="header-actions">
						<button
							className="secondary-button"
							onClick={handleLogout}
						>
							<Icons.GitHub />
							<span>Switch Account</span>
						</button>
					</div>
				)}
			</div>

			{!isAuthenticated ? (
				<GitHubAuth />
			) : loading ? (
				<div className="loading-state">
					<div className="loading-spinner"></div>
					<span>Loading repositories...</span>
				</div>
			) : error ? (
				<div className="error-message">
					<p>{error}</p>
					<button
						className="primary-button"
						onClick={() =>
							fetchRepositories(
								localStorage.getItem("github_access_token")
							)
						}
					>
						Try Again
					</button>
				</div>
			) : (
				<>
					{repositories.length === 0 ? (
						<div className="no-repos-message">
							<p>
								No repositories found. Make sure your GitHub
								account has repositories.
							</p>
						</div>
					) : (
						<RepoList
							repositories={repositories}
							onSelectRepo={handleSelectRepo}
						/>
					)}

					{analyzing && (
						<div className="overlay">
							<div className="loading-spinner"></div>
							<p>Analyzing repository: {selectedRepo?.name}</p>
						</div>
					)}

					{analysisResult && (
						<div className="analysis-results">
							<h3>Analysis Results for {selectedRepo?.name}</h3>

							{analysisResult.message && (
								<div className="message-box">
									<p>{analysisResult.message}</p>
								</div>
							)}

							{analysisResult.vulnerabilities?.length > 0 ? (
								<div className="vuln-list">
									{analysisResult.vulnerabilities.map(
										(vuln, i) => (
											<div
												key={i}
												className={`vulnerability-card ${vuln.severity}`}
											>
												<div className="vuln-header">
													<h4>{vuln.title}</h4>
													<span
														className={`severity ${vuln.severity}`}
													>
														{vuln.severity}
													</span>
												</div>
												<p>{vuln.description}</p>
												<pre className="code-snippet">
													<code>
														{vuln.codeSnippet}
													</code>
												</pre>
											</div>
										)
									)}
								</div>
							) : (
								!analysisResult.message && (
									<p className="no-vulns">
										No vulnerabilities found!
									</p>
								)
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
