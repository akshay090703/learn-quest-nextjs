// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "learn-quest-nextjs.firebaseapp.com",
  projectId: "learn-quest-nextjs",
  storageBucket: "learn-quest-nextjs.appspot.com",
  messagingSenderId: "178761813268",
  appId: "1:178761813268:web:405f8fcb3b4d19f7890601",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
