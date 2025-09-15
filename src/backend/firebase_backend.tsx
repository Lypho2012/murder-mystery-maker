// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore/lite';

import * as dotenv from 'dotenv';
dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env["FIREBASE_API_KEY"],
  authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
  projectId: process.env["FIREBASE_PROJECT_ID"],
  storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
  appId: process.env["FIREBASE_APP_ID"],
  measurementId: process.env["FIREBASE_MEASUREMENT_ID"]
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export async function getIds() {
  const data_col = collection(db, 'murdermysteries');
  const data_snapshot = await getDocs(data_col);
  const data_list = data_snapshot.docs.map(doc => doc.id);
  return data_list;
}

async function getField(id: string, field: string) {
  const ref = doc(db, 'murdermysteries', id);
  const data = await getDoc(ref);
  if (data.exists()) return data.data()[field]
  return null;
}

export async function getLastModified(id: string) {
  return await getField(id,"last modified")
}

export async function getName(id: string) {
  return await getField(id,"name")
}