import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBGyFJduQQ76NqCW9GykQeEcQDQV2T-fGU",
  authDomain: "sub-manager-9d306.firebaseapp.com",
  projectId: "sub-manager-9d306",
  storageBucket: "sub-manager-9d306.firebasestorage.app",
  messagingSenderId: "194665139364",
  appId: "1:194665139364:web:fa791369534666d4a06a31",
  measurementId: "G-XV4E2WC1T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
