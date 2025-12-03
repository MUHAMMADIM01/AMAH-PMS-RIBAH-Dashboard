// ROTATING HEALTH TIPS (frontend-only)
const tips = [
  "Drink at least 8 glasses of water daily.",
  "Exercise Regularly.",
  "Get 7–8 hours of sleep every night.",
  "Avoid taking antibiotics without prescription.",
  "Eat fruits & vegetables to stay healthy."
];

let tipIndex = 0;
function rotateTips() {
  const el = document.getElementById("current-tip");
  if (!el) return;
  el.textContent = tips[tipIndex];
  tipIndex = (tipIndex + 1) % tips.length;
}
rotateTips();
setInterval(rotateTips, 3000);

// SIMPLE SEARCH (filter client-side)
const searchBox = document.getElementById("searchBox");
if (searchBox) {
  searchBox.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".medicine-card");
    cards.forEach(card => {
      const title = (card.querySelector("h3") || {textContent:""}).textContent.toLowerCase();
      const desc  = (card.querySelector("p") || {textContent:""}).textContent.toLowerCase();
      const show = title.includes(q) || desc.includes(q);
      card.style.display = show ? "block" : "none";
    });
  });
}
