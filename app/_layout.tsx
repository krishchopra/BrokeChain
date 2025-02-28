import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { OktoProvider } from '@okto_web3/react-native-sdk';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Buffer } from 'buffer';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TransferToken from './screens/TransferToken';
import TransferNFT from './screens/TransferNFT';
import RawTransaction from './screens/RawTransaction';

// Make Buffer globally available
global.Buffer = global.Buffer || Buffer;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const StackNavigator = createStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OktoProvider config={{
        environment: "sandbox",
        clientPrivateKey: "0xadf2181a7b2dec0f1ed22061ab31bd6182691c619d9e874a956e71ab7ecca413",
        clientSWA: "0x6b6Fad2600Bc57075ee560A6fdF362FfefB9dC3C",
      }}>
         <StackNavigator.Navigator initialRouteName="LoginScreen">
            <StackNavigator.Screen name="LoginScreen" component={LoginScreen} />
            <StackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <StackNavigator.Screen name="TransferToken" component={TransferToken} />
            <StackNavigator.Screen name="TransferNFT" component={TransferNFT} />
            <StackNavigator.Screen name="RawTransaction" component={RawTransaction} />
          </StackNavigator.Navigator>
        <StatusBar style="auto" />
      </OktoProvider>
    </ThemeProvider>
  );
}
