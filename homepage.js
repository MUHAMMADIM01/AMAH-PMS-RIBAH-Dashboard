// homepage.js
import { db } from "./firebase.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* medicines render */
const medContainer = document.getElementById('medicineList');
const tipsContainer = document.getElementById('healthTipsList');
const tipsSliderText = document.getElementById('current-tip'); // if using slider

// render medicines real-time
const medsQ = query(collection(db,'medicines'), orderBy('createdAt','desc'));
onSnapshot(medsQ, snapshot => {
  if(!medContainer) return;
  medContainer.innerHTML = '';
  if(snapshot.empty){ medContainer.innerHTML = '<p>No medicines available yet.</p>'; return; }
  snapshot.forEach(docSnap => {
    const m = docSnap.data();
    const el = document.createElement('div');
    el.className = 'medicine-card';
    el.innerHTML = `
      ${ m.imageURL ? `<img src="${m.imageURL}" alt="${escapeHtml(m.name)}">` : `<div style="height:120px;background:#f0f0f0;border-radius:8px"></div>` }
      <h3>${escapeHtml(m.name)}</h3>
      <p>${escapeHtml(m.description || '')}</p>
      <button class="btn-cart">🛒 Order</button>
    `;
    medContainer.appendChild(el);
  });
});

// render tips and rotating
let tipsArr = [];
const tipsQ = query(collection(db,'tips'), orderBy('createdAt','desc'));
onSnapshot(tipsQ, snap => {
  tipsArr = [];
  if(!tipsContainer) return;
  tipsContainer.innerHTML = '';
  if(snap.empty){
    tipsContainer.innerHTML = '<p><em>No health tips yet.</em></p>';
    return;
  }
  snap.forEach(d => {
    const t = d.data();
    // if you store an "icon" field, show it: t.icon
    const icon = t.icon || '💡';
    tipsArr.push(`${icon} ${t.title || t.text || ''} — ${t.description || ''}`);
  });
  // immediate show first
  if(tipsArr.length > 0) {
    let idx = 0;
    if(document.getElementById('current-tip')){
      document.getElementById('current-tip').textContent = tipsArr[0];
    } else {
      // fallback: render all
      tipsContainer.innerHTML = tipsArr.map(x => `<div class="tips-box">${escapeHtml(x)}</div>`).join('');
    }
    // start rotating
    clearInterval(window._tipsIntervalId);
    window._tipsIntervalId = setInterval(()=> {
      idx = (idx + 1) % tipsArr.length;
      if(document.getElementById('current-tip')) document.getElementById('current-tip').textContent = tipsArr[idx];
    }, 4000);
  }
});

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
