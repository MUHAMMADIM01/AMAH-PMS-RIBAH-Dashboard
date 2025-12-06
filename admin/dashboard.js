// admin/dashboard.js
// Dashboard full: add/edit/delete medicines & tips + upload images + backup/restore + toasts
import { auth, db, storage } from "../firebase.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

/* ---------- helpers: toast ---------- */
const toastEl = document.getElementById('toast');
function toast(msg){
  if(!toastEl) {
    alert(msg);
    return;
  }
  toastEl.textContent = msg;
  toastEl.style.display = 'block';
  setTimeout(()=> toastEl.style.display='none', 3000);
}

/* ---------- protect page ---------- */
onAuthStateChanged(auth, user => {
  if(!user){
    window.location.href = "../admin/login.html";
  }
});

/* ---------- elements ---------- */
const medName = document.getElementById('medName');
const medDesc = document.getElementById('medDesc');
const medPhoto = document.getElementById('medPhoto');
const addMedBtn = document.getElementById('addMedBtn');
const medList = document.getElementById('medList');

const tipTitle = document.getElementById('tipTitle');
const tipDesc = document.getElementById('tipDesc');
const addTipBtn = document.getElementById('addTipBtn');
const tipsList = document.getElementById('tipsList');

const downloadBackupBtn = document.getElementById('downloadBackup');
const restoreFileInput = document.getElementById('restoreFile');
const restoreBtn = document.getElementById('restoreBtn');
const logoutBtn = document.getElementById('logoutBtn');

/* ---------- collections ---------- */
const medsColRef = collection(db, 'medicines');
const tipsColRef = collection(db, 'tips');

/* ---------- ADD MEDICINE ---------- */
addMedBtn && addMedBtn.addEventListener('click', async () => {
  const name = medName?.value?.trim();
  const desc = medDesc?.value?.trim();
  const file = medPhoto?.files?.[0];

  if(!name || !desc) { toast('Fill name + description'); return; }

  try {
    let imageURL = '';
    if(file){
      const path = `med_images/${Date.now()}_${file.name}`;
      const sRef = storageRef(storage, path);
      const snap = await uploadBytes(sRef, file);
      imageURL = await getDownloadURL(snap.ref);
    }

    await addDoc(medsColRef, {
      name,
      description: desc,
      imageURL,
      createdAt: Date.now()
    });

    medName.value=''; medDesc.value=''; if(medPhoto) medPhoto.value = '';
    toast('Medicine added ✔');
  } catch(err) {
    console.error(err);
    toast('Add failed: ' + (err.message || err));
  }
});

/* ---------- RENDER MEDICINES (real-time) ---------- */
onSnapshot(medsColRef, snapshot => {
  if(!medList) return;
  medList.innerHTML = '';
  if(snapshot.empty){
    medList.innerHTML = '<div class="muted">No medicines found.</div>';
    return;
  }
  snapshot.forEach(docSnap => {
    const m = docSnap.data();
    const id = docSnap.id;
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <img src="${m.imageURL || ''}" class="thumb" onerror="this.style.display='none'"/>
      <div style="flex:1">
        <b>${escapeHtml(m.name)}</b>
        <div class="muted">${escapeHtml(m.description || '')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="small-btn edit" data-id="${id}">Edit</button>
        <button class="small-btn del" data-id="${id}">Delete</button>
      </div>
    `;
    medList.prepend(item);
  });

  // attach event listeners for edit/delete
  medList.querySelectorAll('.edit').forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      const newName = prompt('New name:');
      if(newName === null) return;
      const newDesc = prompt('New description:');
      if(newDesc === null) return;
      try {
        await updateDoc(doc(db, 'medicines', id), { name: newName, description: newDesc });
        toast('Medicine updated ✔');
      } catch(err){ console.error(err); toast('Update failed'); }
    };
  });
  medList.querySelectorAll('.del').forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.dataset.id;
      if(!confirm('Do you want to delete this medicine?')) return;
      try {
        await deleteDoc(doc(db, 'medicines', id));
        toast('Deleted ✔');
      } catch(err){ console.error(err); toast('Delete failed'); }
    };
  });
});

/* ---------- TIPS: add, render, edit, delete ---------- */
addTipBtn && addTipBtn.addEventListener('click', async () => {
  const title = tipTitle?.value?.trim();
  const desc = tipDesc?.value?.trim();
  if(!title || !desc){ toast('Fill tip title + description'); return; }
  try{
    await addDoc(tipsColRef, { title, description: desc, createdAt: Date.now() });
    tipTitle.value=''; tipDesc.value='';
    toast('Tip added ✔');
  }catch(err){ console.error(err); toast('Add tip failed'); }
});

onSnapshot(tipsColRef, snapshot => {
  if(!tipsList) return;
  tipsList.innerHTML = '';
  if(snapshot.empty){
    tipsList.innerHTML = '<div class="muted">No tips yet.</div>';
    return;
  }
  snapshot.forEach(docSnap => {
    const t = docSnap.data(); const id = docSnap.id;
    const div = document.createElement('div');
    div.className = 'list-item';
    // If you want an icon per tip, you can store an "icon" field; here we show small bullet:
    div.innerHTML = `
      <div style="flex:1">
        <b>${escapeHtml(t.title)}</b>
        <div class="muted">${escapeHtml(t.description || '')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="small-btn edit-tip" data-id="${id}">Edit</button>
        <button class="small-btn del-tip" data-id="${id}">Delete</button>
      </div>
    `;
    tipsList.prepend(div);
  });

  // events
  tipsList.querySelectorAll('.edit-tip').forEach(b => {
    b.onclick = async (e) => {
      const id = e.target.dataset.id;
      const snap = await getDocs(collection(db,'tips')); // not required, but simple
      const newTitle = prompt('New title:');
      if(newTitle === null) return;
      const newDesc = prompt('New description:');
      if(newDesc === null) return;
      try { await updateDoc(doc(db,'tips',id), { title: newTitle, description: newDesc }); toast('Tip updated ✔'); }
      catch(err){ console.error(err); toast('Tip update failed'); }
    };
  });
  tipsList.querySelectorAll('.del-tip').forEach(b => {
    b.onclick = async (e) => {
      const id = e.target.dataset.id;
      if(!confirm('Do you want to delete this tip?')) return;
      try { await deleteDoc(doc(db,'tips',id)); toast('Tip deleted ✔'); } catch(err){ console.error(err); toast('Delete failed'); }
    };
  });

});

/* ---------- BACKUP: download ---------- */
downloadBackupBtn && downloadBackupBtn.addEventListener('click', async () => {
  try{
    const medsSnap = await getDocs(medsColRef);
    const tipsSnap = await getDocs(tipsColRef);
    const data = { medicines: {}, tips: {} };
    medsSnap.forEach(d => data.medicines[d.id] = d.data());
    tipsSnap.forEach(d => data.tips[d.id] = d.data());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup_data.json';
    a.click();
    toast('Backup ready ✔');
  }catch(err){ console.error(err); toast('Backup failed'); }
});

/* ---------- RESTORE: file upload ---------- */
restoreBtn && restoreBtn.addEventListener('click', async () => {
  const f = restoreFileInput?.files?.[0];
  if(!f){ toast('Choose a backup file first'); return; }
  try{
    const txt = await f.text();
    const data = JSON.parse(txt);
    // medicines
    if(data.medicines){
      for(const id of Object.keys(data.medicines)){
        await setDoc(doc(db,'medicines', id), data.medicines[id]);
      }
    }
    if(data.tips){
      for(const id of Object.keys(data.tips)){
        await setDoc(doc(db,'tips', id), data.tips[id]);
      }
    }
    toast('Data restored ✔');
  }catch(err){ console.error(err); toast('Restore failed'); }
});

/* ---------- logout ---------- */
logoutBtn && (logoutBtn.onclick = ()=> signOut(auth).then(()=>{ localStorage.removeItem('adminLoggedIn'); window.location.href = "../admin/login.html"; }).catch(e=>{ console.error(e); toast('Logout failed'); }));

/* ---------- helper escape --------- */
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
