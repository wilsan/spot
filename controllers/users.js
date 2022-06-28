const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
   res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
   res.render('users/login');
};

module.exports.loginUser = (req, res) => {
   req.flash('success', `Welcome back ${req.user.username}!`);
   const redirectUrl = req.session.returnTo || '/campgrounds';
   delete req.session.returnTo;
   res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
   req.logout((err) => {
      if (err)
         return next(err);

      req.flash('success', 'You are logged out!');
      res.redirect('/campgrounds');
   });
};
