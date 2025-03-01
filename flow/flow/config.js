import { config } from "@onflow/fcl";

config({
	"flow.network": "testnet",
	"accessNode.api": "https://rest-testnet.onflow.org", // Testnet access node
	"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet discovery
	"discovery.authn.endpoint":
		"https://fcl-discovery.onflow.org/api/testnet/authn", // Testnet auth endpoint

	// WalletConnect configuration: Register your project ID here
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

	// Remove deprecated keys like "env"
});
