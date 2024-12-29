import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
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
export const auth = getAuth(app);
export const db = getFirestore(app);



// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase