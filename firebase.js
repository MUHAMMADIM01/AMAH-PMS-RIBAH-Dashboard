import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC6Y6IHVFWQ3MoufpQpPod-a2tiE2mm3fU",
  authDomain: "amah-store.firebaseapp.com",
  databaseURL: "https://amah-store-default-rtdb.firebaseio.com",
  projectId: "amah-store",
  storageBucket: "amah-store.firebasestorage.app",
  messagingSenderId: "673483173814",
  appId: "1:673483173814:web:e4fc948ed749bb31c09b17"
};

// INITIALIZE
export const app = initializeApp(firebaseConfig);

// FIRESTORE
export const db = getFirestore(app);
export const MedicinesCollection = collection(db, "medicines");

// STORAGE
export const storage = getStorage(app);

// EXPORT FUNCTIONS
export { ref, uploadBytes, getDownloadURL, addDoc };
