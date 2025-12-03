// dashboard.js
import { auth, db, storage } from "../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, doc, deleteDoc, onSnapshot, query, orderBy, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// page elements
const medSection = document.getElementById('medSection');
const tipSection = document.getElementById('tipSection');
const manageMedsBtn = document.getElementById('manageMeds');
const manageTipsBtn = document.getElementById('manageTips');
const logoutBtn = document.getElementById('logoutBtn');

const medNameEl = document.getElementById('medName');
const medDescEl = document.getElementById('medDesc');
const medImageEl = document.getElementById('medImage');
const addMedBtn = document.getElementById('addMedBtn');
const medListEl = document.getElementById('medList');

const tipTextEl = document.getElementById('tipText');
const tipImageEl = document.getElementById('tipImage');
const addTipBtn = document.getElementById('addTipBtn');
const tipListEl = document.getElementById('tipList');

// protect route — only signed-in admins allowed
onAuthStateChanged(auth, async user => {
  if(!user) { window.location.href = 'login.html'; return; }

  // Optionally check admins collection (already done in login)
  // Now setup listeners
  loadMedicinesRealtime();
  loadTipsRealtime();
});

// toggle sections
manageMedsBtn.onclick = ()=> { medSection.style.display='block'; tipSection.style.display='none'; };
manageTipsBtn.onclick = ()=> { medSection.style.display='none'; tipSection.style.display='block'; };
logoutBtn.onclick = async ()=> { await signOut(auth); window.location.href='login.html'; };

// ADD MEDICINE
addMedBtn.onclick = async () => {
  const name = medNameEl.value.trim();
  const desc = medDescEl.value.trim();
  const file = medImageEl.files[0];

  if(!name){ alert('Name required'); return; }

  try {
    let imageURL = "";
    if(file){
      const path = `medicines/${Date.now()}_${file.name}`;
      const snap = await uploadBytes(sRef(storage, path), file);
      imageURL = await getDownloadURL(snap.ref);
    }

    await addDoc(collection(db, 'medicines'), {
      name, description: desc || "", imageURL: imageURL || "", createdAt: Date.now()
    });

    medNameEl.value=''; medDescEl.value=''; medImageEl.value='';
    alert('Medicine added successfully!');
  } catch(err){
    console.error(err); alert('Add failed: '+ (err.message||err.code));
  }
};

// DELETE medicine with confirmation
window.deleteMedicine = async (id) => {
  if(!confirm('Do you want to delete this medicine?')) return;
  try {
    await deleteDoc(doc(db, 'medicines', id));
    alert('Deleted');
  } catch(err){ console.error(err); alert('Delete failed'); }
};

// EDIT - simple prompt based
window.editMedicine = async (id, currentName, currentDesc) => {
  const newName = prompt('Name', currentName);
  if(newName === null) return;
  const newDesc = prompt('Description', currentDesc||'');
  if(newDesc === null) return;
  try {
    await updateDoc(doc(db, 'medicines', id), { name:newName, description:newDesc });
    alert('Updated');
  } catch(err){ console.error(err); alert('Update failed'); }
};

// Realtime medicines listener
function loadMedicinesRealtime(){
  const q = query(collection(db, 'medicines'), orderBy('createdAt','desc'));
  onSnapshot(q, snap => {
    if(!snap.size){ medListEl.innerHTML = '<div class="small-muted">No medicines</div>'; return; }
    medListEl.innerHTML = '';
    snap.forEach(docSnap=>{
      const m = docSnap.data();
      const id = docSnap.id;
      const el = document.createElement('div');
      el.className = 'list-row';
      el.innerHTML = `
        <b>${escapeHtml(m.name)}</b>
        <div class="small-muted">${escapeHtml(m.description||'')}</div>
        ${m.imageURL ? `<img src="${m.imageURL}" style="max-width:120px;margin-top:8px;border-radius:6px">` : `<div class="small-muted" style="margin-top:8px">No image</div>`}
        <div class="row-actions">
          <button onclick="editMedicine('${id}', ${JSON.stringify(m.name)}, ${JSON.stringify(m.description||'')})" class="hero-btn">Edit</button>
          <button onclick="deleteMedicine('${id}')" class="hero-btn danger">Delete</button>
        </div>
      `;
      medListEl.appendChild(el);
    });
  }, err=>{ console.error(err); medListEl.innerHTML = 'Load error';});
}

// ---------- TIPS ----------

addTipBtn.onclick = async ()=>{
  const text = tipTextEl.value.trim();
  const file = tipImageEl.files[0];
  if(!text){ alert('Enter tip text'); return; }

  try {
    let imageURL = "";
    if(file){
      const path = `tips/${Date.now()}_${file.name}`;
      const snap = await uploadBytes(sRef(storage, path), file);
      imageURL = await getDownloadURL(snap.ref);
    }

    await addDoc(collection(db,'tips'), {
      text, imageURL: imageURL||"", createdAt: Date.now()
    });
    tipTextEl.value=''; tipImageEl.value='';
    alert('Tip added');
  } catch(err){ console.error(err); alert('Add tip failed'); }
};

window.deleteTip = async (id) => {
  if(!confirm('Do you want to delete this tip?')) return;
  try{ await deleteDoc(doc(db,'tips',id)); alert('Deleted'); } catch(err){ console.error(err); alert('Delete failed'); }
};

window.editTip = async (id, curText) => {
  const nt = prompt('Tip text', curText || '');
  if(nt === null) return;
  try{ await updateDoc(doc(db,'tips',id), { text: nt }); alert('Updated'); } catch(err){ console.error(err); alert('Update failed'); }
};

function loadTipsRealtime(){
  const q = query(collection(db,'tips'), orderBy('createdAt','desc'));
  onSnapshot(q, snap => {
    if(!snap.size){ tipListEl.innerHTML = '<div class="small-muted">No tips</div>'; return; }
    tipListEl.innerHTML = '';
    snap.forEach(docSnap=>{
      const t = docSnap.data(); const id = docSnap.id;
      const el = document.createElement('div'); el.className='list-row';
      el.innerHTML = `
        <div>${escapeHtml(t.text)}</div>
        ${t.imageURL ? `<img src="${t.imageURL}" style="max-width:120px;margin-top:8px;border-radius:6px">` : `<div class="small-muted" style="margin-top:8px">No image</div>`}
        <div class="row-actions">
          <button onclick="editTip('${id}', ${JSON.stringify(t.text)})" class="hero-btn">Edit</button>
          <button onclick="deleteTip('${id}')" class="hero-btn danger">Delete</button>
        </div>
      `;
      tipListEl.appendChild(el);
    });
  }, err=>{ console.error(err); tipListEl.innerHTML = 'Load error';});
}

// small helper
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
