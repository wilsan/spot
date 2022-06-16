const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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

// Render the home page
app.get('/', (req, res) => {
   res.render('home')
});

// Campground routes
app.use('/campgrounds', campgroundRoutes);
// Review routes
app.use('/campgrounds/:id/reviews', reviewRoutes);

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
