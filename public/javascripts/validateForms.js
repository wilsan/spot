// From Bootstrap; for the form validations
(() => {
   'use strict'
   const forms = document.querySelectorAll('.validated-form')
   Array.from(forms) // make an array from forms
      .forEach(form => {
         form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
               event.preventDefault()
               event.stopPropagation()
            }
            form.classList.add('was-validated')
         }, false)
      })
})();
