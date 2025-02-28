import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useOkto, type OktoContextType } from 'okto-sdk-react-native';
import SignIn from './SignIn';
import GetButton from './components/GetButton';
import TransferTokens from './components/TransferTokens';

export default function App() {
  const [idToken, setIdToken] = React.useState<string>();

  const {
    showWidgetSheet,
    authenticate,
    getPortfolio,
    getSupportedNetworks,
    getSupportedTokens,
    getUserDetails,
    getWallets,
    createWallet,
    orderHistory,
    getNftOrderDetails,
  } = useOkto() as OktoContextType;

  function handleAuthenticate(result: any, error: any) {
    if (result) {
      console.log('authentication successful');
    }
    if (error) {
      console.error('authentication error:', error);
    }
  }

  function handleSignIn(_idToken: string) {
    console.log('Google signIn: Success');
    authenticate(_idToken, handleAuthenticate);
    setIdToken(_idToken);
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Okto React Native Template App</Text>
        <View style={styles.buttonGroup}>
          <SignIn onSignIn={handleSignIn} />
          <View style={styles.padding} />
          <Button
            title="authenticate"
            onPress={() => {
              authenticate(idToken!, handleAuthenticate);
            }}
          />
          <View style={styles.padding} />
          <Button
            title="openOktoBottomsheet"
            onPress={() => {
              showWidgetSheet();
            }}
          />
        </View>

        <GetButton title="getPortfolio" apiFn={getPortfolio} />
        <GetButton title="getSupportedNetworks" apiFn={getSupportedNetworks} />
        <GetButton title="getSupportedTokens" apiFn={getSupportedTokens} />
        <GetButton title="getUserDetails" apiFn={getUserDetails} />
        <GetButton title="getWallets" apiFn={getWallets} />
        <GetButton title="createWallet" apiFn={createWallet} />
        <GetButton title="orderHistory" apiFn={orderHistory} />
        <GetButton
          title="getNftOrderDetails"
          apiFn={() => getNftOrderDetails({})}
        />

        <View style={styles.padding} />
        <TransferTokens />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  buttonGroup: {
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  padding: {
    padding: 5,
  },
});
