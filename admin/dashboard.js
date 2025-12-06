// admin/dashboard.js
import {
  auth,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "../firebase.js";

// helpers
const toastEl = document.getElementById("toast");
function toast(t){ toastEl.textContent = t; toastEl.style.display='block'; setTimeout(()=>toastEl.style.display='none', 2500); }

// Protect page
onAuthStateChanged(auth, async user => {
  if(!user){ window.location.href = "login.html"; return; }
  // optionally check admins collection exists (we checked at login), but re-check:
  const adm = localStorage.getItem("amah_admin");
  if(!adm){ await signOut(auth); window.location.href='login.html'; return; }
  initListeners();
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async ()=>{
  await signOut(auth);
  localStorage.removeItem("amah_admin");
  window.location.href = "login.html";
});

// ADD MEDICINE
document.getElementById("addMedBtn").addEventListener("click", async ()=>{
  const name = document.getElementById("medName").value.trim();
  const desc = document.getElementById("medDesc").value.trim();
  const file = document.getElementById("medImage").files[0];
  if(!name){ alert("Enter name"); return; }
  try{
    let imageURL = "";
    if(file){
      const path = `medicines/${Date.now()}_${file.name}`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file);
      imageURL = await getDownloadURL(r);
    }
    await addDoc(collection(db, "medicines"), { name, description: desc || "", imageURL, createdAt: Date.now() });
    toast("Medicine added");
    document.getElementById("medName").value=''; document.getElementById("medDesc").value=''; document.getElementById("medImage").value='';
  }catch(err){ console.error(err); toast("Add failed"); }
});

// ADD TIP
document.getElementById("addTipBtn").addEventListener("click", async ()=>{
  const t = document.getElementById("tipText").value.trim();
  if(!t){ alert("Enter tip text"); return; }
  try{
    await addDoc(collection(db, "tips"), { text: t, createdAt: Date.now() });
    toast("Tip added");
    document.getElementById("tipText").value='';
  }catch(err){ console.error(err); toast("Add tip failed"); }
});

// BACKUP
document.getElementById("downloadBackup").addEventListener("click", async ()=>{
  try{
    const medsSnap = await getDocs(collection(db, "medicines"));
    const tipsSnap = await getDocs(collection(db, "tips"));
    const data = { medicines: {}, tips: {} };
    medsSnap.forEach(d => data.medicines[d.id] = d.data());
    tipsSnap.forEach(d => data.tips[d.id] = d.data());
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='backup_data.json'; a.click();
    toast('Backup downloaded');
  }catch(err){ console.error(err); toast('Backup failed'); }
});

// RESTORE
document.getElementById("restoreBtn").addEventListener("click", async ()=>{
  const f = document.getElementById("restoreFile").files[0];
  if(!f){ alert('Choose file'); return; }
  try{
    const txt = await f.text();
    const data = JSON.parse(txt);
    if(data.medicines){
      // set every doc (overwrite)
      for(const id in data.medicines){
        await setDoc(doc(db, 'medicines', id), data.medicines[id]);
      }
    }
    if(data.tips){
      for(const id in data.tips){
        await setDoc(doc(db, 'tips', id), data.tips[id]);
      }
    }
    toast('Restore complete');
  }catch(err){ console.error(err); toast('Restore failed'); }
});

// Delete / Edit functions (exposed to window)
window.deleteMedicine = async (id, imageURL) => {
  if(!confirm('Delete this medicine?')) return;
  try{
    if(imageURL){
      // try remove image from storage (best-effort)
      try {
        const pathRef = storageRef(storage, imageURL);
        // deleteObject expects a storage reference; but we can't resolve from URL easily — skip deletion to avoid errors.
      } catch(e){ /* ignore */ }
    }
    await deleteDoc(doc(db, 'medicines', id));
    toast('Deleted');
  }catch(err){ console.error(err); toast('Delete failed'); }
};

window.editMedicine = async (id) => {
  const snap = await getDoc(doc(db,'medicines', id));
  if(!snap.exists()) return toast('Not found');
  const m = snap.data();
  const newName = prompt('Name', m.name);
  if(newName === null) return;
  const newDesc = prompt('Description', m.description || '');
  if(newDesc === null) return;
  try{
    await updateDoc(doc(db,'medicines', id), { name: newName, description: newDesc });
    toast('Updated');
  }catch(err){ console.error(err); toast('Update failed'); }
};

// Tips edit/delete
window.deleteTip = async (id) => {
  if(!confirm('Delete this tip?')) return;
  try{ await deleteDoc(doc(db, 'tips', id)); toast('Deleted'); }catch(e){ console.error(e); toast('Delete failed'); }
};
window.editTip = async (id) => {
  const snap = await getDoc(doc(db, 'tips', id)); if(!snap.exists()) return toast('Not found');
  const newText = prompt('Edit tip', snap.data().text); if(newText === null) return;
  try{ await updateDoc(doc(db,'tips', id), { text: newText }); toast('Updated'); }catch(e){ console.error(e); toast('Update failed'); }
};

// realtime listeners to populate lists and show confirm buttons
function initListeners(){
  const medList = document.getElementById("medList");
  const tipsList = document.getElementById("tipsList");

  onSnapshot(collection(db, 'medicines'), snapshot => {
    if(snapshot.empty){ medList.innerHTML = '<div class="muted">No medicines found.</div>'; return; }
    let html = '';
    snapshot.docs.slice().reverse().forEach(docu => {
      const m = docu.data();
      html += `<div class="item">
        <img src="${m.imageURL||''}" class="thumb" onerror="this.style.display='none'"/>
        <div style="flex:1">
          <b>${escapeHtml(m.name)}</b><div class="muted">${escapeHtml(m.description||'')}</div>
        </div>
        <div class="actions">
          <button class="btn small" onclick='editMedicine("${docu.id}")'>Edit</button>
          <button class="btn danger small" onclick='deleteMedicine("${docu.id}", "${m.imageURL||''}")'>Delete</button>
        </div>
      </div>`;
    });
    medList.innerHTML = html;
  });

  onSnapshot(collection(db, 'tips'), snapshot =>{
    if(snapshot.empty){ tipsList.innerHTML = '<div class="muted">No tips yet</div>'; return; }
    let html = '';
    snapshot.docs.slice().reverse().forEach(docu => {
      const t = docu.data();
      html += `<div class="item">
        <div style="flex:1">${escapeHtml(t.text)}</div>
        <div class="actions">
          <button class="btn small" onclick='editTip("${docu.id}")'>Edit</button>
          <button class="btn danger small" onclick='deleteTip("${docu.id}")'>Delete</button>
        </div>
      </div>`;
    });
    tipsList.innerHTML = html;
  });
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }


<script type="module" src="./scripts/dashboard.js"></script>
