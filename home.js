(function () {

  const servicesGrid = document.getElementById('homeServicesGrid');
  const produitsGrid = document.getElementById('homeProduitsGrid');

  servicesGrid.innerHTML = SERVICES.slice(0, 6).map(serviceCardHtml).join('');
  produitsGrid.innerHTML = PRODUITS.slice(0, 3).map(produitCardHtml).join('');

  // ── Tooltip ──────────────────────────────────────────────
  const tooltip = document.getElementById('sellerTooltip');
  let tooltipTimer;

  function showTooltip(e, vid) {
    const v = VENDEURS[vid];
    if (!v) return;
    clearTimeout(tooltipTimer);
    tooltip.innerHTML = `
      <div class="tt-header">
        <img src="${v.avatar}" alt="${v.nom}" class="tt-avatar">
        <div>
          <div class="tt-name">${v.nom}</div>
          <div class="tt-location"><i class="fa-solid fa-location-dot me-1"></i>${v.localisation}</div>
        </div>
      </div>
      <p class="tt-bio">${v.bio}</p>
      <div class="tt-footer">
        <span><i class="fa-solid fa-comment-dots me-1"></i>${v.nbAvis} avis</span>
        <span><i class="fa-solid fa-envelope me-1"></i>${v.email}</span>
      </div>`;
    tooltip.classList.add('visible');
    const rect = e.target.getBoundingClientRect();
    const ttW  = 260;
    let left   = rect.left + window.scrollX;
    let top    = rect.bottom + window.scrollY + 8;
    if (left + ttW > window.innerWidth - 16) left = window.innerWidth - ttW - 16;
    if (left < 8) left = 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top + 'px';
  }

  function hideTooltip() {
    tooltipTimer = setTimeout(() => tooltip.classList.remove('visible'), 180);
  }

  tooltip.addEventListener('mouseenter', () => clearTimeout(tooltipTimer));
  tooltip.addEventListener('mouseleave', hideTooltip);

  // ── Modal ─────────────────────────────────────────────────
  const detailModalEl   = document.getElementById('detailModal');
  const detailModalBody = document.getElementById('detailModalBody');
  const bsModal = typeof bootstrap !== 'undefined'
    ? new bootstrap.Modal(detailModalEl)
    : null;

  // ── Events ────────────────────────────────────────────────
  document.querySelectorAll('.card-details-link').forEach(el => {
    el.addEventListener('click', () => {
      const { id, type } = el.dataset;
      let item, vendeurKey;

      if (type === 'service') {
        item = SERVICES.find(s => s.id === id);
        vendeurKey = item?.prestataire;
        if (item) detailModalBody.innerHTML = serviceDetailHtml(item, VENDEURS[vendeurKey] || {});
      } else {
        item = PRODUITS.find(p => p.id === id);
        vendeurKey = item?.fournisseur;
        if (item) detailModalBody.innerHTML = produitDetailHtml(item, VENDEURS[vendeurKey] || {});
      }

      // ✅ item existe ici, dans le bon scope
      if (item && bsModal) bsModal.show();
    });
  });

  document.querySelectorAll('.seller-name').forEach(el => {
    el.addEventListener('mouseenter', e => showTooltip(e, el.dataset.vid));
    el.addEventListener('mouseleave', hideTooltip);
  });

})();




