const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

// Controller
const users = require('../controllers/users');

router.route('/register')
   // Serve a registration form
   .get(users.renderRegisterForm)
   // Add user to database
   .post(catchAsync(users.registerUser));

router.route('/login')
   // Serve a login form
   .get(users.renderLoginForm)
   // Login the user with the form data
   .post(
      passport.authenticate('local', {
         failureFlash: true,
         failureRedirect: '/login',
         keepSessionInfo: true
      }),
      users.loginUser
   );

// Logout a user
router.get('/logout', users.logoutUser);


module.exports = router;
