import { useState } from "react";
import { motion } from "framer-motion";

export function FileSelector({ files, onSelectFiles, onCancel }) {
	const [selectedFiles, setSelectedFiles] = useState([]);

	const toggleFileSelection = (file) => {
		if (selectedFiles.some((f) => f.path === file.path)) {
			setSelectedFiles(selectedFiles.filter((f) => f.path !== file.path));
		} else {
			setSelectedFiles([...selectedFiles, file]);
		}
	};

	const handleAnalyze = () => {
		onSelectFiles(selectedFiles);
	};

	return (
		<>
			<div className="file-selector-overlay" onClick={onCancel}></div>
			<motion.div
				className="file-selector"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<div className="file-selector-header">
					<h3>Select Solidity Files to Analyze</h3>
					<div className="file-selector-actions">
						<button className="secondary-button" onClick={onCancel}>
							Cancel
						</button>
						<button
							className="primary-button"
							onClick={handleAnalyze}
							disabled={selectedFiles.length === 0}
						>
							Analyze Selected Files ({selectedFiles.length})
						</button>
					</div>
				</div>

				<div className="file-list">
					{files.length === 0 ? (
						<p className="no-files-message">
							No files found in this repository.
						</p>
					) : (
						files.map((file) => (
							<div
								key={file.path}
								className={`file-item ${
									selectedFiles.some(
										(f) => f.path === file.path
									)
										? "selected"
										: ""
								}`}
								onClick={() => toggleFileSelection(file)}
							>
								<div className="file-checkbox">
									<input
										type="checkbox"
										checked={selectedFiles.some(
											(f) => f.path === file.path
										)}
										onChange={() => {}} // Handled by the div click
									/>
								</div>
								<div className="file-info">
									<span className="file-path">
										{file.path}
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</motion.div>
		</>
	);
}
