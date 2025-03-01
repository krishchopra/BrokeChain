import { useState } from "react";
import { motion } from "framer-motion";

export function FileSelector({
	files,
	onSelectFile,
	onCancel,
	singleFileMode = false,
}) {
	const [selectedFile, setSelectedFile] = useState(null);

	const handleFileClick = (file) => {
		setSelectedFile(file);
	};

	const handleAnalyze = () => {
		onSelectFile(selectedFile);
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
					<h3>Select a File to Analyze</h3>
					<div className="file-selector-actions">
						<button className="secondary-button" onClick={onCancel}>
							Cancel
						</button>
						<button
							className="primary-button"
							onClick={handleAnalyze}
							disabled={!selectedFile}
						>
							Analyze Selected File
						</button>
					</div>
				</div>
				<div className="file-list">
					{files.length === 0 ? (
						<p className="no-files">
							No files found in this repository.
						</p>
					) : (
						files.map((file, index) => (
							<div
								key={index}
								className={`file-item ${
									selectedFile === file ? "selected" : ""
								}`}
								onClick={() => handleFileClick(file)}
							>
								{/* <div className="file-icon">
									{file.path.endsWith(".sol") ? "⚙️" : "📄"}
								</div> */}
								<div className="file-details">
									<div className="file-name">{file.name}</div>
									<div className="file-path">{file.path}</div>
								</div>
							</div>
						))
					)}
				</div>
			</motion.div>
		</>
	);
}
