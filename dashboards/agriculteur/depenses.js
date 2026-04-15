/* depenses.js */
document.addEventListener('DOMContentLoaded', () => {

  const layout = document.getElementById('appLayout');
  layout.innerHTML = getSidebarHTML('depenses') + `
  <main class="main">
    <header class="main-header">
      <div>
        <h1 class="page-title">Dépenses</h1>
        <p class="page-sub">Suivez et analysez toutes vos dépenses agricoles.</p>
      </div>
      <div class="header-actions">
        <div class="avatar">JD</div>
      </div>
    </header>

    <!-- Stats -->
    <div class="dep-stats">
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon green"><i class="fa fa-euro-sign"></i></div>
          <div class="dep-trend up"><i class="fa fa-arrow-trend-up"></i> +12.5%</div>
        </div>
        <p class="dep-label">Total dépenses</p>
        <h3 class="dep-value">4 250€</h3>
      </div>
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon blue"><i class="fa fa-chart-bar"></i></div>
          <div class="dep-trend up"><i class="fa fa-arrow-trend-up"></i> +5.2%</div>
        </div>
        <p class="dep-label">Ce mois</p>
        <h3 class="dep-value">1 120€</h3>
      </div>
      <div class="dep-stat-card">
        <div class="dep-stat-top">
          <div class="dep-icon gold"><i class="fa fa-clock"></i></div>
          <div class="dep-trend down"><i class="fa fa-arrow-trend-down"></i> -2.1%</div>
        </div>
        <p class="dep-label">En attente</p>
        <h3 class="dep-value">450€</h3>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">Évolution des dépenses</h3>
          <select class="period-select" id="periodSelect">
            <option value="6mois">6 derniers mois</option>
            <option value="annee">Année 2024</option>
            <option value="trimestre">Trimestre</option>
          </select>
        </div>
        <div class="chart-wrap"><canvas id="lineChart"></canvas></div>
      </div>

      <div class="chart-card">
        <div class="chart-card-header">
          <h3 class="chart-card-title">Répartition</h3>
          <select id="repartSelect" class="period-select">
            <option value="type">Par type (Produits / Services)</option>
            <option value="categorie">Par catégorie</option>
          </select>
        </div>
        <div class="donut-wrap"><canvas id="donutChart"></canvas></div>
        <div class="legend-list" id="legendList"></div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="tx-card">
      <div class="tx-header">
        <h3>Dernières transactions</h3>
        <div style="display:flex;gap:10px">
          <div class="toolbar-search" style="max-width:220px;background:var(--bg);border-radius:8px;padding:0 10px;display:flex;align-items:center;gap:8px">
            <i class="fa fa-search" style="color:var(--text-muted);font-size:.85rem"></i>
            <input id="searchTx" type="text" placeholder="Rechercher..." style="border:none;outline:none;background:transparent;font-family:var(--font-body);font-size:.85rem;color:var(--text);width:100%;padding:8px 0"/>
          </div>
        </div>
      </div>
      <div id="txList"></div>
    </div>
  </main>`;

  initSidebar('depenses');

  /* ---- Line chart ---- */
  const chartData = {
    '6mois':    { labels: ['Jan','Fév','Mar','Avr','Mai','Juin'],           values: [400,300,600,800,500,900] },
    'annee':    { labels: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'], values: [400,300,600,800,500,900,700,650,750,820,610,940] },
    'trimestre':{ labels: ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8','Sem 9','Sem 10','Sem 11','Sem 12','Sem 13'], values: [200,340,280,420,390,510,470,600,540,610,680,720,760] },
  };

  const lineCtx = document.getElementById('lineChart').getContext('2d');
  const lineChart = new Chart(lineCtx, {
    type: 'bar',
    data: {
      labels: chartData['6mois'].labels,
      datasets: [{
        data: chartData['6mois'].values,
        backgroundColor: chartData['6mois'].values.map((_, i, arr) => i === arr.length - 1 ? '#4a6741' : '#58748c'),
        borderRadius: 6, borderSkipped: false,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#1a2010', bodyColor: '#4a6741', borderColor: '#eaeae5', borderWidth: 1, padding: 12, cornerRadius: 10, callbacks: { label: c => ' ' + c.parsed.y + ' €' } } },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        y: { grid: { color: '#f0f0f0' }, border: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
      },
    },
  });

  document.getElementById('periodSelect').addEventListener('change', function() {
    const d = chartData[this.value];
    lineChart.data.labels = d.labels;
    lineChart.data.datasets[0].data = d.values;
    lineChart.data.datasets[0].backgroundColor = d.values.map((_,i,arr) => i === arr.length-1 ? '#4a6741' : '#58748c');
    lineChart.update();
  });

  /* ---- Donut chart ---- */
  const categoriesByCategory = [
    { name: 'Produits',   pct: 40, color: '#4a6741' },
    { name: 'Services',   pct: 30, color: '#58748c' },
    { name: 'Matériels',  pct: 18, color: '#d4a017' },
    { name: 'Autres',     pct: 12, color: '#94a3b8' },
  ];

  const categoriesByType = [
    { name: 'Produits', pct: 68, color: '#4a6741' },
    { name: 'Services', pct: 32, color: '#58748c' },
  ];

  const donutCtx = document.getElementById('donutChart').getContext('2d');
  const donutChart = new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: categoriesByCategory.map(c => c.name),
      datasets: [{ data: categoriesByCategory.map(c => c.pct), backgroundColor: categoriesByCategory.map(c => c.color), borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + c.label + ' : ' + c.parsed + '%' } } },
    },
  });

  function renderLegend(list) {
    document.getElementById('legendList').innerHTML = list.map(c => `
      <div class="legend-item">
        <div class="legend-left">
          <div class="legend-dot" style="background:${c.color}"></div>
          <span class="legend-name">${c.name}</span>
        </div>
        <span class="legend-pct">${c.pct}%</span>
      </div>`).join('');
  }

  renderLegend(categoriesByCategory);

  document.getElementById('repartSelect').addEventListener('change', function() {
    const v = this.value;
    const list = v === 'type' ? categoriesByType : categoriesByCategory;
    donutChart.data.labels = list.map(c => c.name);
    donutChart.data.datasets[0].data = list.map(c => c.pct);
    donutChart.data.datasets[0].backgroundColor = list.map(c => c.color);
    donutChart.update();
    renderLegend(list);
  });

  /* ---- Transactions ---- */
  const transactions = [
    { icon: 'fa-box',         color: 'green', name: 'Semences de blé bio',        date: '08 Mars',  amount: -85  },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Labour de précision',         date: '12 Mars',  amount: -150 },
    { icon: 'fa-box',         color: 'gold',  name: 'Engrais organique NPK',       date: '14 Mars',  amount: -120 },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Irrigation goutte à goutte',  date: '15 Mars',  amount: -1200},
    { icon: 'fa-wrench',      color: 'red',   name: 'Réparation tracteur',         date: '17 Mars',  amount: -65  },
    { icon: 'fa-box',         color: 'green', name: 'Plants de tomates cerises',   date: '20 Mars',  amount: -15  },
    { icon: 'fa-calendar',    color: 'blue',  name: 'Semis drone SkyAgri',         date: '22 Mars',  amount: -250 },
    { icon: 'fa-box',         color: 'gold',  name: 'Aliment bétail NutriFarm',    date: '25 Mars',  amount: -32  },
  ];

  function renderTx(data) {
    document.getElementById('txList').innerHTML = data.map(t => `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-icon ${t.color}"><i class="fa ${t.icon}"></i></div>
          <div>
            <div class="tx-name">${t.name}</div>
            <div class="tx-date">${t.date} 2024</div>
          </div>
        </div>
        <div class="tx-amount negative">${t.amount}€</div>
      </div>`).join('');
  }

  renderTx(transactions);

  document.getElementById('searchTx').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    renderTx(transactions.filter(t => t.name.toLowerCase().includes(q)));
  });
});
