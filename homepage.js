import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadMedicines() {
  const list = document.getElementById("medList");
  list.innerHTML = "Loading...";

  const snap = await getDocs(collection(db, "medicines"));
  list.innerHTML = "";

  snap.forEach(doc => {
    const item = document.createElement("p");
    item.textContent = doc.data().name;
    list.appendChild(item);
  });

  if (!snap.size) list.innerHTML = "No medicines uploaded yet.";
}

async function loadTips() {
  const list = document.getElementById("tipsList");
  list.innerHTML = "Loading...";

  const snap = await getDocs(collection(db, "tips"));
  list.innerHTML = "";

  snap.forEach(doc => {
    const item = document.createElement("p");
    item.textContent = doc.data().text;
    list.appendChild(item);
  });

  if (!snap.size) list.innerHTML = "No health tips yet.";
}

loadMedicines();
loadTips();
