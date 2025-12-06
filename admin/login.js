// admin/login.js
import {
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  getDoc
} from "../firebase.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Logging in...";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // check admins collection
    const adminDoc = await getDoc(doc(db, "admins", uid));
    if (!adminDoc.exists()) {
      msg.textContent = "❌ This account is not an admin.";
      await auth.signOut();
      return;
    }

    // success
    localStorage.setItem("amah_admin", uid); // small session flag
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    msg.textContent = "Login failed: " + (err.message || err.code);
  }
});
