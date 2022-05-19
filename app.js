const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/spot')
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));


// Render the home page
app.get('/', (req, res) => {
   res.render('home')
});
// Render all the campgrounds
app.get('/campgrounds', async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
});
// Render form to create a new campground
app.get('/campgrounds/new', (req, res) => {
   res.render('campgrounds/new');
});
// Save the new campground to database
app.post('/campgrounds', async (req, res) => {
   const camp = new Campground(req.body.campground);
   await camp.save();
   res.redirect(`/campgrounds/${camp._id}`);
});
// Render the selected campground
app.get('/campgrounds/:id', async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   res.render('campgrounds/show', { camp });
});


app.listen(3000, () => {
   console.log('Serving on port 3000');
});
