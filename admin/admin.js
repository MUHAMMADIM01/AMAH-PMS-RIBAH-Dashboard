// ============================
//  IMPORT FIREBASE
// ============================
import { db } from "../firebase.js";
import { 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================
//  GET FORM ELEMENTS
// ============================
const form = document.getElementById("addMedicineForm");
const nameInput = document.getElementById("medicineName");

// Check if form exists
if (!form) {
  console.log("Form not found on this page.");
}

// ============================
//  SUBMIT FORM
// ============================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();

    // Check empty input
    if (name === "") {
      alert("Please enter a medicine name");
      return;
    }

    console.log("Firebase DB:", db);  // Check DB

    // Firestore collection reference
    const colRef = collection(db, "medicines");

    // Add to Firestore
    addDoc(colRef, { name })
      .then(() => {
        console.log("Document added successfully!");
        alert("Medicine Added Successfully!");
        form.reset();
      })
      .catch((error) => {
        console.log("Error adding document:", error);
        alert("Error: " + error.message);
      });
  });
}
