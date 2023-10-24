import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-_ruHRq2HLzCDNve-cEo3aTuUhZ8sdJc",
  authDomain: "japanese-restaurant-6b448.firebaseapp.com",
  projectId: "japanese-restaurant-6b448",
  storageBucket: "japanese-restaurant-6b448.appspot.com",
  messagingSenderId: "546151894039",
  appId: "1:546151894039:web:f0deb881786650e7692052",
  measurementId: "G-XBDDYJ04CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};