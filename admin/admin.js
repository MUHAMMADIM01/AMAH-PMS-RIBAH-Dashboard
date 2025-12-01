// SIMPLE ADMIN LOGIN
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        localStorage.setItem("isAdmin", "true");
        msg.style.color = "green";
        msg.innerHTML = "Login successful!";
        setTimeout(() => window.location.href = "dashboard.html", 900);
    } else {
        msg.style.color = "red";
        msg.innerHTML = "Incorrect username or password!";
    }
}

window.login = login;

import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ADD MEDICINE
async function addMedicine() {
    const name = document.getElementById("medName").value.trim();
    const desc = document.getElementById("medDesc").value.trim();
    const file = document.getElementById("medicineImage").files[0];

    if (!name) return alert("Medicine name required");

    let imageURL = "";

    if (file) {
        const imageRef = ref(storage, `medicines/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "medicines"), {
        name,
        description: desc,
        imageURL
    });

    alert("Added successfully!");
    location.reload();
}

window.addMedicine = addMedicine;

// LOAD MEDICINES
async function loadMedicines() {
    const list = document.getElementById("medicinesList");
    list.innerHTML = "Loading...";

    const querySnapshot = await getDocs(collection(db, "medicines"));

    list.innerHTML = "";

    querySnapshot.forEach((docItem) => {
        const med = docItem.data();
        const id = docItem.id;

        const div = document.createElement("div");
        div.classList.add("medicine-item");

        div.innerHTML = `
            <h4>${med.name}</h4>
            <p>${med.description}</p>
            <button onclick="deleteMedicine('${id}', '${med.name}')">Delete</button>
        `;

        list.appendChild(div);
    });
}

loadMedicines();

// CONFIRM DELETE MEDICINE
async function deleteMedicine(id, name) {
    if (!confirm(`Do you want to delete ${name}?`)) return;

    await deleteDoc(doc(db, "medicines", id));
    alert("Deleted");
    location.reload();
}

window.deleteMedicine = deleteMedicine;

// ADD TIP
async function addTip() {
    const text = document.getElementById("tipText").value.trim();

    if (!text) return alert("Tip cannot be empty");

    await addDoc(collection(db, "tips"), { text });

    alert("Tip added!");
    location.reload();
}

window.addTip = addTip;

// LOAD TIPS
async function loadTips() {
    const list = document.getElementById("tipsList");
    list.innerHTML = "Loading...";

    const querySnapshot = await getDocs(collection(db, "tips"));

    list.innerHTML = "";

    querySnapshot.forEach((docItem) => {
        const tip = docItem.data();
        const id = docItem.id;

        const div = document.createElement("div");
        div.classList.add("tip-item");

        div.innerHTML = `
            <p>${tip.text}</p>
            <button onclick="deleteTip('${id}', '${tip.text}')">Delete</button>
        `;

        list.appendChild(div);
    });
}

loadTips();

// CONFIRM DELETE TIP
async function deleteTip(id, text) {
    if (!confirm(`Do you want to delete this tip?\n\n"${text}"`)) return;

    await deleteDoc(doc(db, "tips", id));
    alert("Deleted");
    location.reload();
}

window.deleteTip = deleteTip;
