import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA0J_pVcS3fdRj4IN7cr4LW28rEwR-7Wb4",
  authDomain: "infinora-5fc66.firebaseapp.com",
  projectId: "infinora-5fc66",
  storageBucket: "infinora-5fc66.firebasestorage.app",
  messagingSenderId: "319687640360",
  appId: "1:319687640360:web:d22542246b660e7211bc1d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup }