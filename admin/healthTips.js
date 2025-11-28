// Auto-rotate Tips
const tipsContainer = document.getElementById("tips-container");

let currentTip = 0;

function rotateTips() {
    const tipItems = document.querySelectorAll(".tip-item");
    if (tipItems.length === 0) return;

    tipItems.forEach((tip, index) => {
        tip.style.display = (index === currentTip) ? "block" : "none";
    });

    currentTip = (currentTip + 1) % tipItems.length;
}

setInterval(rotateTips, 5000); // Change every 5 seconds
rotateTips();
