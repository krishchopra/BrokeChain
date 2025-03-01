export const getAllFiles = async (
	octokit,
	owner,
	repo,
	contents,
	path = ""
) => {
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
