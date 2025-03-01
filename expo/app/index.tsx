import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Animated,
	Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { OktoClient } from "@okto_web3/core-js-sdk";
import type { Hash, Hex } from "@okto_web3/core-js-sdk/dist/types";
import config from "./constants/config";
import { Buffer } from "buffer";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { authenticate } from "../services/authService";

global.Buffer = Buffer;
WebBrowser.maybeCompleteAuthSession();

// Initialize Okto client outside the component
const oktoClient = new OktoClient({
	environment: config.environment,
	clientPrivateKey: config.clientPrivateKey as Hash,
	clientSWA: config.clientSWA as Hex,
});

export default function Index() {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<any>(null);

	const [request, response, promptAsync] = useAuthRequest({
		clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
		scopes: ["openid", "profile", "email"],
		responseType: "id_token",
		iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
		redirectUri: makeRedirectUri({
			scheme: "brokechain",
		}),
	});

	// Color animation for neon effect
	const colorAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Reset any previous animations
		colorAnim.setValue(0);

		// Loop from 0 to 1 continuously for a seamless color cycle
		Animated.loop(
			Animated.timing(colorAnim, {
				toValue: 1,
				duration: 6000,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();

		// Cleanup function to stop animation
		return () => {
			colorAnim.stopAnimation();
		};
	}, []);

	useEffect(() => {
		handleSignInResponse();
	}, [response]);

	const handleSignInResponse = async () => {
		if (response?.type === "success") {
			try {
				const { id_token } = response.params; // Google returns id_token directly
				const user = await authenticate(id_token, oktoClient);
				console.log("Login successful:", user);
				setUserInfo(user);
				router.push("/Dashboard");
			} catch (error) {
				console.error("Login failed:", error);
			}
		}
	};

	// Create a rainbow neon cycle for the text and button border.
	// 0 and 1 are the same color for a smooth loop.
	const neonColor = colorAnim.interpolate({
		inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
		outputRange: [
			"#ff0080", // Pinkish
			"#8000ff", // Purple
			"#00c8ff", // Light Blue
			"#00ff6a", // Neon Green
			"#ffff00", // Bright Yellow
			"#ff0080", // Back to Pinkish
		],
	});

	return (
		<View style={styles.container}>
			{/* Title with color-cycling text & static glow */}
			<Animated.Text
				style={[
					styles.title,
					{
						color: neonColor,
						// Removed animated textShadowColor; using static value from styles.title
					},
				]}
			>
				BrokeChain
			</Animated.Text>

			<Text style={styles.subtitle}>
				Manage group expenses in stablecoins
			</Text>

			{/* Button with color-cycling border and text */}
			<TouchableOpacity
				style={[
					styles.button,
					{
						borderColor: neonColor as unknown as string,
					},
				]}
				onPress={() => promptAsync()}
				disabled={!request}
			>
				<Animated.Text
					style={[
						styles.buttonText,
						{
							color: neonColor,
							// Removed animated textShadowColor; using static value from styles.buttonText
						},
					]}
				>
					Sign in with Google
				</Animated.Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000", // Pure black background
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 48,
		fontWeight: "900",
		textAlign: "center",
		// Static neon glow
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 20,
		marginBottom: 16,
	},
	subtitle: {
		fontSize: 18,
		color: "#999",
		textAlign: "center",
		marginBottom: 40,
		paddingHorizontal: 30,
	},
	button: {
		borderWidth: 2,
		borderRadius: 12,
		paddingVertical: 14,
		paddingHorizontal: 30,
		// Additional glow for the border
		shadowColor: "#fff",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.2,
		shadowRadius: 15,
		elevation: 10,
	},
	buttonText: {
		fontSize: 18,
		fontWeight: "700",
		// Static text shadow for legibility
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 10,
	},
});
