import { db } from "../firebase.js";
import {
    collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("Admin panel loaded");

function showSection(s) {
    document.getElementById("med").classList.add("hidden");
    document.getElementById("tips").classList.add("hidden");
    document.getElementById(s).classList.remove("hidden");
}

window.showSection = showSection;

/* ------------------------
       LOGOUT
------------------------ */
window.logout = function () {
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
};

/* ------------------------
  ADD MEDICINE
------------------------ */
window.addMedicine = async function () {
    const name = document.getElementById("medName").value;
    const desc = document.getElementById("medDesc").value;

    await addDoc(collection(db, "medicines"), {
        name: name,
        description: desc
    });

    alert("Medicine added!");
    loadMedicines();
};

/* ------------------------
  LOAD MEDICINES
------------------------ */
async function loadMedicines() {
    const box = document.getElementById("medList");
    box.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "medicines"));
    let html = "";

    snap.forEach(d => {
        const m = d.data();
        html += `
        <div class="card">
            <strong>${m.name}</strong><br>
            ${m.description || ""}
            <br>
            <button onclick="delMed('${d.id}')">Delete</button>
        </div>
        `;
    });

    box.innerHTML = html;
}
window.delMed = async function (id) {
    await deleteDoc(doc(db, "medicines", id));
    loadMedicines();
};

/* ------------------------
  ADD TIP
------------------------ */
window.addTip = async function () {
    const txt = document.getElementById("tipText").value;

    await addDoc(collection(db, "tips"), { text: txt });

    alert("Tip added!");
    loadTips();
};

/* ------------------------
  LOAD TIPS
------------------------ */
async function loadTips() {
    const box = document.getElementById("tipsList");
    box.innerHTML = "Loading...";

    const snap = await getDocs(collection(db, "tips"));
    let html = "";

    snap.forEach(d => {
        html += `
        <div class="card">
            💡 ${d.data().text}
            <br>
            <button onclick="delTip('${d.id}')">Delete</button>
        </div>
        `;
    });

    box.innerHTML = html;
}

window.delTip = async function (id) {
    await deleteDoc(doc(db, "tips", id));
    loadTips();
};

loadMedicines();
loadTips();
