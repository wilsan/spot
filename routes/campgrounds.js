const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../validationSchema');

// JOI validation middleware
const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
};

// Render all the campgrounds
router.get('/', catchAsync(async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
}));
// Render form to create a new campground
router.get('/new', (req, res) => {
   res.render('campgrounds/new');
});
// Save the new campground to database
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
   // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
   const camp = new Campground(req.body.campground);
   await camp.save();
   req.flash('success', 'Successfully added a new campground!');
   res.redirect(`/campgrounds/${camp._id}`);
}));
// Render the selected campground
router.get('/:id', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id).populate('reviews');
   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { camp });
}));
// Render form to edit a campground
router.get('/:id/edit', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { camp });
}));
// Update the edited campground in database
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
   await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
   req.flash('success', 'Successfully updated campground!');
   res.redirect(`/campgrounds/${req.params.id}`);
}));
// Delete a campground
router.delete('/:id', catchAsync(async (req, res) => {
   await Campground.findByIdAndDelete(req.params.id);
   req.flash('success', 'Successfully deleted campground!');
   res.redirect('/campgrounds');
}));

module.exports = router;
