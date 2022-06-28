const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

// Controller
const campgrounds = require('../controllers/campgrounds');

router.route('/')
   // Render all the campgrounds
   .get(catchAsync(campgrounds.index))
   // Save the new campground to database
   .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Render form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
   // Render the selected campground
   .get(catchAsync(campgrounds.showCampground))
   // Update the edited campground in database
   .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
   // Delete a campground
   .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Render form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;
