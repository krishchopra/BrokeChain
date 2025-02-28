import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView,
  SafeAreaView,
  Platform 
} from "react-native";
import { tokenTransfer, useOkto } from "@okto_web3/react-native-sdk";

export default function TransferToken({ navigation }: any) {
  const oktoClient = useOkto();

  const [networkName, setNetworkName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userOp, setUserOp] = useState<any | null>(null);
  const [userOpString, setUserOpString] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const transferParams = {
        amount: Number(quantity),
        recipient: recipientAddress,
        token: tokenAddress ,
        chain: networkName,
      };

      console.log("Transfer params: ", transferParams);

      const userOpTmp = await tokenTransfer(oktoClient, transferParams);
      setUserOp(userOpTmp);
      setUserOpString(JSON.stringify(userOpTmp, null, 2));
    } catch (error: any) {
      console.error("Transfer failed:", error);
      setModalMessage("Error: " + error.message);
      setModalVisible(true);
    }
  };

  const handleSubmitUserOp = async () => {
    if (!userOpString) return;
    try {
      const editedUserOp = JSON.parse(userOpString);
      const signedUserOp = await oktoClient.signUserOp(editedUserOp);
      const tx = await oktoClient.executeUserOp(signedUserOp);
      setModalMessage("Transfer Submitted: " + JSON.stringify(tx, null, 2));
      setModalVisible(true);
    } catch (error: any) {
      console.error("Transfer failed:", error);
      setModalMessage("Error: " + error.message);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Transfer Tokens</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={networkName}
            onChangeText={setNetworkName}
            placeholder="Enter Network ChainId"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            value={tokenAddress}
            onChangeText={setTokenAddress}
            placeholder="Enter Token Address"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter Quantity (in smallest unit)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            placeholder="Enter Recipient Address"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Create Transfer</Text>
          </TouchableOpacity>

          {userOp && (
            <View style={styles.userOpContainer}>
              <TextInput
                style={styles.userOpInput}
                value={userOpString}
                onChangeText={setUserOpString}
                multiline
                numberOfLines={10}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmitUserOp}
              >
                <Text style={styles.buttonText}>Sign and Send Transaction</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Transfer Status</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalText}>{modalMessage}</Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    padding: 16,
  },
  homeButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  input: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  userOpContainer: {
    marginTop: 16,
  },
  userOpInput: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    height: 200,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingBottom: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    color: '#9CA3AF',
    fontSize: 24,
  },
  modalBody: {
    maxHeight: 300,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
  },
  modalText: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeModalButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});
