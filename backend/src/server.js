const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

// Parse JSON request bodies
app.use(express.json());

// GitHub OAuth endpoint
app.post("/api/github-auth", async (req, res) => {
	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ error: "Missing code parameter" });
	}

	try {
		const response = await axios.post(
			"https://github.com/login/oauth/access_token",
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}
		);

		const data = response.data;

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
});

// Start the server
app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
