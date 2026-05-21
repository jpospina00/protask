import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuNLCTpM_vQjFeovATLm5643ocBkxUBuc",
  authDomain: "protask-2bd88.firebaseapp.com",
  projectId: "protask-2bd88",
  storageBucket: "protask-2bd88.firebasestorage.app",
  messagingSenderId: "855587732577",
  appId: "1:855587732577:web:f5a06d39dc9e3aae767e20",
  measurementId: "G-N3FSDKS659",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
