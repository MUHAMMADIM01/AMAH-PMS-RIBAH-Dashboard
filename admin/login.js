// admin-login.js

document.getElementById("loginBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  // DEFAULT ADMIN LOGIN
  const correctUser = "admin";
  const correctPass = "12345";

  if (username === correctUser && password === correctPass) {
    alert("Login Successful!");
    window.location.href = "dashboard.html"; // Admin page
  } else {
    alert("Incorrect Username or Password!");
  }
});
