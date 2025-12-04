import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const loginBtn = document.getElementById("loginBtn");
  loginBtn.textContent = "Checking...";
  loginBtn.disabled = true;

  try {
    // Sign in normal Firebase user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user exists in admins collection
    const adminRef = doc(db, "admins", email);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      alert("Account is not an admin.");
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    // Check role field
    const role = adminSnap.data().role;
    if (role !== "admin") {
      alert("This account is not authorized as admin.");
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
