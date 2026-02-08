import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDq2cVDwpSewkevLnT67TAYdAYUasdsVDU",
    authDomain: "portfolio-690c8.firebaseapp.com",
    projectId: "portfolio-690c8",
    storageBucket: "portfolio-690c8.firebasestorage.app",
    messagingSenderId: "724470863396",
    appId: "1:724470863396:web:c7576ecf9396652ae32ab1",
    measurementId: "G-EC5G4CPRNW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
