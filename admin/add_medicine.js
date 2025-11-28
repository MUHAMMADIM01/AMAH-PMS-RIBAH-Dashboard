import { db, storage } from "../firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.getElementById("addBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const imageFile = document.getElementById("medImage").files[0];

    if (!name || !desc) {
        alert("Please fill all fields");
        return;
    }

    let imageURL = "";

    // Idan akwai hoto → upload
    if (imageFile) {
        const imgRef = ref(storage, "medicine_images/" + Date.now() + "_" + imageFile.name);
        await uploadBytes(imgRef, imageFile);
        imageURL = await getDownloadURL(imgRef);
    }

    // Save zuwa Firestore
    await addDoc(collection(db, "medicines"), {
        name,
        desc,
        imageURL
    });

    alert("Medicine Added Successfully!");
});
