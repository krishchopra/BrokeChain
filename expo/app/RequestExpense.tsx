// app/RequestExpense.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RequestExpense() {
  const [amount, setAmount] = useState("");
  const [link, setLink] = useState("");
  const [showQR, setShowQR] = useState(false);

  const router = useRouter();

  const handleGenerateRequest = () => {
    if (!amount) return;
    // In a real app, you might store the request in Firestore,
    // then generate a unique link or ID. For now, we'll do a simple mock:
    const mockLink = `https://brokechain.app/pay?amount=${amount}`;
    setLink(mockLink);
    setShowQR(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request an Expense</Text>
      <Text style={styles.subtitle}>
        Enter an amount to generate a payment request.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleGenerateRequest}>
        <Text style={styles.buttonText}>Generate Request</Text>
      </TouchableOpacity>

      {showQR && (
        <View style={styles.qrContainer}>
          <Text style={styles.linkText}>{link}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  linkText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
});
