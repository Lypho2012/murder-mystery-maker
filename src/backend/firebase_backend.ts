// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, updateDoc, addDoc, DocumentReference, deleteDoc } from 'firebase/firestore/lite';

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
    const title = await getTitle(doc.id);
    return {
      "id": doc.id,
      "last modified": lastModified,
      "name": title
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

async function getTitle(id: string) {
  const res = await getField(id,"name")
  return res
}

async function setLastModified(id: string, newValue: any) {
  const ref = doc(db, 'murdermysteries', id);
  await updateDoc(ref, {"last modified": newValue});
}

async function setTitle(id: string, newValue: string) {
  const ref = doc(db, 'murdermysteries', id);
  await updateDoc(ref, {"name": newValue});
}

async function addBoard() {
  const ref = await addDoc(collection(db, "murdermysteries"), {
    name: "Untitled",
    "last modified": Timestamp.now()
  });
  return ref.id
}

async function getCharacters(id: string) {
  const docref = doc(db, 'murdermysteries', id);
  const collectionref = collection(docref,"Characters")
  const data_snapshot = await getDocs(collectionref);
  const promises = data_snapshot.docs.map(async (doc) => {
    return {
      "id": doc.id,
      "name": doc.get('name'),
      "background":doc.get('Background'),
      "evidences":doc.get('Evidences'),
      "victim":doc.get('Victim'),
      "x":doc.get('x'),
      "y":doc.get('y')
    };
  });

  const data_list = await Promise.all(promises);
  
  return data_list;
}

async function addCharacter(id: string) {
  const docref = doc(db, 'murdermysteries', id);
  await addDoc(collection(docref, "Characters"), {
    name: "No name"
  })
}

async function deleteCharacter(boardId: string, charId: string) {
  await deleteDoc(doc(db,"murdermysteries",boardId,"Characters",charId))
}

async function setCharacterPosition(boardId: string, charId: string, x: number, y: number) {
  await updateDoc(doc(db,"murdermysteries",boardId,"Characters",charId), {"x": x, "y": y})
}

async function setName(boardId: string, charId: string, newValue: string) {
  const ref = doc(db, 'murdermysteries', boardId, "Characters", charId);
  await updateDoc(ref, {"name": newValue});
}

async function getName(boardId: string, charId: string) {
  const ref = doc(db, 'murdermysteries', boardId, "Characters", charId);
  const data = await getDoc(ref);
  if (data.exists()) return data.data()["name"]
  return null;
}

const express = require("express");
const cors = require("cors");

const express_app = express();
express_app.use(cors());
express_app.use(express.json());

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

express_app.get("/get-title/:id", async (req: any, res: any) => {
  const title = await getTitle(req.params.id);
  res.send(title);
});

express_app.post("/set-title/:id", async (req: any, res: any) => {
  const {title} = req.body
  await setTitle(req.params.id,title);
  let time_now = Timestamp.now()
  await setLastModified(req.params.id,time_now)
  res.send(time_now);
});

express_app.post("/add-board", async (req: any, res: any) => {
  const boardId = await addBoard()
  res.send(boardId)
});

express_app.get("/get-characters/:id", async (req: any, res: any) => {
  const characters = await getCharacters(req.params.id);
  res.send(characters);
});

express_app.post("/add-char/:id", async (req: any, res: any) => {
  await addCharacter(req.params.id);
  let time_now = Timestamp.now()
  await setLastModified(req.params.id,time_now)
  let characters = await getCharacters(req.params.id)
  res.json({
    "lastModified": time_now,
    "characters": characters
  })
});

express_app.delete("/delete-char/:boardId/:charId", async (req: any, res: any) => {
  await deleteCharacter(req.params.boardId,req.params.charId);
  let time_now = Timestamp.now()
  await setLastModified(req.params.boardId,time_now)
  let characters = await getCharacters(req.params.boardId)
  res.json({
    "lastModified": time_now,
    "characters": characters
  })
});

express_app.post("/set-char-pos/:boardId/:charId", async (req: any, res: any) => {
  const {x, y} = req.body
  await setCharacterPosition(req.params.boardId,req.params.charId, x, y);
  let time_now = Timestamp.now()
  await setLastModified(req.params.boardId,time_now)
  let characters = await getCharacters(req.params.boardId)
  res.json({
    "lastModified": time_now,
    "characters": characters
  })
});

express_app.post("/set-name/:boardId/:charId", async (req: any, res: any) => {
  const {name} = req.body
  await setName(req.params.boardId, req.params.charId,name);
  let time_now = Timestamp.now()
  await setLastModified(req.params.boardId,time_now)
  res.send(time_now);
});

express_app.get("/get-name/:boardId/:charId", async (req: any, res: any) => {
  let name = await getName(req.params.boardId, req.params.charId);
  res.send(name);
});