// src/firebase.js - CORRECT VERSION
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQjt9jzlG5NfxUDQ8x-UB5sRxO6C5K1T0",
  authDomain: "availo-cfcd2.firebaseapp.com",
  projectId: "availo-cfcd2",
  storageBucket: "availo-cfcd2.firebasestorage.app",
  messagingSenderId: "656979344483",
  appId: "1:656979344483:web:50be962e6e8fb80a294c56",
  measurementId: "G-EH29SEBZQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence (optional but recommended)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence enabled");
  })
  .catch((error) => {
    console.warn("Could not set persistence:", error);
  });

// Configure Google provider - SIMPLE IS BETTER
const googleProvider = new GoogleAuthProvider();

// Add scopes (use simple names)
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Export
export { app, auth, googleProvider };