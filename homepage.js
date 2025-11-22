import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadMedicines() {
  const list = document.getElementById("medicineList");
  list.innerHTML = `<p>Loading...</p>`;

  const snap = await getDocs(collection(db, "medicines"));

  if (snap.empty) {
    list.innerHTML = "<p>No medicines available yet.</p>";
    return;
  }

  list.innerHTML = "";

  snap.forEach((doc) => {
    const m = doc.data();

    list.innerHTML += `
      <div class="medicine-card">
        <img src="${m.photo}" alt="${m.name}">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadMedicines);
