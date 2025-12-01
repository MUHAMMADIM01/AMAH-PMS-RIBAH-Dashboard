// SIMPLE ADMIN SECURITY
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";  // Ka sauya bayan ka gwada

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        msg.style.color = "green";
        msg.innerHTML = "Login successful! Redirecting...";

        // Save login state
        localStorage.setItem("isAdmin", "true");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } else {
        msg.style.color = "red";
        msg.innerHTML = "Incorrect username or password!";
    }
}

import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

async function addMedicine() {
    const name = document.getElementById("medName").value.trim();
    const desc = document.getElementById("medDesc").value.trim();
    const imageFile = document.getElementById("medicineImage").files[0];

    if (!name) {
        alert("Medicine name is required");
        return;
    }

    let imageURL = "";

    // Upload image if selected
    if (imageFile) {
        const imageRef = ref(storage, `medicines/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "medicines"), {
        name,
        description: desc,
        imageURL: imageURL || ""
    });

    alert("Medicine added successfully!");
    location.reload();
}

window.addMedicine = addMedicine;
