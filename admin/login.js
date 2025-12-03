// login.js
import { auth, db } from "../firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const msgEl = document.getElementById('msg');
const btn = document.getElementById('loginBtn');

btn.onclick = async () => {
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  if(!email || !pass){ msgEl.textContent = "Fill both fields"; msgEl.style.color='red'; return; }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    // check admins collection
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if(!adminDoc.exists()){
      msgEl.textContent = "Account is not an admin.";
      msgEl.style.color = "red";
      await auth.signOut();
      return;
    }

    msgEl.textContent = "Login successful — redirecting...";
    msgEl.style.color = "green";
    setTimeout(()=> window.location.href = 'dashboard.html', 900);
  } catch (err) {
    console.error(err);
    msgEl.textContent = err.message || "Login failed";
    msgEl.style.color = "red";
  }
};
