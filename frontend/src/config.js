// Configuration for API URLs based on environment
const config = {
	apiBaseUrl:
		process.env.NODE_ENV === "production"
			? "https://brokechain.onrender.com"
			: "http://localhost:3001",

	// GitHub OAuth settings
	githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
	githubRedirectUri:
		process.env.NODE_ENV === "production"
			? "https://brokechain.vercel.app/github-callback"
			: "http://localhost:3000/github-callback",
};

export default config;
