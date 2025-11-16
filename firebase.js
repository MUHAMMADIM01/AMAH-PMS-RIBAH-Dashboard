// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqXjy7ogO8qMCsfuYB61yBpZJpKKKGhqk",
  authDomain: "amahmedicinestore-be61b.firebaseapp.com",
  databaseURL: "https://amahmedicinestore-be61b-default-rtdb.firebaseio.com",
  projectId: "amahmedicinestore-be61b",
  storageBucket: "amahmedicinestore-be61b.firebasestorage.app",
  messagingSenderId: "740301709370",
  appId: "1:740301709370:web:9fd66894daa25bd85b1503",
  measurementId: "G-NV6KNSM3CV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
