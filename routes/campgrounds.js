const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');

// Controller
const campgrounds = require('../controllers/campgrounds');

// Render all the campgrounds
router.get('/', catchAsync(campgrounds.index));

// Render form to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Save the new campground to database
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Render the selected campground
router.get('/:id', catchAsync(campgrounds.showCampground));

// Render form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Update the edited campground in database
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// Delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
