import { motion } from "framer-motion";
import { Icons } from "../App";

export function RepoList({ repositories, onSelectRepo }) {
	return (
		<motion.div
			className="repo-list"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{repositories.map((repo) => (
				<motion.div
					key={repo.id}
					className="repo-item"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ y: -5 }}
				>
					<div className="repo-info">
						<h4>{repo.name}</h4>
						<p>{repo.description}</p>
					</div>
					<div className="repo-meta">
						<span className="repo-language">{repo.language}</span>
						<button
							className="analyze-btn"
							onClick={() => onSelectRepo(repo)}
						>
							<Icons.Audit />
							<span>Analyze</span>
						</button>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}
