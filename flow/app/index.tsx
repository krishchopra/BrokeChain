// Ensure a global "window" object is available
if (typeof global.window === "undefined") {
	global.window = global as any;
}
if (typeof window.addEventListener !== "function") {
	window.addEventListener = () => {};
}

// Minimal polyfill for "document"
if (typeof global.document === "undefined") {
	global.document = {
		addEventListener: () => {},
		removeEventListener: () => {},
		querySelector: () => null,
		createElement: () => ({ style: {} }),
		getElementById: () => undefined,
		append: () => {},
		body: {
			append: () => {},
		},
	} as any;
}

import { Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { WebView } from "react-native-webview";

import { config } from "@onflow/fcl";

config({
	"flow.network": "testnet",
	"accessNode.api": "https://rest-testnet.onflow.org", // Testnet access node
	"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet discovery
	"discovery.authn.endpoint":
		"https://fcl-discovery.onflow.org/api/testnet/authn", // Testnet auth endpoint
	// WalletConnect configuration
	"walletConnect.projectId": "41fa15946654989c5668063354df0ac8",
	"services.walletConnect": {
		projectId: "41fa15946654989c5668063354df0ac8",
		relayUrl: "wss://relay.walletconnect.com",
		transport: "react-native-web-browser",
	},
	"app.detail.title": "BrokeChain",
	"app.detail.icon": "https://placekitten.com/g/200/200",
	"app.detail.description":
		"No more broken promises—just blockchain-backed, shared payments",
	"app.detail.url": "https://brokechain.app",
});

interface User {
	loggedIn: boolean | null;
	addr?: string;
}

export default function Index() {
	const [user, setUser] = useState<User>({ loggedIn: null });

	useEffect((): (() => void) => {
		return fcl.currentUser.subscribe(setUser) as () => void;
	}, []);

	const AuthedState = () => {
		return (
			<View>
				<Text>Address: {user?.addr ?? "No Address"}</Text>
				<Button onPress={fcl.unauthenticate} title="Log Out" />
			</View>
		);
	};

	if (user.loggedIn) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#fff",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text>
					BrokeChain - No more broken promises! - You are logged in
				</Text>
				<AuthedState />
				<StatusBar style="auto" />
			</View>
		);
	}

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#fff",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text>BrokeChain - No more broken promises!</Text>
			<Button onPress={fcl.authenticate} title="Log In" />
			<StatusBar style="auto" />
		</View>
	);
}
