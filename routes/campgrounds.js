const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');


// Render all the campgrounds
router.get('/', catchAsync(async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
}));

// Render form to create a new campground
router.get('/new', isLoggedIn, (req, res) => {
   res.render('campgrounds/new');
});

// Save the new campground to database
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
   const camp = new Campground(req.body.campground);
   camp.author = req.user._id;
   await camp.save();
   
   req.flash('success', 'Successfully added a new campground!');
   res.redirect(`/campgrounds/${camp._id}`);
}));

// Render the selected campground
router.get('/:id', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id)
      .populate({
         path: 'reviews',
         populate: {
            path: 'author'
         }
      })
      .populate('author');

   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { camp });
}));

// Render form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   const camp = await Campground.findById(id);

   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { camp });
}));

// Update the edited campground in database
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndUpdate(id, req.body.campground);

   req.flash('success', `Successfully updated ${req.body.campground.title}!`);
   res.redirect(`/campgrounds/${id}`);
}));

// Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);

   req.flash('success', `Successfully deleted ${campground.title}!`);
   res.redirect('/campgrounds');
}));

module.exports = router;
