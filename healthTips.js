let currentTip = 0;

function rotateTips() {
    const tips = document.querySelectorAll(".tip-item");
    if (tips.length === 0) return;

    // Hide all
    tips.forEach(t => t.style.display = "none");

    // Show current one
    tips[currentTip].style.display = "block";

    // Move to next
    currentTip = (currentTip + 1) % tips.length;
}

// Start rotation every 4 seconds
setInterval(rotateTips, 4000);
