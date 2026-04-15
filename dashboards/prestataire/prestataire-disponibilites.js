/* prestataire-disponibilites.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const upcoming = [
    { day:'12', month:'Mars', client:'Ferme du Soleil',  service:'Labour de précision',    heure:'09:00' },
    { day:'15', month:'Mars', client:'GAEC Les Plaines', service:'Installation irrigation', heure:'08:00' },
    { day:'18', month:'Mars', client:'Ferme Beaumont',   service:'Taille de vergers',       heure:'10:00' },
    { day:'20', month:'Mars', client:'SCA Val de Loire', service:'Semis drone',             heure:'07:00' },
  ];

  layout.innerHTML = getSidebarHTML('disponibilites') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Disponibilités</h1><p class="page-sub">Gérez votre planning et vos horaires de travail.</p></div>
      <div class="header-actions">
        <button class="btn-blue" id="btnSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <div class="dispo-layout">

      <!-- Calendar -->
      <div class="cal-card">
        <div class="cal-header">
          <h3 class="cal-title" id="calTitle"></h3>
          <div class="cal-nav">
            <button class="cal-nav-btn" id="calPrev"><i class="fa fa-chevron-left"></i></button>
            <button class="cal-nav-btn" id="calNext"><i class="fa fa-chevron-right"></i></button>
          </div>
        </div>
        <div class="cal-grid" id="calGrid"></div>
        <div class="cal-legend">
          <div class="legend-item"><div class="legend-dot dispo"></div> Disponible</div>
          <div class="legend-item"><div class="legend-dot occupee"></div> Occupé</div>
          <div class="legend-item"><div class="legend-dot libre"></div> Libre</div>
        </div>
      </div>

      <!-- Right panel -->
      <div class="dispo-panel">

        <!-- Horaires hebdo -->
        <div class="panel-card">
          <p class="panel-title">Horaires hebdomadaires</p>
          <div class="horaire-list">
            ${[
              {day:'Lundi',    h:'08:00 – 18:00', on:true},
              {day:'Mardi',    h:'08:00 – 18:00', on:true},
              {day:'Mercredi', h:'08:00 – 17:00', on:true},
              {day:'Jeudi',    h:'08:00 – 18:00', on:true},
              {day:'Vendredi', h:'08:00 – 17:00', on:true},
              {day:'Samedi',   h:'09:00 – 14:00', on:false},
              {day:'Dimanche', h:'Fermé',          on:false},
            ].map(h => `
              <div class="horaire-row">
                <span class="horaire-day">${h.day}</span>
                <span class="horaire-hours">${h.h}</span>
                <label class="horaire-toggle">
                  <input type="checkbox" ${h.on ? 'checked' : ''}/>
                  <span class="toggle-sl"></span>
                </label>
              </div>`).join('')}
          </div>
        </div>

        <!-- Bloquer une date -->
        <div class="panel-card">
          <p class="panel-title">Bloquer une période</p>
          <div style="display:flex;flex-direction:column;gap:12px">
            <div class="form-group"><label>Date de début</label><input type="date" id="dateDebut"/></div>
            <div class="form-group"><label>Date de fin</label><input type="date" id="dateFin"/></div>
            <div class="form-group"><label>Motif</label><input type="text" placeholder="Ex: Congés, Formation..."/></div>
            <button class="dispo-add-btn" id="btnBlock"><i class="fa fa-ban"></i> Bloquer cette période</button>
          </div>
        </div>

        <!-- Prochaines réservations -->
        <div class="panel-card">
          <p class="panel-title">Prochaines réservations</p>
          <div class="upcoming-list">
            ${upcoming.map(u => `
              <div class="upcoming-item">
                <div class="upcoming-date">
                  <span class="upcoming-day">${u.day}</span>
                  <span class="upcoming-month">${u.month}</span>
                </div>
                <div class="upcoming-info">
                  <div class="upcoming-client">${u.client}</div>
                  <div class="upcoming-svc">${u.service} · ${u.heure}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>

      </div>
    </div>
  </main>`;

  initSidebar('disponibilites');

  /* ---- Calendar ---- */
  let calY = new Date().getFullYear(), calM = new Date().getMonth();
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const occupiedDays = [12, 15, 18, 20];
  const dispoDays    = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 17];
  let selectedDays   = new Set();

  function renderCal() {
    document.getElementById('calTitle').textContent = months[calM] + ' ' + calY;
    const first = new Date(calY, calM, 1);
    const dow = (first.getDay() + 6) % 7;
    const dim = new Date(calY, calM + 1, 0).getDate();
    const today = new Date();
    const isCurrent = today.getFullYear() === calY && today.getMonth() === calM;

    let html = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d =>
      `<div class="cal-day-hd">${d}</div>`).join('');

    for (let i = 0; i < dow; i++) html += `<div class="cal-cell other"><div class="cal-num dim"></div></div>`;

    for (let d = 1; d <= dim; d++) {
      const isToday  = isCurrent && today.getDate() === d;
      const isOcc    = occupiedDays.includes(d);
      const isDispo  = dispoDays.includes(d);
      const isSel    = selectedDays.has(d);
      let cls = 'cal-cell';
      if (isOcc) cls += ' occupee';
      else if (isDispo) cls += ' dispo';
      if (isSel) cls += ' selected';

      html += `<div class="${cls}" data-day="${d}">
        <div class="cal-num ${isToday ? 'today' : ''}">${d}</div>
        ${isOcc  ? `<div class="cal-indicator blue"></div>` : ''}
        ${isDispo && !isOcc ? `<div class="cal-indicator green"></div>` : ''}
      </div>`;
    }
    document.getElementById('calGrid').innerHTML = html;

    /* Click to select */
    document.querySelectorAll('.cal-cell[data-day]').forEach(cell => {
      cell.addEventListener('click', () => {
        const d = parseInt(cell.dataset.day);
        if (selectedDays.has(d)) selectedDays.delete(d);
        else selectedDays.add(d);
        renderCal();
      });
    });
  }

  renderCal();
  document.getElementById('calPrev').addEventListener('click', () => { calM--; if (calM < 0) { calM = 11; calY--; } renderCal(); });
  document.getElementById('calNext').addEventListener('click', () => { calM++; if (calM > 11) { calM = 0; calY++; } renderCal(); });

  /* Save */
  document.getElementById('btnSave').addEventListener('click', function() {
    const orig = this.innerHTML;
    this.innerHTML = '<i class="fa fa-check"></i> Enregistré !';
    this.style.background = '#2e7d32';
    setTimeout(() => { this.innerHTML = orig; this.style.background = ''; showToast('Disponibilités enregistrées !'); }, 1500);
  });

  /* Block period */
  document.getElementById('btnBlock').addEventListener('click', () => {
    const debut = document.getElementById('dateDebut').value;
    const fin   = document.getElementById('dateFin').value;
    if (!debut || !fin) { showToast('Veuillez sélectionner les dates.', 'error'); return; }
    showToast('Période bloquée du ' + debut + ' au ' + fin + '.');
  });
});
