/* prestataire-reservations.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const reservations = [
    { id:'RES-001', client:'Ferme du Soleil',   service:'Labour de précision',    date:'12 Mars 2024', heure:'09:00', duree:'1 jour',  montant:'150€',  status:'confirme' },
    { id:'RES-002', client:'GAEC Les Plaines',  service:'Installation irrigation', date:'15 Mars 2024', heure:'08:00', duree:'3 jours', montant:'1200€', status:'en-cours' },
    { id:'RES-003', client:'Jean Martin',       service:'Conseil sol',             date:'10 Mars 2024', heure:'14:00', duree:'2h',      montant:'80€',   status:'termine' },
    { id:'RES-004', client:'SCA Val de Loire',  service:'Semis drone',             date:'20 Mars 2024', heure:'07:00', duree:'1 jour',  montant:'250€',  status:'attente' },
    { id:'RES-005', client:'Ferme Beaumont',    service:'Taille de vergers',       date:'18 Mars 2024', heure:'10:00', duree:'2 jours', montant:'90€',   status:'confirme' },
    { id:'RES-006', client:'Coop Agricole 34',  service:'Analyse de sol',          date:'22 Mars 2024', heure:'11:00', duree:'1 jour',  montant:'85€',   status:'attente' },
  ];

  const labelMap = { confirme:'Confirmé', 'en-cours':'En cours', termine:'Terminé', attente:'En attente', refuse:'Refusé' };

  function renderTable(data) {
    document.getElementById('resBody').innerHTML = data.map(r => `
      <tr>
        <td><div class="item-with-icon"><div class="item-icon blue"><i class="fa fa-user"></i></div>
          <div><span class="bold">${r.client}</span><br><small style="color:var(--text-muted);font-size:.72rem">${r.id}</small></div>
        </div></td>
        <td class="muted">${r.service}</td>
        <td class="muted">${r.date}</td>
        <td class="muted">${r.heure}</td>
        <td class="amount">${r.montant}</td>
        <td><span class="badge ${r.status}">${labelMap[r.status]}</span></td>
        <td style="text-align:right">
          <button class="action-btn btn-detail" data-id="${r.id}" title="Détails"><i class="fa fa-eye"></i></button>
        </td>
      </tr>`).join('');
  }

  layout.innerHTML = getSidebarHTML('reservations') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Réservations</h1><p class="page-sub">Gérez toutes les demandes de vos clients.</p></div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="viewList" title="Liste"><i class="fa fa-list"></i></button>
          <button class="view-btn" id="viewCal" title="Calendrier"><i class="fa fa-calendar"></i></button>
        </div>
        <div class="avatar">MP</div>
      </div>
    </header>

    <div class="summary-grid">
      <div class="summary-card"><div><p class="sc-label">Total</p><h3 class="sc-value">128</h3></div><div class="sc-icon blue"><i class="fa fa-calendar-check"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">En attente</p><h3 class="sc-value">6</h3></div><div class="sc-icon gold"><i class="fa fa-clock"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">Confirmées</p><h3 class="sc-value">112</h3></div><div class="sc-icon green"><i class="fa fa-circle-check"></i></div></div>
      <div class="summary-card"><div><p class="sc-label">Refusées</p><h3 class="sc-value">10</h3></div><div class="sc-icon red"><i class="fa fa-circle-xmark"></i></div></div>
    </div>

    <div class="toolbar">
      <div class="toolbar-search"><i class="fa fa-search"></i><input type="text" id="searchRes" placeholder="Rechercher un client ou un service..."/></div>
      <div class="toolbar-right">
        <select class="btn-outline" id="filterStatus" style="padding:10px 14px">
          <option value="">Tous les statuts</option>
          <option value="confirme">Confirmées</option>
          <option value="attente">En attente</option>
          <option value="en-cours">En cours</option>
          <option value="termine">Terminées</option>
        </select>
      </div>
    </div>

    <div class="filter-tabs">
      <button class="filter-tab active" data-s="">Toutes (128)</button>
      <button class="filter-tab" data-s="confirme">Confirmées (112)</button>
      <button class="filter-tab" data-s="attente">En attente (6)</button>
      <button class="filter-tab" data-s="en-cours">En cours (2)</button>
    </div>

    <!-- List view -->
    <div id="listView">
      <div class="table-card">
        <div class="table-card-header"><h3>Liste des réservations</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Client</th><th>Service</th><th>Date</th><th>Heure</th><th>Montant</th><th>Statut</th><th style="text-align:right">Action</th></tr></thead>
            <tbody id="resBody"></tbody>
          </table>
        </div>
        <div class="table-footer-bar">
          <span class="result-count" id="resCount">6 réservations</span>
          <div class="pagination"><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button></div>
        </div>
      </div>
    </div>

    <!-- Calendar view -->
    <div class="calendar-wrap" id="calView">
      <div class="cal-header">
        <h3 class="page-title" id="calLabel" style="font-size:1.2rem"></h3>
        <div class="cal-nav">
          <button class="cal-today-btn" id="calToday">Aujourd'hui</button>
          <button class="cal-nav-btn" id="calPrev"><i class="fa fa-chevron-left"></i></button>
          <button class="cal-nav-btn" id="calNext"><i class="fa fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="cal-grid" id="calGrid"></div>
    </div>
  </main>`;

  initSidebar('reservations');
  initModal();
  renderTable(reservations);

  /* Filters */
  document.getElementById('searchRes').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderTable(reservations.filter(r => r.client.toLowerCase().includes(q) || r.service.toLowerCase().includes(q)));
  });
  document.getElementById('filterStatus').addEventListener('change', function() {
    renderTable(this.value ? reservations.filter(r => r.status === this.value) : reservations);
  });
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const s = tab.dataset.s;
      renderTable(s ? reservations.filter(r => r.status === s) : reservations);
    });
  });

  /* View toggle */
  document.getElementById('viewList').addEventListener('click', function() {
    this.classList.add('active'); document.getElementById('viewCal').classList.remove('active');
    document.getElementById('listView').style.display = '';
    document.getElementById('calView').classList.remove('active');
  });
  document.getElementById('viewCal').addEventListener('click', function() {
    this.classList.add('active'); document.getElementById('viewList').classList.remove('active');
    document.getElementById('listView').style.display = 'none';
    document.getElementById('calView').classList.add('active');
    renderCal();
  });

  /* Calendar */
  let calY = 2024, calM = 2;
  const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const evtDays = [10,12,15,18,20,22];

  function renderCal() {
    document.getElementById('calLabel').textContent = months[calM] + ' ' + calY;
    const first = new Date(calY, calM, 1);
    const dow = (first.getDay() + 6) % 7;
    const daysInM = new Date(calY, calM+1, 0).getDate();
    const today = new Date();
    let html = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => `<div class="cal-day-header">${d}</div>`).join('');
    for (let i=0; i<dow; i++) html += `<div class="cal-cell other"><div class="cal-num dim"></div></div>`;
    for (let d=1; d<=daysInM; d++) {
      const isTd = today.getFullYear()===calY && today.getMonth()===calM && today.getDate()===d;
      const evts = reservations.filter(r => parseInt(r.date) === d);
      const sampleEvts = evtDays.includes(d) ? `<div class="cal-ev blue">Réservation</div>` : '';
      html += `<div class="cal-cell"><div class="cal-num ${isTd?'today':''}">${d}</div>${sampleEvts}</div>`;
    }
    document.getElementById('calGrid').innerHTML = html;
  }

  document.getElementById('calPrev').addEventListener('click', () => { calM--; if(calM<0){calM=11;calY--;} renderCal(); });
  document.getElementById('calNext').addEventListener('click', () => { calM++; if(calM>11){calM=0;calY++;} renderCal(); });
  document.getElementById('calToday').addEventListener('click', () => { const n=new Date(); calY=n.getFullYear(); calM=n.getMonth(); renderCal(); });

  /* Detail modal */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-detail');
    if (!btn) return;
    const id = btn.dataset.id;
    const r = reservations.find(x => x.id === id);
    if (!r) return;
    document.getElementById('modalTitle').textContent = 'Détail — ' + r.id;
    document.getElementById('modalBodyFields').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="form-group"><label>Client</label><input type="text" value="${r.client}" readonly/></div>
        <div class="form-group"><label>Service</label><input type="text" value="${r.service}" readonly/></div>
        <div class="form-group"><label>Date</label><input type="text" value="${r.date}" readonly/></div>
        <div class="form-group"><label>Heure</label><input type="text" value="${r.heure}" readonly/></div>
        <div class="form-group"><label>Durée</label><input type="text" value="${r.duree}" readonly/></div>
        <div class="form-group"><label>Montant</label><input type="text" value="${r.montant}" readonly/></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:8px">
        ${r.status==='attente'?`
          <button class="modal-submit" style="flex:1" onclick="closeModal();showToast('Réservation confirmée !')"><i class="fa fa-check"></i> Accepter</button>
          <button class="btn-cancel" style="flex:1;background:#fee2e2;color:var(--red)" onclick="closeModal();showToast('Réservation refusée.','error')"><i class="fa fa-xmark"></i> Refuser</button>
        `:`<button class="btn-cancel" style="flex:1" onclick="closeModal()">Fermer</button>`}
      </div>`;
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});
