const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../validationSchema');

// JOI validation middleware
const validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// Add a review for the selected camp
router.post('/', validateReview, catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   camp.reviews.push(review);
   await review.save();
   await camp.save();
   res.redirect(`/campgrounds/${camp._id}`);
}));
// Delete a review
router.delete('/:reviewId', catchAsync(async (req, res) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
