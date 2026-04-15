/* prestataire-profil.js */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('appLayout');

  let skills = ['Labour', 'Irrigation', 'Semis', 'Analyse sol', 'Drone'];

  function skillsHTML() {
    return skills.map(s => `
      <span class="skill-tag">${s}
        <button class="remove-skill" data-skill="${s}"><i class="fa fa-xmark"></i></button>
      </span>`).join('');
  }

  layout.innerHTML = getSidebarHTML('profil') + `
  <main class="main">
    <header class="main-header">
      <div><h1 class="page-title">Mon Profil</h1><p class="page-sub">Gérez vos informations et paramètres de compte.</p></div>
      <div class="header-actions">
        <button class="save-btn" id="globalSave"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        <div class="avatar">MP</div>
      </div>
    </header>

    <div class="profil-grid">

      <!-- Left -->
      <div>
        <div class="profile-card">
          <div class="avatar-wrap">
            <div class="avatar-circle"><i class="fa fa-user"></i></div>
            <button class="avatar-upload" id="avatarUpload" title="Changer photo"><i class="fa fa-camera"></i></button>
          </div>
          <h2 class="profile-name">Marc Prestataire</h2>
          <p class="profile-role">Prestataire Agricole</p>
          <div class="profile-stats">
            <div class="ps-item"><div class="ps-value">4.9</div><div class="ps-label">Note</div></div>
            <div class="ps-item"><div class="ps-value">128</div><div class="ps-label">Avis</div></div>
            <div class="ps-item"><div class="ps-value">5</div><div class="ps-label">Services</div></div>
          </div>
          <div class="profile-badges">
            <span class="p-badge blue"><i class="fa fa-shield-halved"></i> Vérifié</span>
            <span class="p-badge gold"><i class="fa fa-star"></i> Top prestataire</span>
            <span class="p-badge green"><i class="fa fa-leaf"></i> Certifié bio</span>
          </div>
        </div>

        <nav class="tab-nav">
          <button class="tab-nav-btn active" data-tab="personal"><i class="fa fa-user"></i> Infos Personnelles</button>
          <button class="tab-nav-btn" data-tab="entreprise"><i class="fa fa-building"></i> Entreprise</button>
          <button class="tab-nav-btn" data-tab="competences"><i class="fa fa-wrench"></i> Compétences</button>
          <button class="tab-nav-btn" data-tab="security"><i class="fa fa-shield-halved"></i> Sécurité</button>
          <button class="tab-nav-btn" data-tab="notifications"><i class="fa fa-bell"></i> Notifications</button>
        </nav>
      </div>

      <!-- Right -->
      <div class="content-panel">

        <!-- PERSONAL -->
        <div class="tab-pane active" id="tab-personal">
          <h3 class="pane-title">Informations Personnelles</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom complet</label>
              <div class="field-wrap"><i class="fa fa-user field-icon"></i><input type="text" value="Marc Prestataire"/></div>
            </div>
            <div class="field">
              <label>Adresse e-mail</label>
              <div class="field-wrap"><i class="fa fa-envelope field-icon"></i><input type="email" value="marc@agrico.fr"/></div>
            </div>
            <div class="field">
              <label>Téléphone</label>
              <div class="field-wrap"><i class="fa fa-phone field-icon"></i><input type="tel" value="+33 6 98 76 54 32"/></div>
            </div>
            <div class="field">
              <label>Localisation</label>
              <div class="field-wrap"><i class="fa fa-map-marker-alt field-icon"></i><input type="text" value="Toulouse, FR"/></div>
            </div>
            <div class="field">
              <label>Rayon d'intervention (km)</label>
              <div class="field-wrap"><i class="fa fa-location-dot field-icon"></i><input type="number" value="80"/></div>
            </div>
            <div class="field">
              <label>Disponibilité</label>
              <div class="field-wrap">
                <i class="fa fa-calendar field-icon"></i>
                <select>
                  <option selected>Temps plein</option>
                  <option>Temps partiel</option>
                  <option>Week-ends uniquement</option>
                </select>
              </div>
            </div>
            <div class="field full">
              <label>Bio / Présentation</label>
              <textarea>Prestataire agricole depuis 10 ans, spécialisé dans le labour de précision, l'installation d'irrigation et le semis par drone. Matériel récent et certifié. Intervention dans un rayon de 80km autour de Toulouse.</textarea>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

        <!-- ENTREPRISE -->
        <div class="tab-pane" id="tab-entreprise">
          <h3 class="pane-title">Informations Entreprise</h3>
          <div class="form-grid">
            <div class="field">
              <label>Nom de l'entreprise</label>
              <div class="field-wrap"><i class="fa fa-building field-icon"></i><input type="text" value="AgriService Pro"/></div>
            </div>
            <div class="field">
              <label>Numéro SIRET</label>
              <div class="field-wrap"><i class="fa fa-credit-card field-icon"></i><input type="text" value="987 654 321 00021"/></div>
            </div>
            <div class="field">
              <label>Type d'activité</label>
              <div class="field-wrap">
                <i class="fa fa-tag field-icon"></i>
                <select>
                  <option selected>Services agricoles</option>
                  <option>Travaux mécanisés</option>
                  <option>Conseil agricole</option>
                  <option>Location matériel</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Année de création</label>
              <div class="field-wrap"><i class="fa fa-calendar field-icon"></i><input type="number" value="2014"/></div>
            </div>
            <div class="field">
              <label>Nombre d'employés</label>
              <div class="field-wrap"><i class="fa fa-users field-icon"></i>
                <select>
                  <option>Indépendant</option>
                  <option selected>1-5</option>
                  <option>6-20</option>
                  <option>20+</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Assurance professionnelle</label>
              <div class="field-wrap"><i class="fa fa-shield-halved field-icon"></i><input type="text" value="AXA Pro — N°123456789"/></div>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
        </div>

        <!-- COMPETENCES -->
        <div class="tab-pane" id="tab-competences">
          <h3 class="pane-title">Compétences & Certifications</h3>
          <div class="field" style="margin-bottom:24px">
            <label>Compétences</label>
            <div class="skills-wrap" id="skillsWrap">${skillsHTML()}</div>
            <div class="skill-add">
              <input type="text" id="skillInput" placeholder="Ajouter une compétence..."/>
              <button class="btn-blue" id="btnAddSkill" style="padding:10px 16px"><i class="fa fa-plus"></i></button>
            </div>
          </div>
          <div class="form-grid" style="margin-top:24px">
            <div class="field">
              <label>Certifications</label>
              <div class="field-wrap"><i class="fa fa-certificate field-icon"></i><input type="text" value="Certiphyto, CACES R482"/></div>
            </div>
            <div class="field">
              <label>Langues</label>
              <div class="field-wrap"><i class="fa fa-language field-icon"></i><input type="text" value="Français, Anglais"/></div>
            </div>
            <div class="field full">
              <label>Matériels disponibles</label>
              <textarea>Tracteur John Deere 120CV, Drone DJI Agras T30, Système d'irrigation goutte-à-goutte, Semoir de précision, Épandeur d'engrais.</textarea>
            </div>
          </div>
          <button class="save-btn" onclick="showSaved(this)"><i class="fa fa-floppy-disk"></i> Enregistrer</button>
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
          <button class="save-btn" onclick="showSaved(this)" style="margin-top:20px"><i class="fa fa-floppy-disk"></i> Mettre à jour</button>
          <div class="danger-zone">
            <h4>Zone de danger</h4>
            <p>Une fois votre compte supprimé, toutes vos données seront définitivement perdues.</p>
            <button class="danger-btn" onclick="if(confirm('Supprimer le compte ?')) showToast('Compte supprimé.', 'error')">Supprimer mon compte</button>
          </div>
        </div>

        <!-- NOTIFICATIONS -->
        <div class="tab-pane" id="tab-notifications">
          <h3 class="pane-title">Préférences de Notifications</h3>
          <div class="toggle-list">
            ${[
              { title:'Nouvelles réservations',   desc:'Être notifié dès qu\'un client soumet une demande.',             on:true  },
              { title:'Confirmation de paiement', desc:'Recevoir un e-mail à chaque paiement validé.',                   on:true  },
              { title:'Rappels de rendez-vous',   desc:'Rappel 24h avant chaque prestation planifiée.',                  on:true  },
              { title:'Nouveaux avis',             desc:'Être notifié quand un client laisse un avis.',                  on:true  },
              { title:'Alertes météo',             desc:'Recevoir des alertes si des conditions météo impactent vos prestations.', on:false },
              { title:'Newsletter AgriCo',         desc:'Actualités et nouveautés de la plateforme.',                    on:false },
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

  /* Skills */
  function renderSkills() {
    document.getElementById('skillsWrap').innerHTML = skillsHTML();
    document.querySelectorAll('.remove-skill').forEach(btn => {
      btn.addEventListener('click', () => {
        skills = skills.filter(s => s !== btn.dataset.skill);
        renderSkills();
      });
    });
  }
  renderSkills();

  document.getElementById('btnAddSkill').addEventListener('click', () => {
    const val = document.getElementById('skillInput').value.trim();
    if (val && !skills.includes(val)) {
      skills.push(val);
      document.getElementById('skillInput').value = '';
      renderSkills();
      showToast('Compétence ajoutée !');
    }
  });
  document.getElementById('skillInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btnAddSkill').click();
  });

  /* Avatar upload */
  document.getElementById('avatarUpload').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => { if (e.target.files[0]) showToast('Photo "' + e.target.files[0].name + '" sélectionnée.'); };
    inp.click();
  });
});
