import { auth } from "./firebase.js";
import { getDatabase, ref, push, set, update, remove, onValue }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const db = getDatabase();

// ADD MEDICINE
export function addMedicine(name, price, description, imageUrl) {
    const medRef = push(ref(db, "medicines/"));
    set(medRef, {
        name: name,
        price: price,
        description: description,
        image: imageUrl
    }).then(() => {
        alert("✔ Medicine added successfully!");
    });
}

// DELETE MEDICINE
export function deleteMedicine(id) {
    remove(ref(db, "medicines/" + id))
    .then(() => {
        alert("🗑 Deleted successfully!");
    });
}

// UPDATE MEDICINE
export function editMedicine(id, dataUpdate) {
    update(ref(db, "medicines/" + id), dataUpdate)
    .then(() => {
        alert("✔ Updated successfully!");
    });
}

// LOAD MEDICINES LIST
export function loadMedicines(callback) {
    onValue(ref(db, "medicines/"), (snapshot) => {
        callback(snapshot.val());
    });
}
