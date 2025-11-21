import {
  MedicinesCollection,
  addDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from "./firebase.js";

document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('medicineName').value.trim();
  const price = document.getElementById('medicinePrice').value.trim();
  const file = document.getElementById('medicineImage').files[0];

  if (!name || !price || !file) {
    alert("All fields including image are required!");
    return;
  }

  // Upload image to Firebase Storage
  const imageRef = ref(storage, `medicines/${Date.now()}_${file.name}`);
  await uploadBytes(imageRef, file);

  const imageUrl = await getDownloadURL(imageRef);

  // Save to Firestore
  await addDoc(MedicinesCollection, {
    name,
    price,
    imageUrl
  });

  alert("Medicine added successfully!");
  e.target.reset();
});
