// Load medicines (name + image only)
db.ref("medicines").on("value", snap => {
  const box = document.getElementById("medicineList");
  box.innerHTML = "";

  const data = snap.val();
  if (!data) {
    box.innerHTML = "<p>No medicines yet.</p>";
    return;
  }

  Object.values(data).forEach(med => {
    box.innerHTML += `
      <div class="med-box">
        <img src="${med.image || ''}" />
        <h4>${med.name}</h4>
      </div>
    `;
  });
});

// Load health tips
db.ref("tips").on("value", snap => {
  const area = document.getElementById("tipsList");
  area.innerHTML = "";

  const data = snap.val();
  if (!data) {
    area.innerHTML = "<p>No health tips yet.</p>";
    return;
  }

  Object.values(data).forEach(tip => {
    area.innerHTML += `
      <div class="tip">
        <h4>${tip.title}</h4>
        <p>${tip.description}</p>
      </div>
    `;
  });
});
