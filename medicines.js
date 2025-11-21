import { db, storage } from "./firebase.js";
import {
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import {
  ref as sRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";


// ========== UPLOAD NEW MEDICINE ==========
const form = document.getElementById("addForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const photo = document.getElementById("photo").files[0];

  if (!name || !price || !photo) {
    alert("All fields are required.");
    return;
  }

  const imgRef = sRef(storage, "medicines/" + Date.now() + "-" + photo.name);

  // Upload image
  await uploadBytes(imgRef, photo);
  const url = await getDownloadURL(imgRef);

  // Save to database
  const medRef = push(ref(db, "medicines/"));
  await set(medRef, {
    name,
    price,
    image: url
  });

  alert("Medicine added successfully!");
  form.reset();
});


// ========== DISPLAY MEDICINES ==========
const list = document.getElementById("medicineList");

onValue(ref(db, "medicines/"), (snapshot) => {
  list.innerHTML = "";

  snapshot.forEach((child) => {
    const med = child.val();

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${med.image}" alt="${med.name}" />
      <h4>${med.name}</h4>
      <p>₦${med.price}</p>
    `;

    list.appendChild(card);
  });
});
