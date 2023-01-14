// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChJU4TFZm7Y25wcqA-uqMckv-z-S9JKDc",
  authDomain: "trailerflix-dev.firebaseapp.com",
  projectId: "trailerflix-dev",
  storageBucket: "trailerflix-dev.appspot.com",
  messagingSenderId: "427275279696",
  appId: "1:427275279696:web:cbfd6ea4f1e9ff91b96055",
  measurementId: "G-1Y8BZTJW8V"
};

// Custom error message object based on firebase errors sent to client.
export const authErrorMessages = {
  'auth/email-already-in-use': 'Email already in use.',
  'auth/invalid-email': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many login attempts made. Please try again later.'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// The object that we use our AuthContext with
export const auth = getAuth(app);

