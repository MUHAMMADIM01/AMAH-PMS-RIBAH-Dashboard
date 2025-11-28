// SIMPLE ADMIN SECURITY
const ADMIN_USER = "MIMUHAMMDU";
const ADMIN_PASS = "ImM@115204122";  // Ka sauya bayan ka gwada

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        msg.style.color = "green";
        msg.innerHTML = "Login successful! Redirecting...";

        // Save login state
        localStorage.setItem("isAdmin", "true");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } else {
        msg.style.color = "red";
        msg.innerHTML = "Incorrect username or password!";
    }
}
