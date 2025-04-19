import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLwzcjSdJCnW9wTgtPsUjZQ_EW9-40IBk",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "gradepredict13s",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "771169599562",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
