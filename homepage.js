import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("Homepage loaded");

async function loadMedicines() {
    const listDiv = document.getElementById("medicineList");
    listDiv.innerHTML = "Loading...";

    const col = collection(db, "medicines");
    const snapshot = await getDocs(col);

    if (snapshot.empty) {
        listDiv.innerHTML = "<p>No medicines added yet.</p>";
        return;
    }

    let html = "";
    snapshot.forEach(doc => {
        const m = doc.data();
        html += `
            <div class="card">
                <h3>${m.name}</h3>
                <p>${m.description || ""}</p>
            </div>
        `;
    });

    listDiv.innerHTML = html;
}

async function loadTips() {
    const list = document.getElementById("tipsList");
    const col = collection(db, "tips");
    const snapshot = await getDocs(col);

    if (snapshot.empty) {
        list.innerHTML = "<p>No health tips yet.</p>";
        return;
    }

    let html = "";
    snapshot.forEach(doc => {
        html += `<p>💡 ${doc.data().text}</p>`;
    });

    list.innerHTML = html;
}

loadMedicines();
loadTips();
