const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
   url: String,
   filename: String
});

imageSchema.virtual('thumbnail').get(function () {
   return this.url.replace('/upload', '/upload/w_300');  // get image of width 200
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
   title: String,
   images: [imageSchema],
   geometry: {
      type: {
         type: String,
         enum: ['Point'],
         required: true
      },
      coordinates: {
         type: [Number],
         required: true
      }
   },
   price: Number,
   description: String,
   location: String,
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ]
}, opts);

campgroundSchema.virtual('properties').get(function () {
   return {
      id: this._id,
      title: this.title,
      description: this.description,
      price: this.price
   };
});

campgroundSchema.post('findOneAndDelete', async (camp) => {
   if (camp) {
      await Review.deleteMany({ _id: { $in: camp.reviews } });
   }
});

module.exports = mongoose.model('Campground', campgroundSchema);
