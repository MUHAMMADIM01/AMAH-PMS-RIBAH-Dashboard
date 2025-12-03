// homepage.js (uses firebase.js)
import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// rotate tips array (keeps fallback)
const fallbackTips = [
  "Drink at least 8 glasses of water daily.",
  "Exercise Regularly.",
  "Get 7–8 hours of sleep every night.",
  "Avoid taking antibiotics without prescription.",
  "Eat fruits & vegetables to stay healthy."
];

let tipIndex = 0;
function rotateTipsArray(arr){
  const el = document.getElementById('current-tip');
  if(!el) return;
  el.textContent = arr[tipIndex] || '';
  tipIndex = (tipIndex + 1) % arr.length;
}
async function loadTips(){
  try{
    const q = query(collection(db,'tips'), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    const arr = [];
    snap.forEach(d => { const t = d.data(); if(t && t.text) arr.push(t.text); });
    const tips = arr.length ? arr : fallbackTips;
    rotateTipsArray(tips);
    setInterval(()=> rotateTipsArray(tips), 3000);
  }catch(err){
    console.error(err); // fallback
    rotateTipsArray(fallbackTips);
    setInterval(()=> rotateTipsArray(fallbackTips), 3000);
  }
}

async function loadMedicines(){
  const list = document.getElementById('medicineList');
  if(!list) return;
  list.innerHTML = 'Loading...';
  try{
    const q = query(collection(db,'medicines'), orderBy('createdAt','desc'));
    const snap = await getDocs(q);
    list.innerHTML = '';
    if(!snap.size){ list.innerHTML = '<div class="small-muted">No medicines</div>'; return; }
    snap.forEach(d=>{
      const m = d.data();
      const el = document.createElement('div'); el.className='medicine-card';
      el.innerHTML = `
        <h3>${m.name || ''}</h3>
        <p>${m.description || ''}</p>
        ${m.imageURL ? `<img src="${m.imageURL}" style="max-width:120px;border-radius:8px;margin-top:8px">` : `<p class="small-muted">No image</p>`}
      `;
      list.appendChild(el);
    });
  }catch(err){
    console.error(err); list.innerHTML = 'Load failed';
  }
}

loadTips();
loadMedicines();
