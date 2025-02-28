// expo/app/services/authService.ts
import { OktoClient } from "@okto_web3/core-js-sdk";
import type { Hash, Hex } from "@okto_web3/core-js-sdk/dist/types";

/**
 * Authenticate the user using Okto OAuth with Google.
 */
export async function authenticate(idToken: string, oktoClient: OktoClient) {
	try {
		const user = await oktoClient.loginUsingOAuth({
			idToken,
			provider: "google",
		});
		console.log("Authentication successful:", user);
		return user;
	} catch (error) {
		console.error("Authentication failed:", error);
		throw error;
	}
}

/**
 * Verify if the user is already logged in.
 */
export async function checkLoginStatus(oktoClient: OktoClient) {
	try {
		const isLoggedIn = await oktoClient.verifyLogin();
		console.log("Login status:", isLoggedIn);
		return isLoggedIn;
	} catch (error) {
		console.error("Verification failed:", error);
		return false;
	}
}

/**
 * Sign a blockchain operation using the user's session key.
 */
export async function signOperation(userOp: any, oktoClient: OktoClient) {
	try {
		const signedOp = await oktoClient.signUserOp(userOp);
		console.log("Signed operation:", signedOp);
		return signedOp;
	} catch (error) {
		console.error("Error signing operation:", error);
		throw error;
	}
}

/**
 * End the current session by clearing session keys.
 */
export function endSession(oktoClient: OktoClient) {
	try {
		oktoClient.sessionClear();
		console.log("User logged out");
		return true;
	} catch (error) {
		console.error("Error ending session:", error);
		return false;
	}
}
