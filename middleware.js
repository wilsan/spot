const { campgroundSchema } = require('./validationSchema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

// JOI validation middleware
module.exports.validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// Authentication middlware
module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be logged in first!');
      return res.redirect('/login');
   }
   next();
}

// Autherization middleware
module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
   const camp = await Campground.findById(id);

   if (!camp.author._id.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
};
