// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBWJ1ynbX_BIhcxEFAlsvNm0oJZIx0xUb4",
    authDomain: "brokechain-a325a.firebaseapp.com",
    databaseURL: "https://brokechain-a325a-default-rtdb.firebaseio.com",
    projectId: "brokechain-a325a",
    storageBucket: "brokechain-a325a.appspot.com",
    messagingSenderId: "1014864039022",
    appId: "1:1014864039022:web:6319ef764a052792032a7f"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);



//EXAMPLE ON HOW TO USE DB:
// Example: Save user data
// ts
// Copy
// Edit
// import { ref, set } from "firebase/database";
// import { db } from "../firebase/firebaseConfig"; // Import the initialized Realtime Database

// const saveUser = (userId: string, name: string) => {
//     set(ref(db, 'users/' + userId), {
//         name: name,
//         timestamp: Date.now()
//     });
// };
// Usage inside a sign-in function:

// ts
// Copy
// Edit
// const handleSignIn = () => {
//     if (!name.trim()) return;

//     const userId = Date.now().toString(); // Temporary unique ID
//     saveUser(userId, name);
    
//     router.replace("/Dashboard");
// };
// 4. Reading from Realtime Database
// Example: Fetch user data
// ts
// Copy
// Edit
// import { ref, onValue } from "firebase/database";
// import { db } from "../firebase/firebaseConfig"; 

// const fetchUser = (userId: string) => {
//     const userRef = ref(db, 'users/' + userId);
    
//     onValue(userRef, (snapshot) => {
//         const data = snapshot.val();
//         console.log("User Data:", data);
//     });
// };
// 5. Listening for Realtime Updates
// If you want to continuously listen for changes (e.g., new expense requests being added), you can use the onValue listener:

// ts
// Copy
// Edit
// import { ref, onValue } from "firebase/database";
// import { db } from "../firebase/firebaseConfig";

// const expensesRef = ref(db, "expenses");

// onValue(expensesRef, (snapshot) => {
//     const data = snapshot.val();
//     console.log("Updated Expenses:", data);
// });
// 6. Storing Expenses in Realtime Database
// You can store expenses under a specific group like this:

// ts
// Copy
// Edit
// import { ref, push } from "firebase/database";
// import { db } from "../firebase/firebaseConfig";

// // Function to add an expense
// const addExpense = (groupId: string, amount: number, description: string) => {
//     const expensesRef = ref(db, `groups/${groupId}/expenses`);
    
//     push(expensesRef, {
//         amount,
//         description,
//         timestamp: Date.now()
//     });
// };
// Usage in your request expense screen:

// ts
// Copy
// Edit
// addExpense("group123", 50, "Dinner with friends");
// 7. Fetching Expenses for a Group

