// firebase.js  — export common Firebase instances & helpers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
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
  const app = initializeApp(firebaseConfig);
</script>

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// re-export commonly used functions so other modules import from here
export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
