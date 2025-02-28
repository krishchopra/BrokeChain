const config = {
	environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
	clientPrivateKey: process.env.EXPO_PUBLIC_CLIENT_PRIVATE_KEY,
	clientSWA: process.env.EXPO_PUBLIC_CLIENT_SWA,
};

export default config;
export { config };
