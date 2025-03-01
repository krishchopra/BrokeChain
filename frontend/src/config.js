// Configuration for API URLs based on environment
const config = {
	apiBaseUrl:
		process.env.NODE_ENV === "production"
			? "https://your-backend-domain.onrender.com" // Replace with your Render domain
			: "http://localhost:3001",

	// GitHub OAuth settings
	githubClientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
	githubRedirectUri:
		process.env.NODE_ENV === "production"
			? "https://your-frontend-domain.vercel.app/github-callback" // Replace with your Vercel domain
			: "http://localhost:3000/github-callback",
};

export default config;
