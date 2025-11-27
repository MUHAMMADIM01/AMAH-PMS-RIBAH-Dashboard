// homepage.js — show medicines and rotating tips using Firestore
import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log('homepage loaded');

const medListEl = document.getElementById('medicineList');
const tipsEl = document.getElementById('tipsList');

function showNoMeds(){
  medListEl.innerHTML = '<div>No medicines uploaded yet.</div>';
}
function showNoTips(){
  tipsEl.innerHTML = '<div>No health tips yet.</div>';
}

// listen medicines collection
try {
  const medsCol = collection(db, 'medicines');
  const medsQuery = query(medsCol, orderBy('createdAt', 'desc'));
  onSnapshot(medsQuery, snapshot => {
    if(snapshot.empty){ showNoMeds(); return; }
    const items = [];
    snapshot.forEach(doc => {
      const d = doc.data();
      items.push(`<div class="medicine-card">
        <img src="${d.image || 'https://via.placeholder.com/140'}" alt="${d.name}">
        <h3>${escapeHtml(d.name)}</h3>
        <p>${escapeHtml(d.description || '')}</p>
      </div>`);
    });
    medListEl.innerHTML = items.join('');
  }, err => {
    console.error('meds onSnapshot', err);
    showNoMeds();
  });
} catch(e){
  console.error(e);
  showNoMeds();
}

// tips: simple rotate from 'tips' collection
let tipsArr = [];
let tipIndex = 0;
try {
  const tipsCol = collection(db, 'tips');
  onSnapshot(tipsCol, snapshot => {
    tipsArr = [];
    snapshot.forEach(d => tipsArr.push(d.data().text || ''));
    if(tipsArr.length === 0) { showNoTips(); return; }
    tipIndex = 0;
    tipsEl.innerHTML = `<div>💡 ${escapeHtml(tipsArr[0])}</div>`;
  });
} catch(e){
  console.error(e);
  showNoTips();
}

setInterval(() => {
  if(!tipsArr || tipsArr.length === 0) return;
  tipIndex = (tipIndex + 1) % tipsArr.length;
  tipsEl.innerHTML = `<div>💡 ${escapeHtml(tipsArr[tipIndex])}</div>`;
}, 4000);

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
