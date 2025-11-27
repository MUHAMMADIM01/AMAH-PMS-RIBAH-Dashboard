// admin.js — protected dashboard logic
import { auth, db, storage } from '../firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { doc as docRef, getDoc as getDocFn } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const medListEl = document.getElementById('medList');
const tipsListEl = document.getElementById('tipsList');

function toast(msg){ alert(msg); }

// require login and admin flag in 'admins' collection
onAuthStateChanged(auth, async (user) => {
  if(!user) { window.location.href = 'login.html'; return; }
  // check admins collection
  try{
    const adminDoc = await getDocFn(docRef(db, 'admins', user.uid));
    if(!adminDoc.exists()){
      await signOut(auth);
      alert('Your account is not an admin. Contact owner.');
      window.location.href = 'login.html';
      return;
    }
    // load lists
    startMedicinesListener();
    startTipsListener();
  }catch(err){
    console.error(err);
    alert('Error checking admin: '+err.message);
    await signOut(auth);
    window.location.href = 'login.html';
  }
});

// add medicine
document.getElementById('addMedBtn').addEventListener('click', async () => {
  const name = document.getElementById('medName').value.trim();
  const desc = document.getElementById('medDesc').value.trim();
  const file = document.getElementById('medPhoto').files[0];
  if(!name){ toast('Name required'); return; }
  try{
    let imageUrl = '';
    if(file){
      const path = 'medicines/' + Date.now() + '_' + file.name;
      const sref = sRef(storage, path);
      await uploadBytes(sref, file);
      imageUrl = await getDownloadURL(sref);
    }
    const col = collection(db, 'medicines');
    await addDoc(col, { name, description: desc, image: imageUrl, createdAt: Date.now() });
    document.getElementById('medName').value=''; document.getElementById('medDesc').value=''; document.getElementById('medPhoto').value='';
    toast('Medicine added');
  }catch(err){
    console.error(err);
    toast('Add failed: '+ (err.message||err.code));
  }
});

// add tip
document.getElementById('addTipBtn').addEventListener('click', async () => {
  const t = document.getElementById('tipText').value.trim();
  if(!t){ toast('Enter tip'); return; }
  try{
    const col = collection(db, 'tips');
    await addDoc(col, { text: t, createdAt: Date.now() });
    document.getElementById('tipText').value='';
    toast('Tip added');
  }catch(err){ console.error(err); toast('Tip add failed'); }
});

function startMedicinesListener(){
  const col = collection(db, 'medicines');
  const q = query(col, orderBy('createdAt', 'desc'));
  onSnapshot(q, snapshot => {
    if(snapshot.empty){ medListEl.innerHTML = '<div>No medicines</div>'; return; }
    const html = [];
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const id = docSnap.id;
      html.push(`<div style="display:flex;gap:12px;align-items:center;border:1px solid #eef;margin-bottom:8px;padding:8px;border-radius:8px">
        <img src="${d.image||''}" style="width:84px;height:64px;object-fit:cover;border-radius:6px" onerror="this.style.display='none'">
        <div style="flex:1">
          <b>${escapeHtml(d.name)}</b><div style="color:#667">${escapeHtml(d.description||'')}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button onclick="window.editMed('${id}')">Edit</button>
          <button style="background:#e04b4b;color:#fff" onclick="window.deleteMed('${id}')">Delete</button>
        </div>
      </div>`);
    });
    medListEl.innerHTML = html.join('');
  }, err => { console.error(err); medListEl.innerHTML = '<div>Error loading medicines</div>'; });
}

function startTipsListener(){
  const col = collection(db, 'tips');
  const q = query(col, orderBy('createdAt', 'desc'));
  onSnapshot(q, snapshot => {
    if(snapshot.empty){ tipsListEl.innerHTML = '<div>No tips</div>'; return; }
    const html = [];
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const id = docSnap.id;
      html.push(`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #eef;margin-bottom:8px;border-radius:6px">
        <div>${escapeHtml(d.text)}</div>
        <div style="display:flex;gap:6px">
          <button onclick="window.editTip('${id}')">Edit</button>
          <button style="background:#e04b4b;color:#fff" onclick="window.deleteTip('${id}')">Delete</button>
        </div>
      </div>`);
    });
    tipsListEl.innerHTML = html.join('');
  }, err => { console.error(err); tipsListEl.innerHTML = '<div>Error loading tips</div>'; });
}

// expose edit/delete functions
from firestore import doc as DOC
# placeholder to keep file valid JS (actual functions below)
# end of file
