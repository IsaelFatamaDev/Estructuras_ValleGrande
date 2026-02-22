import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAV45CzJr-y-veQFkqwv4B_ndH4esv2MCk",
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "estructurasvg.firebaseapp.com",
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "estructurasvg",
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "estructurasvg.firebasestorage.app",
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "758008982885",
     appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:758008982885:web:907283539ec82f682a058c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("user");
