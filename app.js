const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./validationSchema');
const Review = require('./models/review');


mongoose.connect('mongodb://localhost:27017/spot')
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// JOI validation middleware
const validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}

// Render the home page
app.get('/', (req, res) => {
   res.render('home')
});
// Render all the campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
}));
// Render form to create a new campground
app.get('/campgrounds/new', (req, res) => {
   res.render('campgrounds/new');
});
// Save the new campground to database
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
   // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
   const camp = new Campground(req.body.campground);
   await camp.save();
   res.redirect(`/campgrounds/${camp._id}`);
}));
// Render the selected campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { camp });
}));
// Render form to edit a campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   res.render('campgrounds/edit', { camp });
}));
// Update the edited campground in database
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
   await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
   res.redirect(`/campgrounds/${req.params.id}`);
}));
// Delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
   await Campground.findByIdAndDelete(req.params.id);
   res.redirect('/campgrounds');
}));
// Add a review for the selected camp
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   camp.reviews.push(review);
   await review.save();
   await camp.save();
   res.redirect(`/campgrounds/${camp._id}`);
}));

// 404 Error
app.all('*', (req, res, next) => {
   next(new ExpressError('Page Not Found!!!!', 404));
});

// Error handler
app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = 'Oh no, something went wrong';
   if (!err.statusCode) err.statusCode = 500;
   res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
   console.log('Serving on port 3000');
});
