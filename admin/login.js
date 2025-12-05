import { 
  auth, 
  signInWithEmailAndPassword,
  db,
  collection,
  getDoc,
  doc
} from "./firebase.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    // Step 1: Login attempt
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Check admin in /admins collection
    const adminRef = doc(collection(db, "admins"), user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      alert("Account is not an admin.");
      return;
    }

    // Step 3: Redirect to dashboard
    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error("Login Failed:", error);
    alert("Login failed: " + error.message);
  }
});
