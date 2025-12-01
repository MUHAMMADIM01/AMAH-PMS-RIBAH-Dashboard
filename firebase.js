// FIREBASE APP
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6Y6IHVFWQ3MoufpQpPod-a2tiE2mm3fU",
  authDomain: "amah-store.firebaseapp.com",
  databaseURL: "https://amah-store-default-rtdb.firebaseio.com",
  projectId: "amah-store",
  storageBucket: "amah-store.appspot.com",   // ← GYARAN DA YA KASA
  messagingSenderId: "673483173814",
  appId: "1:673483173814:web:e4fc948ed749bb31c09b17"
};

// INITIALIZE APP
const app = initializeApp(firebaseConfig);

// EXPORT SERVICES
export const db = getFirestore(app);
export const storage = getStorage(app);
