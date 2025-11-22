// homepage.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== LOAD MEDICINES =====
async function loadMedicines() {
  const list = document.getElementById("medicineList");
  list.innerHTML = "<p>Loading...</p>";

  const snapshot = await getDocs(collection(db, "medicines"));
  if (snapshot.empty) {
    list.innerHTML = "<p>No medicines added yet.</p>";
    return;
  }

  let html = "";
  snapshot.forEach(doc => {
    const m = doc.data();
    html += `
      <div class="medicine-card">
        <img src="${m.photo}" alt="${m.name}" />
        <h3>${m.name}</h3>
        <p>${m.description || ""}</p>
        <a class="btn" href="#contact">Contact to Buy</a>
      </div>
    `;
  });

  list.innerHTML = html;
}

// ===== LOAD HEALTH TIPS =====
async function loadTips() {
  const box = document.getElementById("tipsList");
  box.innerHTML = "<p>Loading tips...</p>";

  const snapshot = await getDocs(collection(db, "tips"));
  if (snapshot.empty) {
    box.innerHTML = "<p>No health tips yet.</p>";
    return;
  }

  const tips = snapshot.docs.map(doc => doc.data().text);

  let i = 0;
  function rotate() {
    box.innerHTML = `<p>💡 <i>${tips[i]}</i></p>`;
    i = (i + 1) % tips.length;
  }

  rotate();
  setInterval(rotate, 4000);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  loadMedicines();
  loadTips();
});
