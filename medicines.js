import {
  MedicinesCollection,
  getDocs,
} from "./firebase.js";

async function loadMedicines() {
    const container = document.getElementById("medList");
    container.innerHTML = "Loading...";

    const snapshot = await getDocs(MedicinesCollection);
    container.innerHTML = "";

    snapshot.forEach(doc => {
      const m = doc.data();
      container.innerHTML += `
        <div class="medicine-card">
          <img src="${m.imageUrl}" alt="Medicine Image"/>
          <h3>${m.name}</h3>
          <p>₦${m.price}</p>
        </div>
      `;
    });
}

document.addEventListener("DOMContentLoaded", loadMedicines);
