document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('togglePwd');
  const pwdInput  = document.getElementById('password');
  const eyeIcon   = document.getElementById('eyeIcon');

  if (toggleBtn && pwdInput && eyeIcon) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = pwdInput.type === 'password';
      pwdInput.type  = isHidden ? 'text' : 'password';
      eyeIcon.classList.toggle('fa-eye');
      eyeIcon.classList.toggle('fa-eye-slash');
      toggleBtn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
    });
  }

  //validation formulaire(raim)
  const submitBtn = document.getElementById('submitBtn')
                 || document.querySelector('button.btn-connect[type="button"]');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => 
      {

      const email     = document.getElementById('email');
      const password  = document.getElementById('password');
      const firstname = document.getElementById('firstname');
      const lastname  = document.getElementById('lastname');
      const cgu       = document.getElementById('cgu');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (firstname) 
        {
          firstname.style.border = firstname.value.trim() ? '' : '1.5px solid red';
          if (!firstname.value.trim()) return;
        }

      if (lastname) 
        {
          lastname.style.border = lastname.value.trim() ? '' : '1.5px solid red';
          if (!lastname.value.trim()) return;
        }

      if (email && !email.value.trim()) 
        {
          email.style.border = '1.5px solid red';
          return;
        }
 
      if (email && !emailRegex.test(email.value.trim())) 
        {
          email.style.border = '1.5px solid red';
          return;
        } 
        else if (email) 
        {
          email.style.border = '';
        }

      if (password) 
        {
          password.style.border = password.value.trim() ? '' : '1.5px solid red';
          if (!password.value.trim()) return;
        }

      if (cgu && !cgu.checked) 
        {
          cgu.style.outline = '2px solid red';
          return;
        } 
      else if (cgu) 
        {
          cgu.style.outline = '';
        }

    });
  }

});





