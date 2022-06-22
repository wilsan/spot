const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

// Serve a registration form
router.get('/register', (req, res) => {
   res.render('users/register');
});

// Add user to database
router.post('/register', catchAsync(async (req, res) => {
   try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
         if (err)
            return next(err);
         req.flash('success', 'Welcome to Spot!');
         res.redirect('/campgrounds');
      });
   } catch (err) {
      req.flash('error', err.message);
      res.redirect('register');
   }
}));

// Serve a login form
router.get('/login', (req, res) => {
   res.render('users/login');
});

// Login the user with the form data
router.post(
   '/login',
   passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      keepSessionInfo: true
   }),
   (req, res) => {
      req.flash('success', `Welcome back ${req.user.username}!`);
      const redirectUrl = req.session.returnTo || '/campgrounds';
      delete req.session.returnTo;
      res.redirect(redirectUrl);
   }
);

// Logout a user
router.get('/logout', (req, res) => {
   req.logout((err) => {
      if (err)
         return next(err);

      req.flash('success', 'You are logged out!');
      res.redirect('/campgrounds');
   });
});

module.exports = router;
