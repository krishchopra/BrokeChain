// app/Dashboard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
	const router = useRouter();

	const handleRequestExpense = () => {
		router.push("/RequestExpense");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to your Dashboard</Text>
			<Text style={styles.subtitle}>
				Here you can manage your group expenses
			</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={handleRequestExpense}
			>
				<Text style={styles.buttonText}>Request an Expense</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginBottom: 40,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#03dac5",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
