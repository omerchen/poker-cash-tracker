import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDMKTYzM_kgSG41d9W-5Aiwpb4uRDjlNmE",
  authDomain: "chiply-30dfa.firebaseapp.com",
  databaseURL: "https://chiply-30dfa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chiply-30dfa",
  storageBucket: "chiply-30dfa.firebasestorage.app",
  messagingSenderId: "184930778991",
  appId: "1:184930778991:web:1f1ff410257f237cb5f29a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth }; 