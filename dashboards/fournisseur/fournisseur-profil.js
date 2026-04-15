/* fournisseur-profil.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  let zones = ['Occitanie', 'Nouvelle-Aquitaine', 'Bretagne', 'Île-de-France'];

  function zonesHTML() {
    return zones.map(z => `
      <div class="zone-item">
        <span class="zone-name"><i class="fa fa-map-marker-alt"></i> ${z}</span>
        <button class="zone-del" data-zone="${z}" title="Supprimer"><i class="fa fa-xmark"></i></button>
      </div>`).join('');
  }

  layout.innerHTML = getSidebarHTML('profil') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mon Profil</h1><p class="page-sub">Gérez vos informations et paramètres de compte.</p></div>
      <div class="header-actions">
        <button class="save-btn" id="globalSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">AF</div>
      </div>
    </header>

    <div class="profil-grid">

      <!-- Left -->
      <div>
        <div class="profile-card">
          <div class="avatar-wrap">
            <div class="avatar-circle"><i class="fa fa-building"></i></div>
            <button class="avatar-upload" id="avatarUpload" title="Changer logo"><i class="fa fa-camera"></i></button>
          </div>
          <h2 class="profile-name">AgriSupply France</h2>
          <p class="profile-role">Fournisseur Agricole</p>
          <div class="profile-stats">
            <div class="ps-item"><div class="ps-value">42</div><div class="ps-label">Produits</div></div>
            <div class="ps-item"><div class="ps-value">128</div><div class="ps-label">Clients</div></div>
            <div class="ps-item"><div class="ps-value">4.8</div><div class="ps-label">Note</div></div>
          </div>
          <div class="profile-badges">
            <span class="p-badge gold"><i class="fa fa-shield-halved"></i> Vérifié</span>
            <span class="p-badge green"><i class="fa fa-leaf"></i> Certifié bio</span>
            <span class="p-badge blue"><i class="fa fa-star"></i> Top fournisseur</span>
          </div>
        </div>

        <nav class="tab-nav">
          <button class="tab-nav-btn active" data-tab="entreprise"><i class="fa fa-building"></i> Entreprise</button>
          <button class="tab-nav-btn" data-tab="contact"><i class="fa fa-address-card"></i> Contact</button>
          <button class="tab-nav-btn" data-tab="livraison"><i class="fa fa-truck"></i> Livraison</button>
          <button class="tab-nav-btn" data-tab="security"><i class="fa fa-shield-halved"></i> Sécurité</button>
          <button class="tab-nav-btn" data-tab="notifications"><i class="fa fa-bell"></i> Notifications</button>
        </nav>
      </div>

      <!-- Right -->
      <div class="content-panel">

        <!-- ENTREPRISE -->
        <div class="tab-pane active" id="tab-entreprise">
          <h3 class="pane-title">Informations Entreprise</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom de l'entreprise</label>
              <div class="field-wrap"><i class="fa fa-building field-icon"></i><input type="text" value="AgriSupply France"/></div>
            </div>
            <div class="field">
              <label>Numéro SIRET</label>
              <div class="field-wrap"><i class="fa fa-credit-card field-icon"></i><input type="text" value="456 789 123 00034"/></div>
            </div>
            <div class="field">
              <label>Type d'activité</label>
              <div class="field-wrap">
                <i class="fa fa-tag field-icon"></i>
                <select>
                  <option selected>Négoce agricole</option>
                  <option>Production semences</option>
                  <option>Fabrication engrais</option>
                  <option>Distribution matériels</option>
                  <option>Alimentation animale</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Année de création</label>
              <div class="field-wrap"><i class="fa fa-calendar field-icon"></i><input type="number" value="2005"/></div>
            </div>
            <div class="field">
              <label>Nombre d'employés</label>
              <div class="field-wrap">
                <i class="fa fa-users field-icon"></i>
                <select>
                  <option>Indépendant</option>
                  <option>1-10</option>
                  <option selected>11-50</option>
                  <option>51-200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Chiffre d'affaires annuel</label>
              <div class="field-wrap">
                <i class="fa fa-euro-sign field-icon"></i>
                <select>
                  <option>Moins de 100k€</option>
                  <option selected>100k - 500k€</option>
                  <option>500k - 1M€</option>
                  <option>1M€+</option>
                </select>
              </div>
            </div>
            <div class="field full">
              <label>Description de l'entreprise</label>
              <textarea>AgriSupply France est un fournisseur spécialisé dans la distribution de semences bio, d'engrais naturels et de matériels agricoles pour les exploitations de toutes tailles. Nous garantissons des produits certifiés et une livraison rapide sur toute la France.</textarea>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

        <!-- CONTACT -->
        <div class="tab-pane" id="tab-contact">
          <h3 class="pane-title">Informations de Contact</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom du responsable</label>
              <div class="field-wrap"><i class="fa fa-user field-icon"></i><input type="text" value="Antoine Fournisseur"/></div>
            </div>
            <div class="field">
              <label>Poste / Fonction</label>
              <div class="field-wrap"><i class="fa fa-briefcase field-icon"></i><input type="text" value="Directeur Commercial"/></div>
            </div>
            <div class="field">
              <label>E-mail professionnel</label>
              <div class="field-wrap"><i class="fa fa-envelope field-icon"></i><input type="email" value="antoine@agrisupply.fr"/></div>
            </div>
            <div class="field">
              <label>Téléphone</label>
              <div class="field-wrap"><i class="fa fa-phone field-icon"></i><input type="tel" value="+33 5 61 23 45 67"/></div>
            </div>
            <div class="field">
              <label>Site web</label>
              <div class="field-wrap"><i class="fa fa-globe field-icon"></i><input type="url" value="https://www.agrisupply.fr"/></div>
            </div>
            <div class="field">
              <label>Adresse siège social</label>
              <div class="field-wrap"><i class="fa fa-map-marker-alt field-icon"></i><input type="text" value="45 Rue du Négoce, 31000 Toulouse"/></div>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

        <!-- LIVRAISON -->
        <div class="tab-pane" id="tab-livraison">
          <h3 class="pane-title">Zones & Conditions de Livraison</h3>
          <div class="form-grid" style="margin-bottom:28px">
            <div class="field">
              <label>Délai moyen de livraison</label>
              <div class="field-wrap">
                <i class="fa fa-clock field-icon"></i>
                <select>
                  <option>24h</option>
                  <option selected>48h</option>
                  <option>3-5 jours</option>
                  <option>Sous 1 semaine</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Livraison gratuite à partir de</label>
              <div class="field-wrap"><i class="fa fa-euro-sign field-icon"></i><input type="number" value="500"/></div>
            </div>
            <div class="field">
              <label>Frais de port standard</label>
              <div class="field-wrap"><i class="fa fa-truck field-icon"></i><input type="number" value="15"/></div>
            </div>
            <div class="field">
              <label>Commande minimum</label>
              <div class="field-wrap"><i class="fa fa-bag-shopping field-icon"></i><input type="number" value="50"/></div>
            </div>
          </div>

          <div class="field" style="margin-bottom:16px">
            <label>Zones de livraison</label>
          </div>
          <div class="zone-list" id="zoneList">${zonesHTML()}</div>
          <div class="zone-add">
            <input type="text" id="zoneInput" placeholder="Ajouter une région..."/>
            <button class="btn-gold" id="btnAddZone" style="padding:10px 16px"><i class="fa fa-plus"></i></button>
          </div>
          <button class="save-btn" onclick="showSaved(this)" style="margin-top:24px"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

        <!-- SECURITY -->
        <div class="tab-pane" id="tab-security">
          <h3 class="pane-title">Sécurité du Compte</h3>
          <div class="form-grid single">
            <div class="field">
              <label>Mot de passe actuel</label>
              <div class="field-wrap"><i class="fa fa-lock field-icon"></i><input type="password" placeholder="••••••••"/></div>
            </div>
            <div class="field">
              <label>Nouveau mot de passe</label>
              <div class="field-wrap"><i class="fa fa-key field-icon"></i><input type="password" placeholder="••••••••"/></div>
            </div>
            <div class="field">
              <label>Confirmer le mot de passe</label>
              <div class="field-wrap"><i class="fa fa-key field-icon"></i><input type="password" placeholder="••••••••"/></div>
            </div>
          </div>
          <button class="save-btn" style="margin-top:20px" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Mettre à jour</button>
          <div class="danger-zone">
            <h4>Zone de danger</h4>
            <p>La suppression du compte entraîne la perte définitive de tous vos produits, commandes et données.</p>
            <button class="danger-btn" onclick="if(confirm('Supprimer définitivement votre compte ?')) showToast('Compte supprimé.','error')">Supprimer mon compte</button>
          </div>
        </div>

        <!-- NOTIFICATIONS -->
        <div class="tab-pane" id="tab-notifications">
          <h3 class="pane-title">Préférences de Notifications</h3>
          <div class="toggle-list">
            ${[
              { title:'Nouvelles commandes',       desc:'Être notifié par e-mail à chaque nouvelle commande reçue.', on:true  },
              { title:'Alertes stock faible',       desc:'Recevoir un rappel quand un produit passe sous le seuil d\'alerte.', on:true  },
              { title:'Ruptures de stock',          desc:'Alerte immédiate dès qu\'un produit est en rupture totale.', on:true  },
              { title:'Paiements reçus',            desc:'Confirmation par e-mail à chaque paiement validé.',  on:true  },
              { title:'Avis clients',               desc:'Être notifié quand un client laisse un commentaire.',  on:false },
              { title:'Rapports hebdomadaires',     desc:'Recevoir un résumé de vos ventes chaque semaine.',    on:false },
              { title:'Offres promotionnelles AgriCo', desc:'Recevoir les opportunités de mise en avant sur la plateforme.', on:false },
            ].map(n => `
              <div class="toggle-row">
                <div class="toggle-info"><h4>${n.title}</h4><p>${n.desc}</p></div>
                <label class="toggle-switch">
                  <input type="checkbox" ${n.on ? 'checked' : ''}/>
                  <span class="toggle-slider"></span>
                </label>
              </div>`).join('')}
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

      </div><!-- /content-panel -->
    </div>
  </main>`;

  initSidebar('profil');

  /* Tab switching */
  document.querySelectorAll('.tab-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  /* Save feedback */
  window.showSaved = function(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa fa-check"></i> Enregistré !';
    btn.style.background = '#2e7d32';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; showToast('Profil mis à jour !'); }, 1600);
  };
  document.getElementById('globalSave').addEventListener('click', function() { showSaved(this); });

  /* Zones de livraison */
  function renderZones() {
    document.getElementById('zoneList').innerHTML = zonesHTML();
    document.querySelectorAll('.zone-del').forEach(btn => {
      btn.addEventListener('click', () => {
        zones = zones.filter(z => z !== btn.dataset.zone);
        renderZones();
      });
    });
  }
  renderZones();

  document.getElementById('btnAddZone').addEventListener('click', () => {
    const val = document.getElementById('zoneInput').value.trim();
    if (val && !zones.includes(val)) {
      zones.push(val);
      document.getElementById('zoneInput').value = '';
      renderZones();
      showToast('Zone ajoutée : ' + val);
    } else if (zones.includes(val)) {
      showToast('Cette zone existe déjà.', 'warn');
    }
  });
  document.getElementById('zoneInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btnAddZone').click();
  });

  /* Avatar upload */
  document.getElementById('avatarUpload').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => { if (e.target.files[0]) showToast('Logo "' + e.target.files[0].name + '" sélectionné.'); };
    inp.click();
  });
});
