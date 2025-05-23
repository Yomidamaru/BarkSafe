const Park = require('../models/park');
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req,res) => {
    const parks = await Park.find({});
    res.render('parks/index', { parks })
}

module.exports.renderNewForm = (req, res) => {
    res.render('parks/new');
}

module.exports.createPark = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.park.location, { limit: 1 });
    const park = new Park(req.body.park);
    park.geometry = geoData.features[0].geometry;
    park.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    park.author = req.user._id;
    await park.save();
    req.flash('success', 'Successfully made a new park')
    res.redirect(`/parks/${park._id}`);
}

module.exports.showPark = async(req, res) => {
    const park = await Park.findById(req.params.id).populate({ 
        path:'reviews',
            populate: {
                path: 'author'
            }
    }).populate('author');
    if (!park){
        req.flash('error', 'Cannot find that park');
        return res.redirect('/parks');
    }
    res.render('parks/show', { park } );
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id)
    if (!park) {
        req.flash ('error', 'Cannot find that Park');
        return res.redirect('/parks');
    }
    res.render('parks/edit', { park } );
}

module.exports.updatePark = async (req,res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    const geoData = await maptilerClient.geocoding.forward(req.body.park.location, { limit: 1 });
    park.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    park.images.push(...imgs);
    await park.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }    
    req.flash('success', 'Successfully updated park')
    res.redirect(`/parks/${park._id}`);
}

module.exports.destroyPark = async (req,res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Deleted park');
    res.redirect(`/parks`);
}
