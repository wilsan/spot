const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/spot')
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

// Return a random element from the passed in array
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
   await Campground.deleteMany({});
   for (let i = 0; i < 50; i++) {
      const rand1600 = Math.floor(Math.random() * 1600);
      const camp = new Campground({
         location: `${cities[rand1600].city}, ${cities[rand1600].state}`,
         title: `${sample(descriptors)} ${sample(places)}`
      });
      await camp.save();
   }
}

seedDB().then(() => {
   mongoose.connection.close();
});
