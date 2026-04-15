/* prestataire-dashboard.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');

  const services = [
    { id:1, name:'Labour de précision',       price:150,  status:'actif',   icon:'fa-tractor' },
    { id:2, name:'Installation Irrigation',   price:1200, status:'actif',   icon:'fa-droplet' },
    { id:3, name:'Taille de vergers',          price:45,   status:'inactif', icon:'fa-scissors' },
  ];

  function serviceCardsHTML() {
    return services.map(s => `
      <div class="service-card">
        <div class="service-card-top">
          <span class="badge ${s.status}">${s.status === 'actif' ? 'Actif' : 'Inactif'}</span>
          <div class="service-card-actions">
            <button class="svc-action-btn edit" title="Modifier"><i class="fa fa-pen"></i></button>
            <button class="svc-action-btn del" title="Supprimer" data-id="${s.id}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <p class="service-name">${s.name}</p>
        <div class="service-price">${s.price}€ <small>/ jour</small></div>
      </div>`).join('');
  }

  layout.innerHTML = getSidebarHTML('dashboard') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Espace Prestataire</h1>
        <p class="page-sub">Gérez vos services et vos réservations en temps réel.</p>
      </div>
      <div class="header-actions">
        <button class="icon-btn" title="Notifications"><i class="fa fa-bell"></i><span class="notif-dot"></span></button>
        <button class="btn-blue" id="btnAddService"><i class="fa fa-plus"></i> Ajouter un service</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box blue"><i class="fa fa-briefcase"></i></div>
          <button class="stat-edit-btn"><i class="fa fa-pen"></i></button>
        </div>
        <p class="stat-label">Services Actifs</p>
        <h3 class="stat-value">5</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box green"><i class="fa fa-calendar-check"></i></div>
          <button class="stat-edit-btn"><i class="fa fa-pen"></i></button>
        </div>
        <p class="stat-label">Total Réservations</p>
        <h3 class="stat-value">128</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box gold"><i class="fa fa-euro-sign"></i></div>
          <button class="stat-edit-btn"><i class="fa fa-pen"></i></button>
        </div>
        <p class="stat-label">Revenus Mensuels</p>
        <h3 class="stat-value">3 840€</h3>
      </div>
      <div class="stat-card">
        <div class="stat-card-top">
          <div class="stat-icon-box brown"><i class="fa fa-star"></i></div>
          <button class="stat-edit-btn"><i class="fa fa-pen"></i></button>
        </div>
        <p class="stat-label">Note Moyenne</p>
        <h3 class="stat-value">4.9/5</h3>
      </div>
    </div>

    <!-- Chart + Timeline -->
    <div class="mid-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Revenus de la semaine</h3>
          <div style="display:flex;align-items:center;gap:16px">
            <div class="chart-legend"><span class="legend-dot-green"></span> Revenus (€)</div>
            <select class="period-select" id="periodSelect">
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="annee">Cette année</option>
            </select>
          </div>
        </div>
        <div class="chart-wrap"><canvas id="revenusChart"></canvas></div>
      </div>

      <div class="timeline-card">
        <h3 class="timeline-title">Réservations du jour</h3>
        <div class="timeline">
          <div class="tl-item">
            <div class="tl-dot done"><i class="fa fa-check"></i></div>
            <p class="tl-time">09:00</p>
            <p class="tl-client">Ferme du Soleil</p>
            <p class="tl-service">Labour de précision</p>
          </div>
          <div class="tl-item">
            <div class="tl-dot ongoing"><i class="fa fa-clock"></i></div>
            <p class="tl-time">14:30</p>
            <p class="tl-client">GAEC Les Plaines</p>
            <p class="tl-service">Irrigation</p>
          </div>
          <div class="tl-item">
            <div class="tl-dot pending"><i class="fa fa-clock"></i></div>
            <p class="tl-time">17:00</p>
            <p class="tl-client">Jean Martin</p>
            <p class="tl-service">Conseil sol</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Services -->
    <div class="services-section">
      <div class="section-header">
        <h3>Gestion des services</h3>
        <a href="prestataire-services.html" class="btn-outline"><i class="fa fa-arrow-right"></i> Voir tout</a>
      </div>
      <div class="services-grid" id="servicesGrid">
        ${serviceCardsHTML()}
        <button class="add-service-card" id="btnAddCard">
          <i class="fa fa-plus"></i>
          Ajouter un service
        </button>
      </div>
    </div>
  </main>`;

  initSidebar('dashboard');
  initModal();

  /* ---- Chart ---- */
  const chartData = {
    semaine: { labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], values: [120,300,200,450,400,600,550] },
    mois:    { labels: ['S1','S2','S3','S4'], values: [1200,1800,1400,2100] },
    annee:   { labels: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'], values: [2100,1800,2400,2900,2600,3200,3000,2800,3100,2900,2400,3800] },
  };

  const ctx = document.getElementById('revenusChart').getContext('2d');

  function buildGradient(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 260);
    g.addColorStop(0, 'rgba(74,103,65,0.18)');
    g.addColorStop(1, 'rgba(74,103,65,0)');
    return g;
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.semaine.labels,
      datasets: [{
        data: chartData.semaine.values,
        borderColor: '#4a6741', borderWidth: 2.5,
        pointBackgroundColor: '#4a6741', pointRadius: 4, pointHoverRadius: 6,
        fill: true, backgroundColor: buildGradient(ctx),
        tension: 0.4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor:'#fff', titleColor:'#1a2010', bodyColor:'#4a6741', borderColor:'#eaeae5', borderWidth:1, padding:12, cornerRadius:10, callbacks: { label: c => ' ' + c.parsed.y + ' €' } },
      },
      scales: {
        x: { grid: { display:false }, border: { display:false }, ticks: { color:'#9ca3af', font:{ size:11 } } },
        y: { grid: { color:'#f0f0f0' }, border: { display:false }, ticks: { color:'#9ca3af', font:{ size:11 } } },
      },
    },
  });

  document.getElementById('periodSelect').addEventListener('change', function() {
    const d = chartData[this.value];
    chart.data.labels = d.labels;
    chart.data.datasets[0].data = d.values;
    chart.data.datasets[0].backgroundColor = buildGradient(ctx);
    chart.update();
  });

  /* ---- Modal open ---- */
  const modalFields = `
    <div class="upload-zone" id="uploadZone">
      <i class="fa fa-cloud-arrow-up"></i>
      <p>Cliquez ou glissez une image ici</p>
      <small>PNG, JPG jusqu'à 5MB</small>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Nom du service</label><input type="text" placeholder="Ex: Labour de précision"/></div>
      <div class="form-group"><label>Catégorie</label>
        <select><option>Sol</option><option>Arrosage</option><option>Plantation</option><option>Matériels</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Prix (€)</label><input type="number" placeholder="0.00"/></div>
      <div class="form-group"><label>Unité</label>
        <select><option>Par jour</option><option>Par heure</option><option>Par hectare</option></select>
      </div>
    </div>
    <div class="form-group"><label>Description</label><textarea placeholder="Décrivez brièvement votre service..."></textarea></div>
    <div class="modal-footer">
      <button class="btn-cancel" onclick="closeModal()">Annuler</button>
      <button class="modal-submit"><i class="fa fa-check"></i> Publier le service</button>
    </div>`;

  function openAddServiceModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un service';
    document.getElementById('modalBodyFields').innerHTML = modalFields;
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    const submitBtn = document.querySelector('.modal-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        const orig = this.innerHTML;
        this.innerHTML = '<i class="fa fa-check"></i> Publié !';
        this.style.background = '#2e7d32';
        setTimeout(() => { this.innerHTML = orig; this.style.background = ''; closeModal(); showToast('Service publié avec succès !'); }, 1500);
      });
    }
  }

  document.getElementById('btnAddService').addEventListener('click', openAddServiceModal);
  document.getElementById('btnAddCard').addEventListener('click', openAddServiceModal);

  /* ---- Delete service ---- */
  document.getElementById('servicesGrid').addEventListener('click', e => {
    const delBtn = e.target.closest('.svc-action-btn.del');
    if (delBtn && confirm('Supprimer ce service ?')) {
      delBtn.closest('.service-card').remove();
      showToast('Service supprimé.');
    }
  });
});
