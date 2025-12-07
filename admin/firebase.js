// firebase.js (Firebase v12 Compatible)
// USE THIS EXACT FILE

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC6Y6IHVFWQ3MoufpQpPod-a2tiE2mm3fU",
  authDomain: "amah-store.firebaseapp.com",
  databaseURL: "https://amah-store-default-rtdb.firebaseio.com",
  projectId: "amah-store",
  storageBucket: "amah-store.firebasestorage.app",
  messagingSenderId: "673483173814",
  appId: "1:673483173814:web:e4fc948ed749bb31c09b17"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export helpers
export {
  signInWithEmailAndPassword,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Collections
export const MedicinesCollection = collection(db, "medicines");
export const TipsCollection = collection(db, "tips");
export const AdminsCollection = collection(db, "admins");
