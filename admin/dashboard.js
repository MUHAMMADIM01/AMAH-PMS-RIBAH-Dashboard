import { db, storage } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// -------------------------------
// ADD MEDICINE
// -------------------------------
window.addMedicine = async function () {
  const name = document.getElementById("medName").value.trim();
  const desc = document.getElementById("medDesc").value.trim();
  const file = document.getElementById("medicineImage").files[0];

  if (!name) {
    alert("Medicine name required");
    return;
  }

  let imageURL = "";

  if (file) {
    const storageRef = ref(storage, "medicines/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    imageURL = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "medicines"), {
    name,
    description: desc,
    image: imageURL,
  });

  alert("Medicine added successfully!");
  loadMedicines();
};

// -------------------------------
// LOAD MEDICINES
// -------------------------------
async function loadMedicines() {
  const list = document.getElementById("medicineList");
  list.innerHTML = "Loading...";

  const docsSnap = await getDocs(collection(db, "medicines"));

  if (docsSnap.empty) {
    list.innerHTML = "<p>No medicines found.</p>";
    return;
  }

  list.innerHTML = "";

  docsSnap.forEach((docSnap) => {
    const med = docSnap.data();

    list.innerHTML += `
      <div class="med-box">
        <h3>${med.name}</h3>
        <p>${med.description}</p>
        ${
          med.image
            ? `<img src="${med.image}" />`
            : `<p><i>No image</i></p>`
        }
        <div class="med-actions">
          <button onclick="deleteMedicine('${docSnap.id}', '${med.name}')">Delete</button>
        </div>
      </div>
    `;
  });
}

// -------------------------------
// DELETE MEDICINE (with confirmation)
// -------------------------------
window.deleteMedicine = async function (id, name) {
  const confirmDelete = confirm(`Do you want to delete "${name}"?`);
  if (!confirmDelete) return;

  await deleteDoc(doc(db, "medicines", id));
  alert("Medicine deleted!");
  loadMedicines();
};

loadMedicines();
