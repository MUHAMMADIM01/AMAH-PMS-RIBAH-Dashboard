import { db } from '../firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
document.getElementById("add").onclick = async () => {
  const name = document.getElementById("med").value.trim();
  if (!name) { alert("Enter name"); return; }
  try { await addDoc(collection(db, "medicines"), { name }); alert("Added!"); }
  catch(e){ alert("Error: " + e.message); }
};