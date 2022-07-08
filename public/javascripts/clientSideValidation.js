const form = document.querySelector('form');

form.addEventListener('submit', event => {
   document.getElementById('error-username').style.display = 'none';
   document.getElementById('error-email').style.display = 'none';
   document.getElementById('error-password').style.display = 'none';

   if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      const usernameValidity = form[0].validity;
      const emailValidity = form[1].validity;
      const passwordValidity = form[2].validity;

      const usernameErrorDiv = document.getElementById('error-username');
      const emailErrorDiv = document.getElementById('error-email');
      const passwordErrorDiv = document.getElementById('error-password');

      if (usernameValidity.valueMissing) {
         usernameErrorDiv.innerText = 'Enter a username!';
         usernameErrorDiv.style.display = 'block';
      } else if (usernameValidity.tooShort) {
         usernameErrorDiv.innerText = 'Username must be atleast 6 characters!';
         usernameErrorDiv.style.display = 'block';
      }

      if (emailValidity.valueMissing) {
         emailErrorDiv.innerText = 'Enter an email!'
         emailErrorDiv.style.display = 'block';
      } else if (emailValidity.patternMismatch) {
         emailErrorDiv.innerText = 'Invalid email address!'
         emailErrorDiv.style.display = 'block';
      }

      if (passwordValidity.valueMissing) {
         passwordErrorDiv.innerText = 'Enter a password!';
         passwordErrorDiv.style.display = 'block';
      } else if (passwordValidity.tooShort) {
         passwordErrorDiv.innerText = 'Password must be atleast 6 characters!';
         passwordErrorDiv.style.display = 'block';
      }
   }
});