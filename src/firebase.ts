import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCem3hbhmNiTBR14tQU1KD2rks7pMDUBBw",
  authDomain: "sevenmen-website.firebaseapp.com",
  projectId: "sevenmen-website",
  storageBucket: "sevenmen-website.firebasestorage.app",
  messagingSenderId: "348054162652",
  appId: "1:348054162652:web:cb2a88ec6e4a47a8ff3819",
  measurementId: "G-7FJQF26TN7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }

  return null;
};