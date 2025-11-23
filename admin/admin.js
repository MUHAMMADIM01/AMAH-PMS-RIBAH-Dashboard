// SECURITY CHECK FOR ADMIN PAGES
if (location.pathname.includes("admin") && !location.pathname.includes("login.html")) {
  if (localStorage.getItem("isAdmin") !== "true") {
    window.location.href = "login.html";
  }
}

import { db } from "../firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// LOGIN SYSTEM
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = username.value.trim();
    const p = password.value.trim();

    if (u === "admin" && p === "12345") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "dashboard.html";
    } else {
      alert("Incorrect login");
    }
  });
}

// LOGOUT
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
  };
}

// ADD MEDICINE
const medForm = document.getElementById("medForm");
if (medForm) {
  medForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    if (!name) return alert("Enter medicine name");

    await addDoc(collection(db, "medicines"), { name });

    alert("Medicine added successfully!");
    medForm.reset();
  });
}
