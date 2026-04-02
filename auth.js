if (toggleBtn && pwdInput && eyeIcon) {
	toggleBtn.addEventListener('click', () => {
		const isHidden = pwdInput.type === 'password';
		pwdInput.type  = isHidden ? 'text' : 'password';
    if (isHidden) {
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
	});
}


