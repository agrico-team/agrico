/* ================================
   AgriCo — dashboard-agriculteur.js
================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. CHART DES DÉPENSES (Chart.js)
  ================================================ */
  const chartData = {
    '6mois': {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      values: [400, 300, 600, 800, 500, 900],
    },
    'annee': {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      values: [400, 300, 600, 800, 500, 900, 700, 650, 750, 820, 610, 940],
    },
    'trimestre': {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Sem 9', 'Sem 10', 'Sem 11', 'Sem 12', 'Sem 13'],
      values: [200, 340, 280, 420, 390, 510, 470, 600, 540, 610, 680, 720, 760],
    },
  };

  const GREEN = '#4a6741';
  const BLUE  = '#58748c';

  const ctx = document.getElementById('depensesChart').getContext('2d');

  function buildColors(values) {
    return values.map((_, i) => (i === values.length - 1 ? GREEN : BLUE));
  }

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData['6mois'].labels,
      datasets: [{
        data: chartData['6mois'].values,
        backgroundColor: buildColors(chartData['6mois'].values),
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#1a2010',
          bodyColor: '#4a6741',
          borderColor: '#eaeae5',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: ctx => ' ' + ctx.parsed.y + ' €',
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11, family: 'DM Sans' } },
        },
        y: {
          grid: { color: '#f0f0f0', drawBorder: false },
          border: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11, family: 'DM Sans' } },
        },
      },
    },
  });

  /* Period select */
  document.getElementById('periodSelect').addEventListener('change', function () {
    const d = chartData[this.value];
    chart.data.labels = d.labels;
    chart.data.datasets[0].data = d.values;
    chart.data.datasets[0].backgroundColor = buildColors(d.values);
    chart.update();
  });

  /* ================================================
     2. ROLE SWITCHER
  ================================================ */
  const roleSwitchBtn = document.getElementById('roleSwitchBtn');
  const roleDropdown  = document.getElementById('roleDropdown');

  roleSwitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    roleDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => roleDropdown.classList.remove('show'));

  document.querySelectorAll('.role-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      roleDropdown.classList.remove('show');
      if (role === 'prestataire') window.location.href = '../prestataire/prestataire-dashboard.html';
      else if (role === 'fournisseur') window.location.href = '../fournisseur/fournisseur-dashboard.html';
    });
  });

  /* ================================================
     3. SIDEBAR NAV ACTIVE STATE
  ================================================ */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ================================================
     4. MODAL
  ================================================ */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle   = document.getElementById('modalTitle');
  const modalClose   = document.getElementById('modalClose');

  function openModal(title) {
    modalTitle.textContent = title;
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.getElementById('btnNouvCmd').addEventListener('click', () => window.location.href = '../../produits.html');
  document.getElementById('btnReserve').addEventListener('click', () => window.location.href = '../../services.html');
  document.getElementById('btnSupport').addEventListener('click', () => openModal('Contacter le Support'));

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* Modal submit feedback */
  document.querySelector('.modal-submit').addEventListener('click', function () {
    const original = this.textContent;
    this.textContent = '✓ Envoyé avec succès !';
    this.style.background = '#2e7d32';
    setTimeout(() => {
      this.textContent = original;
      this.style.background = '';
      closeModal();
    }, 1600);
  });

  /* ================================================
     5. LOGOUT CONFIRMATION
  ================================================ */
  document.querySelector('.logout-btn').addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      alert('Déconnexion réussie.');
    }
  });

  /* ================================================
     6. "VOIR TOUT" — feedback
  ================================================ */
  /* voir-tout links are now real hrefs — no override needed */

  /* ================================================
     7. NOTIFICATION BELL — animation
  ================================================ */
  const bellBtn = document.querySelector('.icon-btn[title="Notifications"]');
  bellBtn.addEventListener('click', () => {
    bellBtn.querySelector('i').style.animation = 'none';
    bellBtn.style.color = '#3a5a1c';
    const dot = bellBtn.querySelector('.notif-dot');
    if (dot) dot.style.display = 'none';
    setTimeout(() => { bellBtn.style.color = ''; }, 600);
  });

  /* ================================================
     8. CALENDAR BUTTON
  ================================================ */
  document.querySelector('.icon-btn[title="Calendrier"]').addEventListener('click', () => {
    const today = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    alert('Aujourd\'hui : ' + today);
  });

  /* ================================================
     9. DOTS MENU (table options)
  ================================================ */
  document.querySelectorAll('.dots-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card  = this.closest('.table-card');
      const title = card.querySelector('.section-title').textContent;
      alert('Options pour : ' + title);
    });
  });

  /* ================================================
     10. STAT CARDS — subtle pulse on hover
  ================================================ */
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.stat-icon');
      icon.style.background = 'var(--green-light)';
      icon.style.color = 'var(--green-dark)';
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.stat-icon');
      icon.style.background = '';
      icon.style.color = '';
    });
  });

});
