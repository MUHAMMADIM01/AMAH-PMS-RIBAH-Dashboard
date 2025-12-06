// homepage.js
import { db, collection, onSnapshot, getDocs } from "./firebase.js";

// render medicines
const medListEl = document.getElementById("medicineList");
const searchInput = document.getElementById("searchInput");

let medicines = [];

function renderMedicines(filter=''){
  const f = filter.trim().toLowerCase();
  if(medicines.length === 0){ medListEl.innerHTML = '<div class="muted">No medicines yet</div>'; return; }
  const filtered = medicines.filter(m => !f || m.name.toLowerCase().includes(f));
  medListEl.innerHTML = filtered.map(m => `
    <div class="medicine-card">
      ${m.imageURL ? `<img src="${m.imageURL}" class="med-img" onerror="this.style.display='none'">` : `<div class="noimg">No image</div>`}
      <h3>${escapeHtml(m.name)}</h3>
      <p class="muted">${escapeHtml(m.description || '')}</p>
    </div>
  `).join('');
}

// realtime medicines (onSnapshot)
onSnapshot(collection(db, 'medicines'), snapshot => {
  const arr = [];
  snapshot.forEach(doc => {
    arr.push({ id: doc.id, ...doc.data() });
  });
  medicines = arr.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  renderMedicines(searchInput.value || '');
});

// health tips rotating
let tips = [];
const currentTipEl = document.getElementById('currentTip');
let tipIndex = 0;

onSnapshot(collection(db, 'tips'), snapshot => {
  tips = [];
  snapshot.forEach(d => tips.push(d.data().text));
  if(tips.length === 0){ currentTipEl.textContent = 'No tips yet'; return; }
  tipIndex = 0;
  currentTipEl.textContent = tips[0];
});

// rotate
setInterval(()=>{
  if(tips.length === 0) return;
  tipIndex = (tipIndex + 1) % tips.length;
  currentTipEl.textContent = tips[tipIndex];
}, 4000);

// search
searchInput.addEventListener('input', e => renderMedicines(e.target.value));

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
