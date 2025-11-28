import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// LOAD HEALTH TIPS
async function loadTips() {
    const tipsContainer = document.getElementById("healthTipsList");
    tipsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "tips"));

    querySnapshot.forEach((doc) => {
        const tip = doc.data();

        const item = document.createElement("div");
        item.classList.add("tip-item");  // ← MUHIMMI
        item.textContent = tip.text;

        tipsContainer.appendChild(item);
    });
}

loadTips();
