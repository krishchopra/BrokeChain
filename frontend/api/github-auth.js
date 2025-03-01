export default async function handler(req, res) {
	// Enable CORS
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
	);

	// Handle OPTIONS request for CORS preflight
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	// Only allow POST requests
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ error: "Missing code parameter" });
	}

	try {
		const response = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code,
				}),
			}
		);

		const data = await response.json();

		// Log the response for debugging
		console.log("GitHub OAuth response:", data);

		if (data.error) {
			return res.status(400).json({
				error: `GitHub OAuth error: ${
					data.error_description || data.error
				}`,
			});
		}

		return res.status(200).json(data);
	} catch (error) {
		console.error("Error exchanging code for token:", error);
		return res.status(500).json({
			error: `Failed to exchange code for token: ${error.message}`,
		});
	}
}
