import { Platform } from "react-native";

let SignIn: any;

if (Platform.OS === "web") {
	SignIn = require("./SignIn.web").default;
} else {
	SignIn = require("./SignIn.native").default;
}

export default SignIn;
