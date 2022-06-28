const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

// Controller
const users = require('../controllers/users');

// Serve a registration form
router.get('/register', users.renderRegisterForm);

// Add user to database
router.post('/register', catchAsync(users.registerUser));

// Serve a login form
router.get('/login', users.renderLoginForm);

// Login the user with the form data
router.post(
   '/login',
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
