import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRCIAxLzUJtJSJVvqQJFSlIr5K4AR2XMg",
  authDomain: "eduvia-9ff95.firebaseapp.com",
  projectId: "eduvia-9ff95",
  storageBucket: "eduvia-9ff95.firebasestorage.app",
  messagingSenderId: "833185342856",
  appId: "1:833185342856:web:40186d52b5c1617f96c63d",
  measurementId: "G-1DB6BTKCJ7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
