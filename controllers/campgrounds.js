const Campground = require('../models/campground');
const { cloudinary } = require('../utils/cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
};

module.exports.renderNewForm = (req, res) => {
   res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
   const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
   }).send();   

   const camp = new Campground(req.body.campground);
   camp.geometry = geoData.body.features[0].geometry;
   camp.author = req.user._id;
   camp.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
   await camp.save();

   req.flash('success', 'Successfully added a new campground!');
   res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCampground = async (req, res) => {
   const camp = await Campground.findById(req.params.id)
      .populate({
         path: 'reviews',
         populate: {
            path: 'author'
         }
      })
      .populate('author');

   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/show', { camp });
};

module.exports.renderEditForm = async (req, res) => {
   const { id } = req.params;
   const camp = await Campground.findById(id);

   if (!camp) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
   }
   res.render('campgrounds/edit', { camp });
};

module.exports.updateCampground = async (req, res) => {
   const { id } = req.params;
   const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
   const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
   camp.images.push(...imgs);
   await camp.save();
   if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
         await cloudinary.uploader.destroy(filename);  // delete the image from the cloud also
      }
      await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
      console.log(camp);
   }

   req.flash('success', `Successfully updated ${req.body.campground.title}!`);
   res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);

   req.flash('success', `Successfully deleted ${campground.title}!`);
   res.redirect('/campgrounds');
};
