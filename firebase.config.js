import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';


export const firebaseConfig = {
    apiKey: "AIzaSyCHhYGjCctatNzwlNK49Uc7-hMaZcSExyE",
    authDomain: "femora-7bf54.firebaseapp.com",
    projectId: "femora-7bf54",
    storageBucket: "femora-7bf54.firebasestorage.app",
    messagingSenderId: "76002940606",
    appId: "1:76002940606:web:ecc98c7ca9caf3bf77f0ef",
    measurementId: "G-KWJYVV95HG"
};

export const app = initializeApp(firebaseConfig);

// Initialize auth with additional settings for phone auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    // Add phone auth provider settings
    providers: [],
    // Ensure we're not initializing multiple instances
    popupRedirectResolver: undefined
});

export const db = getFirestore(app);
export const database = getDatabase(app);