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


app.get('/', (req, res) => {
   res.render('home')
});
app.get('/campgrounds', async (req, res) => {
   const camps = await Campground.find({});
   console.log(camps);
   res.render('campgrounds/index', { camps });
})

app.listen(3000, () => {
   console.log('Serving on port 3000');
});
