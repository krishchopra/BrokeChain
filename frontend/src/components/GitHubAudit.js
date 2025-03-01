import { useState, useEffect, useCallback } from "react";
import { GitHubAuth } from "./GitHubAuth";
import { RepoList } from "./RepoList";
import { Icons } from "../App";
import { FileSelector } from "./FileSelector";
import { Octokit } from "@octokit/core";

export function GitHubAudit({ setCurrentPage, setContractInput }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedRepo, setSelectedRepo] = useState(null);
	const [repoFiles, setRepoFiles] = useState([]);
	const [showFileSelector, setShowFileSelector] = useState(false);
	const [loadingFiles, setLoadingFiles] = useState(false);

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

	// Recursive function to get all files in a repository
	const getAllFiles = async (octokit, owner, repo, contents, path = "") => {
		let allFiles = [];

		for (const item of contents) {
			if (item.type === "file") {
				allFiles.push(item);
			} else if (item.type === "dir") {
				const dirContents = await octokit.request(
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
				const filesInDir = await getAllFiles(
					octokit,
					owner,
					repo,
					dirContents.data,
					item.path
				);
				allFiles = [...allFiles, ...filesInDir];
			}
		}

		return allFiles;
	};

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

	const handleFileSelection = async (file) => {
		setShowFileSelector(false);

		try {
			console.log("Selected file for analysis:", file);
			const token = localStorage.getItem("github_access_token");
			const octokit = new Octokit({ auth: token });

			// Fetch the content of the selected file
			console.log("Fetching content for file:", file.path);
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

			// Decode the content
			const fileContent = atob(contentResponse.data.content);
			console.log("File content fetched, length:", fileContent.length);

			// Set the content in the Smart Contract Audit component
			setContractInput(fileContent);

			// Navigate to the Smart Contract Audit page
			setCurrentPage("audit");

			// Show a success message
			// alert(
			// 	`File "${file.path}" loaded into Smart Contract Audit. You can now analyze it there.`
			// );
		} catch (error) {
			console.error("Error fetching file content:", error);
			alert(`Failed to load file: ${error.message}`);
		}
	};

	const handleCancelFileSelection = () => {
		setShowFileSelector(false);
		setRepoFiles([]);
		setSelectedRepo(null);
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
							onSelectFile={handleFileSelection}
							onCancel={handleCancelFileSelection}
							singleFileMode={true}
						/>
					)}
				</>
			)}
		</div>
	);
}
