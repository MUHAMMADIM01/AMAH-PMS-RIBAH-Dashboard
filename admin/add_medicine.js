import { db, storage } from "../firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const nameInput = document.getElementById("medicineName");
const descInput = document.getElementById("medicineDesc");
const imageInput = document.getElementById("medicineImage");
const addBtn = document.getElementById("addMedicineBtn");

addBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const file = imageInput.files[0];

    if (!name || !description) {
        alert("Please fill all fields");
        return;
    }

    let imageURL = "";

    // Upload image if selected
    if (file) {
        const storageRef = ref(storage, `medicines/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageURL = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "medicines"), {
        name,
        description,
        imageURL
    });

    alert("Medicine added successfully!");
    nameInput.value = "";
    descInput.value = "";
    imageInput.value = "";
});
