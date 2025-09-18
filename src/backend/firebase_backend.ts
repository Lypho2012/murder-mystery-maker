// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

async function getBoards() {
  const data_col = collection(db, 'murdermysteries');
  const data_snapshot = await getDocs(data_col);

  const boardPromises = data_snapshot.docs.map(async (doc) => {
    const lastModified = await getLastModified(doc.id);
    const name = await getName(doc.id);
    return {
      "id": doc.id,
      "last modified": lastModified,
      "name": name
    };
  });

  const data_list = await Promise.all(boardPromises);
  
  return data_list;
}

async function getField(id: string, field: string) {
  const ref = doc(db, 'murdermysteries', id);
  const data = await getDoc(ref);
  if (data.exists()) return data.data()[field]
  return null;
}

async function getLastModified(id: string) {
  const res = await getField(id,"last modified")
  return res
}

async function getName(id: string) {
  const res = await getField(id,"name")
  return res
}

const express = require("express");
const cors = require("cors");

const express_app = express();
express_app.use(cors());

const PORT = process.env.PORT || 8000;
express_app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

express_app.get("/get-boards", async (req: any, res: any) => {
  const boards = await getBoards()
  res.json(boards)
});

express_app.get("/get-last-modified/:id", async (req: any, res: any) => {
  const lastModified = await getLastModified(req.params.id);
  res.send(lastModified);
});

express_app.get("/get-name/:id", async (req: any, res: any) => {
  const name = await getName(req.params.id);
  res.send(name);
});