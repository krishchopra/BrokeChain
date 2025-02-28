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
  Platform,
  Clipboard 
} from "react-native";
import { evmRawTransaction, useOkto } from "@okto_web3/react-native-sdk";

export default function RawTransaction({ navigation }: any) {
  const oktoClient = useOkto();
  const [networkId, setNetworkId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [userOp, setUserOp] = useState<any | null>(null);
  const [signedUserOp, setSignedUserOp] = useState<any | null>(null);
  const [editableUserOp, setEditableUserOp] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateUserOp = async () => {
    try {
      const rawTransactionIntentParams = {
        networkId,
        transaction: {
          from,
          to,
          value: BigInt(value),
          data: data || undefined,
        },
      };
      console.log("Creating UserOp with params:", rawTransactionIntentParams);
      const createdUserOp = await evmRawTransaction(
        oktoClient,
        rawTransactionIntentParams
      );
      setUserOp(createdUserOp);
      const formattedUserOp = JSON.stringify(createdUserOp, null, 2);
      setEditableUserOp(formattedUserOp);
      setResponseMessage(`UserOp created:\n${formattedUserOp}`);
    } catch (error: any) {
      console.error("Error creating UserOp:", error);
      setResponseMessage(`Error creating UserOp: ${error.message}`);
    }
  };

  const handleSignUserOp = async () => {
    if (!editableUserOp) {
      setResponseMessage("Error: Create UserOp first!");
      return;
    }
    try {
      const parsedUserOp = JSON.parse(editableUserOp);
      const signedOp = await oktoClient.signUserOp(parsedUserOp);
      setSignedUserOp(signedOp);
      const formattedSignedOp = JSON.stringify(signedOp, null, 2);
      setResponseMessage(`UserOp signed:\n${formattedSignedOp}`);
    } catch (error: any) {
      console.error("Error signing UserOp:", error);
      setResponseMessage(`Error signing UserOp: ${error.message}`);
    }
  };

  const handleExecuteUserOp = async () => {
    if (!signedUserOp) {
      setResponseMessage("Error: Sign UserOp first!");
      return;
    }
    try {
      const result = await oktoClient.executeUserOp(signedUserOp);
      const formattedResult = JSON.stringify(result, null, 2);
      setResponseMessage(`Execution Result:\n${formattedResult}`);
    } catch (error: any) {
      console.error("Error executing UserOp:", error);
      setResponseMessage(`Error executing UserOp: ${error.message}`);
    }
  };

  const handleEVMRawTransaction = async () => {
    try {
      const rawTransactionIntentParams = {
        networkId,
        transaction: {
          from,
          to,
          value: BigInt(value),
          data: data || undefined,
        },
      };
      console.log("Executing EVM Raw Transaction with params:", rawTransactionIntentParams);
      const createdUserOp = await evmRawTransaction(oktoClient, rawTransactionIntentParams);
      const signedOp = await oktoClient.signUserOp(createdUserOp);
      const result = await oktoClient.executeUserOp(signedOp);
      const formattedResult = JSON.stringify(result, null, 2);
      setResponseMessage(`EVM Raw Transaction executed successfully!\nResult:\n${formattedResult}`);
    } catch (error: any) {
      console.error("Error executing EVM Raw Transaction:", error);
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(responseMessage);
      setModalVisible(true);
    } catch (error) {
      console.error("Clipboard copy failed", error);
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

        <Text style={styles.title}>EVM Raw Transaction</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={networkId}
            onChangeText={setNetworkId}
            placeholder="Enter Network (ChainId/CAIP2)"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            value={from}
            onChangeText={setFrom}
            placeholder="Enter Sender Address"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            value={to}
            onChangeText={setTo}
            placeholder="Enter Recipient Address"
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Enter Value in Wei"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder="Enter Data (optional)"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={handleEVMRawTransaction}
          >
            <Text style={styles.buttonText}>Execute EVM Raw Transaction</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.greenButton]}
              onPress={handleCreateUserOp}
            >
              <Text style={styles.buttonText}>Create UserOp</Text>
            </TouchableOpacity>

            {userOp && (
              <TextInput
                style={styles.userOpInput}
                value={editableUserOp}
                onChangeText={setEditableUserOp}
                multiline
                numberOfLines={10}
                placeholder="Edit UserOp JSON here"
                placeholderTextColor="#9CA3AF"
              />
            )}

            <TouchableOpacity
              style={[styles.button, styles.yellowButton]}
              onPress={handleSignUserOp}
            >
              <Text style={styles.buttonText}>Sign UserOp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.purpleButton]}
              onPress={handleExecuteUserOp}
            >
              <Text style={styles.buttonText}>Execute UserOp</Text>
            </TouchableOpacity>
          </View>

          {responseMessage && (
            <View style={styles.responseContainer}>
              <TextInput
                style={styles.responseInput}
                value={responseMessage}
                multiline
                editable={false}
                numberOfLines={6}
              />
              <TouchableOpacity
                style={[styles.button, styles.indigoButton]}
                onPress={copyToClipboard}
              >
                <Text style={styles.buttonText}>Copy Response to Clipboard</Text>
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
                <Text style={styles.modalTitle}>Transaction Status</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalText}>{responseMessage}</Text>
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
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  blueButton: {
    backgroundColor: '#3B82F6',
  },
  greenButton: {
    backgroundColor: '#10B981',
  },
  yellowButton: {
    backgroundColor: '#F59E0B',
  },
  purpleButton: {
    backgroundColor: '#8B5CF6',
  },
  indigoButton: {
    backgroundColor: '#6366F1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
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
  responseContainer: {
    marginTop: 16,
  },
  responseInput: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 8,
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