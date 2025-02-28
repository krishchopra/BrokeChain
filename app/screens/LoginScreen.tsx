import { StyleSheet, View, Text, Button, TouchableOpacity, SafeAreaView } from 'react-native';
import { useOkto } from '@okto_web3/react-native-sdk';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure the web browser session is handled properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({navigation}: any) {
  const oktoClient = useOkto();
  const [userInfo, setUserInfo] = useState<any>();

  // Configure Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({     
    androidClientId: '620775928154-np2egf93phmp17dnqn5ap9jvvj87119h.apps.googleusercontent.com', 
    scopes: ['openid', 'profile', 'email']
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is already authenticated with Okto
      if (oktoClient.isLoggedIn()) {
        console.log("User already authenticated with Okto");
        navigation.navigate('HomeScreen');
        return;
      }

      // Check for stored token
      const storedToken = await AsyncStorage.getItem('googleIdToken');
      if (storedToken) {
        console.log("Found stored token, attempting authentication");
        handleAuthenticate(storedToken);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleAuthenticate = async (idToken: string) => {
    try {
      await oktoClient.loginUsingOAuth({
        idToken: idToken,
        provider: 'google',
      });
      console.log("Authenticated with Okto");
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error("Authentication failed:", error);
      await AsyncStorage.removeItem('googleIdToken');
    }
  };

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        // Store token and authenticate
        AsyncStorage.setItem('googleIdToken', id_token);
        handleAuthenticate(id_token);
      } else {
        console.warn("ID token not returned!");
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Okto</Text>
          
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Please sign in with your Google account to continue
            </Text>

            {userInfo ? (
              <View style={styles.userInfoContainer}>
                <Text style={styles.welcomeText}>Welcome {userInfo.email}</Text>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('HomeScreen')}
                >
                  <Text style={styles.buttonText}>Go to Dashboard</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.googleButton}
                onPress={() => promptAsync()}
              >
                <Text style={styles.buttonText}>Sign in with Google</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.buttonText}>Go to Homepage</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827', // bg-gray-900
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#000000',
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937', // border-gray-800
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF', // text-gray-400
    textAlign: 'center',
    marginBottom: 16,
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  googleButton: {
    backgroundColor: '#4285F4', // Google blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#7C3AED', // bg-violet-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#7C3AED', // bg-violet-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
