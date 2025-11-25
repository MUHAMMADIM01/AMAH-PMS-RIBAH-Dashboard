import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6Y6IHVFWQ3MoufpQpPod-a2tiE2mm3fU",
  authDomain: "amah-store.firebaseapp.com",
  projectId: "amah-store",
  storageBucket: "amah-store.firebasestorage.app",
  messagingSenderId: "673483173814",
  appId: "1:673483173814:web:e4fc948ed749bb31c09b17"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);