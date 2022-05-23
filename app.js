const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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
// Render form to edit a campground
app.get('/campgrounds/:id/edit', async (req, res) => {
   const camp = await Campground.findById(req.params.id);
   res.render('campgrounds/edit', { camp });
});
// Update the edited campground in database
app.put('/campgrounds/:id', async (req, res) => {
   await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
   res.redirect(`/campgrounds/${req.params.id}`);
});
// Delete a campground
app.delete('/campgrounds/:id', async (req, res) => {
   await Campground.findByIdAndDelete(req.params.id);
   res.redirect('/campgrounds');
});

app.listen(3000, () => {
   console.log('Serving on port 3000');
});
