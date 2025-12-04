// homepage.js
console.log("Homepage loaded.");

// --- HEALTH TIPS ROTATION ---
const tips = [
  "Drink at least 8 glasses of water daily.",
  "Exercise regularly to boost your health.",
  "Get 7–8 hours of sleep every night.",
  "Avoid taking antibiotics without prescription.",
  "Eat fruits and vegetables daily.",
];

let tipIndex = 0;

function rotateTips() {
  const tipBox = document.getElementById("current-tip");

  if (!tipBox) {
    console.log("Tip element not found.");
    return;
  }

  tipBox.textContent = tips[tipIndex];
  tipIndex = (tipIndex + 1) % tips.length;
}

document.addEventListener("DOMContentLoaded", () => {
  rotateTips();              // show first tip
  setInterval(rotateTips, 3000); // rotate every 3 seconds
});
