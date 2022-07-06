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
      const price = Math.floor(Math.random() * 10 + 3) * 1000;
      const camp = new Campground({
         author: '62af8abbae3e7ea186f1d807',
         location: `${cities[rand1600].city}, ${cities[rand1600].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In velit eius, deserunt nihil, voluptatum iusto praesentium perferendis vel vitae et laboriosam dolorem exercitationem iste nobis autem fugit blanditiis.',
         price: price,
         geometry: { "type": "Point", "coordinates": [76.2412, 9.9653] },
         images: [
            {
               url: 'https://res.cloudinary.com/dd15gpoln/image/upload/v1656516058/Spot/xbwb8ex5thhxqff5lmum.jpg',
               filename: 'Spot/xbwb8ex5thhxqff5lmum'
            },
            {
               url: 'https://res.cloudinary.com/dd15gpoln/image/upload/v1656516057/Spot/v375eyibieua7zlrzim9.jpg',
               filename: 'Spot/v375eyibieua7zlrzim9'
            }
         ]
      });
      await camp.save();
   }
};

seedDB().then(() => {
   mongoose.connection.close();
});
