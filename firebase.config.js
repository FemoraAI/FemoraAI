import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';
import { getFunctions } from "firebase/functions";



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
    // Configure reCAPTCHA Enterprise settings
    recaptchaConfig: {
        siteKey: firebaseConfig.apiKey,
        enterprise: true,
        useEnterpriseRecaptcha: true
    }
});
export const functions = getFunctions(app);

export const db = getFirestore(app);
export const database = getDatabase(app);