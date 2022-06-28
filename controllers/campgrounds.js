const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
   const camps = await Campground.find({});
   res.render('campgrounds/index', { camps });
};

module.exports.renderNewForm = (req, res) => {
   res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
   const camp = new Campground(req.body.campground);
   camp.author = req.user._id;
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
   await Campground.findByIdAndUpdate(id, req.body.campground);

   req.flash('success', `Successfully updated ${req.body.campground.title}!`);
   res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   const campground = await Campground.findByIdAndDelete(id);

   req.flash('success', `Successfully deleted ${campground.title}!`);
   res.redirect('/campgrounds');
};
