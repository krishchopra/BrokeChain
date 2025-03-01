import { config } from "@onflow/fcl";

config({
	"accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
	"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
	"discovery.authn.endpoint":
		"https://fcl-discovery.onflow.org/api/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/api/authn"
});
