const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

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
app.use(express.static(path.join(__dirname, 'public')));

// Session & flash setup
const sessionConfig = {
   secret: 'thishouldbeasecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
};
app.use(session(sessionConfig));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash message middleware
app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.currentUser = req.user;
   // console.log(req.session);
   // console.log(res.locals);
   next();
});

// Campground routes
app.use('/campgrounds', campgroundRoutes);
// Review routes
app.use('/campgrounds/:id/reviews', reviewRoutes);
// User routes
app.use('/', userRoutes);

// Render the home page
app.get('/', (req, res) => {
   res.render('home')
});

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
