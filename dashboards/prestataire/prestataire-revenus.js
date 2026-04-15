/* prestataire-revenus.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  const transactions = [
    { ico:'fa-calendar', color:'blue',  name:'Labour de précision — Ferme du Soleil',   date:'12 Mars 2024', amount:'+150€',  type:'positive' },
    { ico:'fa-calendar', color:'blue',  name:'Installation irrigation — GAEC Les Plaines',date:'15 Mars 2024',amount:'+1200€', type:'positive' },
    { ico:'fa-calendar', color:'green', name:'Taille de vergers — Ferme Beaumont',       date:'18 Mars 2024', amount:'+90€',   type:'positive' },
    { ico:'fa-clock',    color:'gold',  name:'Analyse de sol — Coop Agricole 34',        date:'22 Mars 2024', amount:'+85€',   type:'pending'  },
    { ico:'fa-calendar', color:'blue',  name:'Semis drone — SCA Val de Loire',           date:'20 Mars 2024', amount:'+250€',  type:'positive' },
    { ico:'fa-calendar', color:'green', name:'Conseil sol — Jean Martin',                date:'10 Mars 2024', amount:'+80€',   type:'positive' },
    { ico:'fa-clock',    color:'gold',  name:'Labour — Ferme Nord',                      date:'25 Mars 2024', amount:'+150€',  type:'pending'  },
    { ico:'fa-calendar', color:'blue',  name:'Irrigation — Domaine des Pins',            date:'28 Mars 2024', amount:'+600€',  type:'positive' },
  ];

  layout.innerHTML = getSidebarHTML('revenus') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Revenus</h1><p class="page-sub">Analysez vos revenus et vos performances financières.</p></div>
      <div class="header-actions">
        <button class="export-btn"><i class="fa fa-download"></i> Exporter</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <!-- Stats -->
    <div class="rev-stats">
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon blue"><i class="fa fa-euro-sign"></i></div>
          <div class="rev-trend up"><i class="fa fa-arrow-trend-up"></i> +18.5%</div>
        </div>
        <p class="rev-label">Revenus totaux</p>
        <h3 class="rev-value">23 840€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon green"><i class="fa fa-chart-bar"></i></div>
          <div class="rev-trend up"><i class="fa fa-arrow-trend-up"></i> +12.2%</div>
        </div>
        <p class="rev-label">Ce mois</p>
        <h3 class="rev-value">3 840€</h3>
      </div>
      <div class="rev-stat">
        <div class="rev-stat-top">
          <div class="rev-icon gold"><i class="fa fa-clock"></i></div>
          <div class="rev-trend down"><i class="fa fa-arrow-trend-down"></i> -3.1%</div>
        </div>
        <p class="rev-label">En attente</p>
        <h3 class="rev-value">1 235€</h3>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">Évolution des revenus</h3>
          <select class="period-select" id="periodSelect">
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="annee">Cette année</option>
          </select>
        </div>
        <div class="chart-wrap"><canvas id="areaChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header"><h3 class="chart-card-title">Par service</h3></div>
        <div class="donut-wrap"><canvas id="donutChart"></canvas></div>
        <div class="legend-list" id="legendList"></div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="tx-card">
      <div class="tx-header">
        <h3>Dernières transactions</h3>
        <div style="position:relative;display:flex;align-items:center;background:var(--bg);border-radius:8px;padding:0 12px;gap:8px">
          <i class="fa fa-search" style="color:var(--text-muted);font-size:.85rem"></i>
          <input id="searchTx" type="text" placeholder="Rechercher..." style="border:none;outline:none;background:transparent;font-family:var(--font-body);font-size:.85rem;color:var(--text);padding:9px 0;width:180px"/>
        </div>
      </div>
      <div id="txList"></div>
    </div>
  </main>`;

  initSidebar('revenus');

  /* ---- Area chart ---- */
  const chartData = {
    semaine: { labels:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], values:[120,300,200,450,400,600,550] },
    mois:    { labels:['S1','S2','S3','S4'], values:[1200,1800,1400,2100] },
    annee:   { labels:['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'], values:[1800,2100,1600,2400,2900,2600,3200,3000,2800,3100,2900,3840] },
  };

  const aCtx = document.getElementById('areaChart').getContext('2d');
  function mkGrad(ctx) {
    const g = ctx.createLinearGradient(0,0,0,240);
    g.addColorStop(0,'rgba(88,116,140,0.2)');
    g.addColorStop(1,'rgba(88,116,140,0)');
    return g;
  }

  const areaChart = new Chart(aCtx, {
    type: 'line',
    data: {
      labels: chartData.semaine.labels,
      datasets: [{
        data: chartData.semaine.values,
        borderColor: '#58748c', borderWidth: 2.5,
        pointBackgroundColor: '#58748c', pointRadius: 4, pointHoverRadius: 6,
        fill: true, backgroundColor: mkGrad(aCtx), tension: 0.4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ display:false }, tooltip:{ backgroundColor:'#fff', titleColor:'#1a2010', bodyColor:'#58748c', borderColor:'#eaeae5', borderWidth:1, padding:12, cornerRadius:10, callbacks:{ label: c => ' ' + c.parsed.y + ' €' } } },
      scales: {
        x: { grid:{ display:false }, border:{ display:false }, ticks:{ color:'#9ca3af', font:{ size:11 } } },
        y: { grid:{ color:'#f0f0f0' }, border:{ display:false }, ticks:{ color:'#9ca3af', font:{ size:11 } } },
      },
    },
  });

  document.getElementById('periodSelect').addEventListener('change', function() {
    const d = chartData[this.value];
    areaChart.data.labels = d.labels;
    areaChart.data.datasets[0].data = d.values;
    areaChart.data.datasets[0].backgroundColor = mkGrad(aCtx);
    areaChart.update();
  });

  /* ---- Donut chart ---- */
  const categories = [
    { name:'Labour',     pct:35, color:'#58748c' },
    { name:'Irrigation', pct:28, color:'#4a6741' },
    { name:'Plantation', pct:20, color:'#d4a017' },
    { name:'Conseil',    pct:17, color:'#94a3b8' },
  ];

  new Chart(document.getElementById('donutChart').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: categories.map(c=>c.name),
      datasets: [{ data: categories.map(c=>c.pct), backgroundColor: categories.map(c=>c.color), borderWidth:0, hoverOffset:6 }],
    },
    options: { responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label: c => ' ' + c.label + ' : ' + c.parsed + '%' } } } },
  });

  document.getElementById('legendList').innerHTML = categories.map(c => `
    <div class="leg-item">
      <div class="leg-left"><div class="leg-dot" style="background:${c.color}"></div><span class="leg-name">${c.name}</span></div>
      <span class="leg-pct">${c.pct}%</span>
    </div>`).join('');

  /* ---- Transactions ---- */
  function renderTx(data) {
    document.getElementById('txList').innerHTML = data.map(t => `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-ico ${t.color}"><i class="fa ${t.ico}"></i></div>
          <div><div class="tx-name">${t.name}</div><div class="tx-date">${t.date}</div></div>
        </div>
        <div class="tx-amount ${t.type}">${t.amount}</div>
      </div>`).join('');
  }

  renderTx(transactions);

  document.getElementById('searchTx').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderTx(transactions.filter(t => t.name.toLowerCase().includes(q)));
  });

  document.querySelector('.export-btn').addEventListener('click', () => {
    showToast('Export en cours...');
    setTimeout(() => showToast('Fichier téléchargé !'), 1200);
  });
});
