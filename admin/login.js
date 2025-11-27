import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById('loginForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try{
    await signInWithEmailAndPassword(auth, email, password);
    alert('Login successful');
    window.location.href = 'dashboard.html';
  }catch(err){
    console.error(err);
    alert('Login failed: ' + (err.message || err.code));
  }
});
