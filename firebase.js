<!-- FIREBASE SDK -->
<script type="module">
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

  // Your Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyBqXjy7ogO8qMCsfuYB61yBpZJpKKKGhqk",
    authDomain: "amahmedicinestore-be61b.firebaseapp.com",
    databaseURL: "https://amahmedicinestore-be61b-default-rtdb.firebaseio.com",
    projectId: "amahmedicinestore-be61b",
    storageBucket: "amahmedicinestore-be61b.firebasestorage.app",
    messagingSenderId: "740301709370",
    appId: "1:740301709370:web:9fd66894daa25bd85b1503",
    measurementId: "G-NV6KNSM3CV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Export services
  window.auth = getAuth(app);
  window.db = getFirestore(app);
  window.storage = getStorage(app);
</script>
