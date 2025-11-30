import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// LOAD MEDICINES
async function loadMedicines() {
    const container = document.getElementById("medicineList");
    container.innerHTML = "Loading...";

    try {
        const querySnapshot = await getDocs(collection(db, "medicines"));

        container.innerHTML = ""; // Clear loading text

        querySnapshot.forEach((doc) => {
            const med = doc.data();

            const item = document.createElement("div");
            item.classList.add("medicine-item");

            item.innerHTML = `
                <h3>${med.name}</h3>
                <p>${med.desc}</p>
                ${med.imageURL ? `<img src="${med.imageURL}" class="med-image">` : ""}
            `;

            container.appendChild(item);
        });
    } catch (error) {
        container.innerHTML = "❌ Failed to load medicines";
        console.error(error);
    }
}

loadMedicines();

// LOAD HEALTH TIPS
async function loadTips() {
    const tipsContainer = document.getElementById("healthTipsList");
    tipsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "tips"));

    querySnapshot.forEach((doc) => {
        const tip = doc.data();

        const item = document.createElement("div");
        item.classList.add("tip-item");
        item.textContent = tip.text;

        tipsContainer.appendChild(item);
    });
}

loadTips();
