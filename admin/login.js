// login.js (COMPLETE WORKING)

import {
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  getDoc
} from "./firebase.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    // STEP 1 — Login to Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // STEP 2 — Check if the email is an ADMIN
    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      alert("❌ This account is NOT an admin.");
      return;
    }

    // STEP 3 — Store login state
    localStorage.setItem("adminLoggedIn", "yes");

    // STEP 4 — Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
