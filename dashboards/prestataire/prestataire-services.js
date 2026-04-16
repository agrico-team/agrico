/* prestataire-services.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');

  const services = [
    { id:1, name:'Labour de précision',      price:150,  status:'actif',   cat:'Sol',       rating:4.8, reservations:34, img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80', desc:'Service de labour de précision avec équipement moderne pour optimiser vos rendements.' },
    { id:2, name:'Installation irrigation',  price:1200, status:'actif',   cat:'Arrosage',  rating:4.9, reservations:18, img:'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80', desc:'Installation complète de systèmes d\'irrigation goutte-à-goutte pour vos cultures.' },
    { id:3, name:'Taille de vergers',         price:45,   status:'inactif', cat:'Plantation',rating:4.7, reservations:22, img:'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&q=80', desc:'Taille professionnelle de vergers fruitiers pour une production optimale.' },
    { id:4, name:'Analyse de sol',            price:85,   status:'actif',   cat:'Sol',       rating:4.6, reservations:28, img:'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&q=80', desc:'Analyse complète de la composition de vos sols avec rapport détaillé.' },
    { id:5, name:'Semis par drone',           price:250,  status:'actif',   cat:'Plantation',rating:4.9, reservations:12, img:'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&q=80', desc:'Semis de précision par drone pour une distribution homogène sur grandes surfaces.' },
  ];

  let currentServices = [...services];

  function renderCards(data) {
    const grid = document.getElementById('cardsContainer');
    grid.innerHTML = data.map(s => `
      <div class="svc-card" data-id="${s.id}">
        <div class="svc-card-img"><img src="${s.img}" alt="${s.name}" loading="lazy"/></div>
        <div class="svc-card-body">
          <div class="svc-card-top">
            <span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span>
            <div class="svc-card-actions">
              <button class="svc-action-btn del"  data-id="${s.id}" title="Supprimer"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          <p class="svc-name">${s.name}</p>
          <p class="svc-desc">${s.desc}</p>
          <div class="svc-card-footer">
            <div class="svc-price">${s.price}€ <small>/ jour</small></div>
            <div class="svc-rating"><i class="fa fa-star"></i> ${s.rating}</div>
          </div>
                </div>
      </div>`).join('') + `
        <button class="svc-add-card" id="btnAddCard"><i class="fa fa-plus"></i>Ajouter un service</button>`;
  }

  function renderTable(data) {
    document.getElementById('tableBody').innerHTML = data.map(s => `
      <tr data-id="${s.id}">
        <td><div class="item-with-icon">
          <div class="item-icon blue"><i class="fa fa-briefcase"></i></div>
          <span class="bold">${s.name}</span>
        </div></td>
        <td class="muted">${s.cat}</td>
        <td class="amount">${s.price}€/j</td>
        <td><span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span></td>
        <td><span style="color:var(--gold);font-weight:700"><i class="fa fa-star"></i> ${s.rating}</span></td>
        <td class="muted">${s.reservations}</td>
        <td style="text-align:right;display:flex;gap:6px;justify-content:flex-end">
          <button class="svc-action-btn del"  data-id="${s.id}"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`).join('');
  }

  layout.innerHTML = getSidebarHTML('services') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mes Services</h1><p class="page-sub">Gérez et publiez vos offres de services agricoles.</p></div>
      <div class="header-actions">
        <div class="view-toggle">
          <button class="view-btn active" id="viewGrid" title="Grille"><i class="fa fa-grid-2"></i></button>
          <button class="view-btn" id="viewList" title="Liste"><i class="fa fa-list"></i></button>
        </div>
        <button class="btn-blue" id="btnAdd"><i class="fa fa-plus"></i> Nouveau service</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="mini-stat"><div class="mini-stat-icon blue"><i class="fa fa-briefcase"></i></div><div><p class="mini-stat-label">Services actifs</p><h3 class="mini-stat-value">5</h3></div></div>
      <div class="mini-stat"><div class="mini-stat-icon green"><i class="fa fa-calendar-check"></i></div><div><p class="mini-stat-label">Réservations totales</p><h3 class="mini-stat-value">114</h3></div></div>
      <div class="mini-stat"><div class="mini-stat-icon gold"><i class="fa fa-star"></i></div><div><p class="mini-stat-label">Note moyenne</p><h3 class="mini-stat-value">4.8</h3></div></div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-search"><i class="fa fa-search"></i><input type="text" id="searchSvc" placeholder="Rechercher un service..."/></div>
      <div class="toolbar-right">
        <select class="btn-outline" id="filterStatus" style="padding:10px 14px">
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>
    </div>

    <!-- Cards view -->
    <div id="cardsView">
      <div id="cardsContainer" class="cards-view"></div>
    </div>

    <!-- Table view -->
    <div class="table-view" id="tableView">
      <div class="table-card">
        <div class="table-card-header"><h3>Liste des services</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr>
              <th>Service</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th>Note</th><th>Réservations</th><th style="text-align:right">Actions</th>
            </tr></thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </main>`;

  initSidebar('services');
  initModal();
  renderCards(currentServices);
  renderTable(currentServices);

  /* View toggle */
  document.getElementById('viewGrid').addEventListener('click', function() {
    this.classList.add('active'); document.getElementById('viewList').classList.remove('active');
    document.getElementById('cardsView').style.display = '';
    document.getElementById('tableView').classList.remove('active');
  });
  document.getElementById('viewList').addEventListener('click', function() {
    this.classList.add('active'); document.getElementById('viewGrid').classList.remove('active');
    document.getElementById('cardsView').style.display = 'none';
    document.getElementById('tableView').classList.add('active');
  });

  /* Search */
  document.getElementById('searchSvc').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const f = currentServices.filter(s => s.name.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q));
    renderCards(f); renderTable(f);
    rebindAddCard();
  });

  document.getElementById('filterStatus').addEventListener('change', function() {
    const v = this.value;
    const f = v ? currentServices.filter(s => s.status === v) : currentServices;
    renderCards(f); renderTable(f);
    rebindAddCard();
  });

  /* Modal fields */
  function getModalFields(svc = null) {
    return `
      <div class="upload-zone"><i class="fa fa-cloud-arrow-up"></i><p>Cliquez ou glissez une image</p><small>PNG, JPG max 5MB</small></div>
      <div class="form-row">
        <div class="form-group"><label>Nom du service</label><input type="text" value="${svc ? svc.name : ''}"/></div>
        <div class="form-group"><label>Catégorie</label>
          <select>${['Sol','Arrosage','Plantation','Matériels'].map(c=>`<option ${svc&&svc.cat===c?'selected':''}>${c}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prix (€/jour)</label><input type="number" value="${svc ? svc.price : ''}"/></div>
        <div class="form-group"><label>Statut</label>
          <select><option value="actif" ${!svc||svc.status==='actif'?'selected':''}>Actif</option><option value="inactif" ${svc&&svc.status==='inactif'?'selected':''}>Inactif</option></select>
        </div>
      </div>
      <div class="form-group"><label>Description</label><textarea>${svc ? svc.desc : ''}</textarea></div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closeModal()">Annuler</button>
        <button class="modal-submit"><i class="fa fa-check"></i> ${svc ? 'Enregistrer' : 'Publier'}</button>
      </div>`;
  }

  function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Nouveau service';
    document.getElementById('modalBodyFields').innerHTML = getModalFields();
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-submit').addEventListener('click', function() {
      this.innerHTML = '<i class="fa fa-check"></i> Publié !'; this.style.background = '#2e7d32';
      setTimeout(() => { closeModal(); showToast('Service publié !'); }, 1400);
    });
  }

  document.getElementById('btnAdd').addEventListener('click', openAddModal);

  function rebindAddCard() {
    const btn = document.getElementById('btnAddCard');
    if (btn) btn.addEventListener('click', openAddModal);
  }
  rebindAddCard();

  /* Delete + Edit delegation */
  document.addEventListener('click', e => {
    const del = e.target.closest('.svc-action-btn.del');
    const edit = e.target.closest('.svc-action-btn.edit');
    if (del) {
      if (!confirm('Supprimer ce service ?')) return;
      const id = parseInt(del.dataset.id);
      currentServices = currentServices.filter(s => s.id !== id);
      renderCards(currentServices); renderTable(currentServices); rebindAddCard();
      showToast('Service supprimé.');
    }
    if (edit) {
      const id = parseInt(edit.dataset.id);
      const svc = currentServices.find(s => s.id === id);
      document.getElementById('modalTitle').textContent = 'Modifier le service';
      document.getElementById('modalBodyFields').innerHTML = getModalFields(svc);
      document.getElementById('modalOverlay').classList.add('show');
      document.body.style.overflow = 'hidden';
      document.querySelector('.modal-submit').addEventListener('click', function() {
        this.innerHTML = '<i class="fa fa-check"></i> Enregistré !'; this.style.background = '#2e7d32';
        setTimeout(() => { closeModal(); showToast('Service modifié !'); }, 1400);
      });
    }
  });
});
