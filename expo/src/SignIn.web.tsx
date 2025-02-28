import { Button } from "react-native";
import React, { useEffect } from "react";

interface SignInProps {
	onSignIn: (idToken: string) => void;
}

declare global {
	interface Window {
		google: any;
	}
}

export default function SignIn({ onSignIn }: SignInProps) {
	useEffect(() => {
		// Load Google SDK
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, []);

	const handleGoogleLogin = async () => {
		try {
			const client = window.google.accounts.oauth2.initTokenClient({
				client_id: process.env.GOOGLE_WEB_CLIENT_ID,
				scope: "profile email",
				callback: (response: any) => {
					if (response.access_token) {
						onSignIn(response.access_token);
					}
				},
			});
			client.requestAccessToken();
		} catch (error) {
			console.error("Google Sign In Error:", error);
		}
	};

	return <Button title="Sign in with Google" onPress={handleGoogleLogin} />;
}
