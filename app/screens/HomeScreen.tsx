import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform 
} from 'react-native';
import { useOkto } from '@okto_web3/react-native-sdk';
import GetButton from '../components/GetButton';
import {
  getAccount,
  getChains,
  getOrdersHistory,
  getPortfolio,
  getPortfolioActivity,
  getPortfolioNFT,
  getTokens,
} from "@okto_web3/react-native-sdk";

export default function HomeScreen({ navigation }: any) {
  const oktoClient = useOkto();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Okto v2 SDK Demo</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <View style={styles.userDetailsCard}>
            <Text style={styles.codeText}>
              {oktoClient.isLoggedIn() 
                ? JSON.stringify(oktoClient, null, 2) 
                : "not signed in"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Explorer Functions</Text>
          <View style={styles.buttonGrid}>
            <GetButton title="getAccount" apiFn={getAccount} />
            <GetButton title="getChains" apiFn={getChains} />
            <GetButton title="getOrdersHistory" apiFn={getOrdersHistory} />
            <GetButton title="getPortfolio" apiFn={getPortfolio} />
            <GetButton title="getPortfolioActivity" apiFn={getPortfolioActivity} />
            <GetButton title="getPortfolioNFT" apiFn={getPortfolioNFT} />
            <GetButton title="getTokens" apiFn={getTokens} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Intents</Text>
          <View style={styles.intentButtons}>
            <TouchableOpacity 
              style={styles.intentButton}
              onPress={() => navigation.navigate('TransferToken')}
            >
              <Text style={styles.buttonText}>Transfer Token</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.intentButton}
              onPress={() => navigation.navigate('TransferNFT')}
            >
              <Text style={styles.buttonText}>Transfer NFT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.intentButton}
              onPress={() => navigation.navigate('RawTransaction')}
            >
              <Text style={styles.buttonText}>Raw Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827', // dark background
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151', // border-gray-700
  },
  userDetailsCard: {
    backgroundColor: '#000000',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#FFFFFF',
  },
  buttonGrid: {
    gap: 12,
  },
  intentButtons: {
    gap: 12,
  },
  intentButton: {
    backgroundColor: '#7C3AED', // violet-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
