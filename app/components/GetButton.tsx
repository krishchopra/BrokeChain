import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform
} from "react-native";
import { useOkto } from "@okto_web3/react-native-sdk";

interface GetButtonProps {
  title: string;
  apiFn: any;
}

const GetButton: React.FC<GetButtonProps> = ({ title, apiFn }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [resultData, setResultData] = useState("");
  const oktoClient = useOkto();

  const handleButtonPress = () => {
    apiFn(oktoClient)
      .then((result: any) => {
        console.log(`${title}:`, result);
        const resultData = JSON.stringify(result, null, 2);
        setResultData(resultData !== "null" ? resultData : "No result");
        setModalVisible(true);
      })
      .catch((error: any) => {
        console.error(`${title} error:`, error);
        setResultData(`error: ${error}`);
        setModalVisible(true);
      });
  };

  const handleClose = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title} Result</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.resultContainer}>
              <Text style={styles.resultText}>{resultData}</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={handleClose}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#3B82F6', // bg-blue-500
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.5)', // bg-gray-800 with opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#000000',
    borderRadius: 8,
    width: '100%',
    maxWidth: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151', // border-gray-700
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#9CA3AF', // text-gray-400
    padding: 4,
  },
  resultContainer: {
    maxHeight: 384, // max-h-96
    backgroundColor: '#111827', // bg-gray-900
    padding: 16,
    borderRadius: 8,
  },
  resultText: {
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalFooter: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  closeModalButton: {
    backgroundColor: '#374151', // bg-gray-700
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default GetButton; 