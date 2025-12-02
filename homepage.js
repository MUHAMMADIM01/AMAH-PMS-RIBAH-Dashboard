// homepage.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { storage } from "./firebase.js";
import {
  ref,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


// -----------------------
// LOAD MEDICINES
// -----------------------
async function loadMedicines() {
  const container = document.getElementById("medicineList");
  container.innerHTML = "Loading...";

  try {
    const querySnapshot = await getDocs(collection(db, "medicines"));

    container.innerHTML = ""; // clear

    querySnapshot.forEach((doc) => {
      const med = doc.data();

      const div = document.createElement("div");
      div.classList.add("item-card");

      div.innerHTML = `
        <h3>${med.name || "Unnamed Medicine"}</h3>
        <p>${med.description || "No description available"}</p>
        ${
          med.imageURL
            ? `<img src="${med.imageURL}" class="item-image">`
            : `<div class="no-image">No image</div>`
        }
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "❌ Failed to load medicines.";
  }
}

loadMedicines();


// -----------------------
// LOAD HEALTH TIPS
// -----------------------
async function loadTips() {
  const container = document.getElementById("healthTipsList");
  container.innerHTML = "Loading...";

  try {
    const querySnapshot = await getDocs(collection(db, "tips"));

    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const tip = doc.data();

      const div = document.createElement("div");
      div.classList.add("tip-item");
      div.textContent = tip.text;

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "❌ Failed to load tips.";
  }
}

loadTips();
