import { app, db } from "../firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const storage = getStorage(app);

document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const file = document.getElementById("photo").files[0];

  if (!file) {
    alert("Please choose an image");
    return;
  }

  // 1️⃣ Upload Image to Firebase Storage
  const path = `medicines/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  // 2️⃣ Save record to Firestore
  await addDoc(collection(db, "medicines"), {
    name: name,
    description: description,
    photo: downloadURL,
    createdAt: Date.now()
  });

  alert("Medicine uploaded successfully!");
  document.getElementById("addForm").reset();
});
