import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// LOAD MEDICINES
async function loadMedicines() {
    const container = document.getElementById("medicineList");
    container.innerHTML = "Loading...";

    try {
        const querySnapshot = await getDocs(collection(db, "medicines"));

        container.innerHTML = "";

        querySnapshot.forEach((docItem) => {
            const med = docItem.data();

            const div = document.createElement("div");
            div.classList.add("medicine-item");

            div.innerHTML = `
                <h3>${med.name}</h3>
                <p>${med.description || "No description available"}</p>
                ${med.imageURL 
                    ? `<img src="${med.imageURL}" class="med-image">`
                    : `<p>No image</p>`}
            `;

            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = "❌ Failed to load medicines";
        console.error(err);
    }
}

loadMedicines();

// LOAD HEALTH TIPS
async function loadTips() {
    const container = document.getElementById("healthTipsList");
    container.innerHTML = "Loading...";

    try {
        const querySnapshot = await getDocs(collection(db, "tips"));

        container.innerHTML = "";

        querySnapshot.forEach((docItem) => {
            const tip = docItem.data();

            const div = document.createElement("div");
            div.classList.add("tip-item");

            div.textContent = tip.text;

            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = "❌ Failed to load tips";
        console.error(err);
    }
}

loadTips();
