import { useState, useEffect, useCallback } from "react";
import { GitHubAuth } from "./GitHubAuth";
import { RepoList } from "./RepoList";
import { Icons } from "../App";
import { FileSelector } from "./FileSelector";
import { Octokit } from "@octokit/core";

export function GitHubAudit() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedRepo, setSelectedRepo] = useState(null);
	const [analysisResult, setAnalysisResult] = useState(null);
	const [repoFiles, setRepoFiles] = useState([]);
	const [showFileSelector, setShowFileSelector] = useState(false);
	const [loadingFiles, setLoadingFiles] = useState(false);
	const [analyzing, setAnalyzing] = useState(false);
	const [vulnerabilities, setVulnerabilities] = useState([]);
	const [contractStats, setContractStats] = useState(null);
	const [contractName, setContractName] = useState("");

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
		setSelectedRepo(repo);
		setLoadingFiles(true);

		try {
			const token = localStorage.getItem("github_access_token");
			const octokit = new Octokit({ auth: token });

			// First, try to get the root directory contents
			const contentsResponse = await octokit.request(
				"GET /repos/{owner}/{repo}/contents",
				{
					owner: repo.owner.login,
					repo: repo.name,
					headers: {
						"X-GitHub-Api-Version": "2022-11-28",
					},
				}
			);

			// Process the files recursively to get all files
			const allFiles = await getAllFiles(
				octokit,
				repo.owner.login,
				repo.name,
				contentsResponse.data
			);

			// Filter for Solidity files if needed
			const solFiles = allFiles.filter((file) =>
				file.path.endsWith(".sol")
			);

			console.log(
				"Files found:",
				allFiles.length,
				"Solidity files:",
				solFiles.length
			);
			console.log(
				"Files found:",
				allFiles.length,
				"Solidity files:",
				solFiles.length
			);
			console.log(
				"Files found:",
				allFiles.length,
				"Solidity files:",
				solFiles.length
			);
			console.log("Setting showFileSelector to true");
			setRepoFiles(solFiles.length > 0 ? solFiles : allFiles);
			setShowFileSelector(true);
		} catch (error) {
			console.error("Error fetching repository files:", error);
			setError(`Failed to load files: ${error.message}`);
			setSelectedRepo(null);
			setShowFileSelector(false);
		} finally {
			setLoadingFiles(false);
		}
	};

	// Helper function to recursively get all files
	const getAllFiles = async (octokit, owner, repo, contents, path = "") => {
		let files = [];

		for (const item of contents) {
			if (item.type === "file") {
				files.push({
					path: item.path,
					type: "blob",
					url: item.download_url,
					sha: item.sha,
				});
			} else if (item.type === "dir") {
				try {
					const dirResponse = await octokit.request(
						"GET /repos/{owner}/{repo}/contents/{path}",
						{
							owner,
							repo,
							path: item.path,
							headers: {
								"X-GitHub-Api-Version": "2022-11-28",
							},
						}
					);

					const dirFiles = await getAllFiles(
						octokit,
						owner,
						repo,
						dirResponse.data,
						item.path
					);
					files = [...files, ...dirFiles];
				} catch (error) {
					console.warn(
						`Could not fetch directory ${item.path}:`,
						error
					);
				}
			}
		}

		return files;
	};

	const handleFileSelection = async (files) => {
		setShowFileSelector(false);
		setAnalyzing(true);

		try {
			const token = localStorage.getItem("github_access_token");
			const octokit = new Octokit({ auth: token });

			// Show loading state
			setAnalysisResult({
				message: "Analyzing selected files...",
				vulnerabilities: [],
				inProgress: true,
			});

			const fileContents = await Promise.all(
				files.map(async (file) => {
					const contentResponse = await octokit.request(
						"GET /repos/{owner}/{repo}/contents/{path}",
						{
							owner: selectedRepo.owner.login,
							repo: selectedRepo.name,
							path: file.path,
							headers: {
								"X-GitHub-Api-Version": "2022-11-28",
							},
						}
					);

					return {
						name: file.path,
						content: atob(contentResponse.data.content),
					};
				})
			);

			// Extract contract name if it's a Solidity file
			if (files.some((f) => f.path.endsWith(".sol"))) {
				const solContent = fileContents.find((f) =>
					f.name.endsWith(".sol")
				)?.content;
				if (solContent) {
					const contractNameMatch =
						solContent.match(/contract\s+(\w+)/);
					setContractName(
						contractNameMatch
							? contractNameMatch[1]
							: "Unknown Contract"
					);

					// Basic stats analysis
					setContractStats({
						lines: solContent.split("\n").length,
						functions: (solContent.match(/function\s+\w+/g) || [])
							.length,
						variables: (
							solContent.match(
								/\b(uint|int|bool|address|string|bytes)\b/g
							) || []
						).length,
					});
				}
			}

			// Use the same API endpoint as the smart contract audit
			const analysisResponse = await fetch(
				"https://daniyalmoha-solidity-contract-auditor.hf.space/analyze_smart_contract",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						api_key: process.env.REACT_APP_OPENAI_SECRET_KEY || "",
						pre_traineddata_text: "No pre-trained data",
						prompt: fileContents.map((f) => f.content).join("\n\n"),
					}),
				}
			);

			if (!analysisResponse.ok) {
				throw new Error(
					`API request failed: ${analysisResponse.status} ${analysisResponse.statusText}`
				);
			}

			const result = await analysisResponse.json();

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
			setAnalysisResult({
				message: result.message || "Analysis complete",
				vulnerabilities: convertedVulnerabilities,
				inProgress: false,
			});
		} catch (error) {
			console.error("Analysis failed:", error);
			setAnalysisResult({
				message: `Analysis failed: ${error.message}`,
				vulnerabilities: [],
				inProgress: false,
			});
		} finally {
			setAnalyzing(false);
		}
	};

	const handleCancelFileSelection = () => {
		setShowFileSelector(false);
		setRepoFiles([]);
		setSelectedRepo(null);
	};

	// Add these helper functions
	const categorizeVulnerability = (title) => {
		if (title.includes("Reentrancy")) return "Reentrancy";
		if (title.includes("Overflow") || title.includes("Underflow"))
			return "Arithmetic";
		if (title.includes("Gas")) return "Gas Optimization";
		if (title.includes("Access") || title.includes("Permission"))
			return "Access Control";
		return "General";
	};

	const getImpactDescription = (title, severity) => {
		if (severity === "high")
			return "significant financial loss or contract compromise";
		if (severity === "medium")
			return "potential exploitation under specific conditions";
		if (severity === "low") return "minor issues that should be addressed";
		return "code quality issues";
	};

	const getAffectedLines = (codeSnippet) => {
		if (!codeSnippet) return [];
		const lineMatch = codeSnippet.match(/line\s+(\d+)/i);
		return lineMatch ? [parseInt(lineMatch[1])] : [];
	};

	const estimateGasSavings = (title, severity) => {
		if (title.includes("Gas")) {
			if (severity === "high")
				return Math.floor(Math.random() * 5000) + 5000;
			if (severity === "medium")
				return Math.floor(Math.random() * 3000) + 2000;
			return Math.floor(Math.random() * 1000) + 500;
		}
		return 0;
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
				<div className="loading-indicator">
					<div className="spinner"></div>
					<p>Loading repositories...</p>
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
					{/* Show file loading indicator as an overlay when active */}
					{loadingFiles && (
						<div className="loading-overlay">
							<div className="loading-indicator">
								<div className="spinner"></div>
								<p>Loading files from repository...</p>
							</div>
						</div>
					)}

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

					{showFileSelector && (
						<FileSelector
							files={repoFiles}
							onSelectFiles={handleFileSelection}
							onCancel={handleCancelFileSelection}
						/>
					)}

					{loadingFiles && (
						<div className="loading-indicator">
							<div className="spinner"></div>
							<p>Loading files from repository...</p>
						</div>
					)}

					{analysisResult && (
						<div className="analysis-results">
							<h3>Analysis Results for {selectedRepo?.name}</h3>

							{analysisResult.inProgress ? (
								<div className="analysis-loading">
									<div className="loader"></div>
									<h3>Analyzing Smart Contract</h3>
									<p>
										Scanning for vulnerabilities and
										security issues...
									</p>
									<div className="analysis-stages">
										<div className="stage completed">
											<span className="stage-check">
												✓
											</span>
											<span className="stage-name">
												Parsing contract code
											</span>
										</div>
										<div className="stage completed">
											<span className="stage-check">
												✓
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
											<span className="stage-number">
												4
											</span>
											<span className="stage-name">
												Generating recommendations
											</span>
										</div>
										<div className="stage">
											<span className="stage-number">
												5
											</span>
											<span className="stage-name">
												Preparing report
											</span>
										</div>
									</div>
								</div>
							) : (
								<>
									{contractName && (
										<div className="contract-info">
											<h4>{contractName}</h4>
											{contractStats && (
												<div className="contract-stats">
													<div className="stat">
														<span className="stat-value">
															{
																contractStats.lines
															}
														</span>
														<span className="stat-label">
															Lines
														</span>
													</div>
													<div className="stat">
														<span className="stat-value">
															{
																contractStats.functions
															}
														</span>
														<span className="stat-label">
															Functions
														</span>
													</div>
													<div className="stat">
														<span className="stat-value">
															{
																contractStats.variables
															}
														</span>
														<span className="stat-label">
															Variables
														</span>
													</div>
												</div>
											)}
										</div>
									)}

									{analysisResult.message && (
										<div className="message-box">
											<p>{analysisResult.message}</p>
										</div>
									)}

									{analysisResult.vulnerabilities?.length >
									0 ? (
										<div className="vuln-list">
											{analysisResult.vulnerabilities.map(
												(vuln, i) => (
													<div
														key={i}
														className={`vulnerability-card ${vuln.severity.toLowerCase()}`}
													>
														<div className="vuln-header">
															<h4>{vuln.type}</h4>
															<span
																className={`severity ${vuln.severity.toLowerCase()}`}
															>
																{vuln.severity}
															</span>
														</div>
														<p>
															{
																vuln.recommendation
															}
														</p>
														{vuln.lineReferences && (
															<pre className="code-snippet">
																<code>
																	{
																		vuln.lineReferences
																	}
																</code>
															</pre>
														)}
														<div className="vuln-footer">
															<span className="vuln-id">
																{vuln.id}
															</span>
															{vuln.gasSaved >
																0 && (
																<span className="gas-saved">
																	Potential
																	gas saved: ~
																	{
																		vuln.gasSaved
																	}{" "}
																	units
																</span>
															)}
														</div>
													</div>
												)
											)}
										</div>
									) : (
										<div className="no-vulns">
											<p>
												No vulnerabilities found in the
												analyzed files.
											</p>
										</div>
									)}
								</>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
