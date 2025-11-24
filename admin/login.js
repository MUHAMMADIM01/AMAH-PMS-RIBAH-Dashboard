// login.js

document.getElementById("loginBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  // DEFAULT ADMIN CREDENTIALS
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "12345";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    alert("Login Successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect Username or Password!");
  }
});
