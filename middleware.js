const { campgroundSchema, reviewSchema } = require('./validationSchema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

// JOI validation middleware for a new campground
module.exports.validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// JOI validation middleware for a new review
module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
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
      // console.log(req.baseUrl + ' ' + req.path);
      if (req.baseUrl.endsWith('/reviews'))
         req.session.returnTo = req.baseUrl.replace('/reviews', '');
      else
         req.session.returnTo = req.baseUrl + req.path;

      // console.log(req.session.returnTo);
      req.flash('error', 'You must be logged in first!');
      return res.redirect('/login');
   }
   next();
};

// Autherization middleware for camp author
module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
   const camp = await Campground.findById(id);

   if (!camp.author._id.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
};

// Autherization middleware for review author
module.exports.isReviewAuthor = async (req, res, next) => {
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);

   if (!review.author._id.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that.');
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
};
