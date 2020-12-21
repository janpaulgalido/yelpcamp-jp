const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    multer = require('multer')

// whenever the file gets uploaded, this create a custom file name
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
})
// any file uploaded is filtered and must have the required image extension
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
}
const upload = multer({ storage: storage, fileFilter: imageFilter })

// Cloudinary Configuration
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dyjvp0zck',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, camps) => {
        if (err) return console.log(err)
        res.render('campgrounds/index', { campgrounds: camps })
    })
})

// CREATE - add new campground to Database
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            req.flash('error', err.message)
            return res.redirect('back')
        }
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url
        // add image's public_id to campground object
        req.body.campground.imageId = result.public_id
        // add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username,
        }
        Campground.create(req.body.campground, function (err, campground) {
            if (err) {
                req.flash('error', err.message)
                return res.redirect('back')
            }
            res.redirect('/campgrounds/' + campground._id)
        })
    })
})

// NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// SHOW ROUTE - shows more info about specific campground
router.get('/:id', (req, res) => {
    //find the campground with provided ID
    const campID = req.params.id
    Campground.findById(campID)
        .populate('comments')
        .exec((err, foundCamp) => {
            if (err || !foundCamp) {
                req.flash('error', 'Sorry, that campground does not exist!')
                res.redirect('/campgrounds')
            } else {
                res.render('campgrounds/show', { campground: foundCamp })
            }
        })
})

// EDIT CAMPGROUND ROUTE - shows edit form for a campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    //render edit template with that campground
    res.render('campgrounds/edit', { campground: req.campground })
})

// UPDATE CAMPGROUND ROUTE
router.put(
    '/:id',
    middleware.checkCampgroundOwnership,
    upload.single('image'),
    (req, res) => {
        Campground.findById(req.params.id, async (err, campground) => {
            if (err) {
                req.flash('error', err.message)
                res.redirect('back')
            } else {
                if (req.file && req.file.path !== '') {
                    try {
                        await cloudinary.uploader.destroy(campground.imageId)
                        let result = await cloudinary.uploader.upload(
                            req.file.path
                        )
                        campground.imageId = result.public_id
                        campground.image = result.secure_url
                    } catch (err) {
                        req.flash('error', err.message)
                        return res.redirect('back')
                    }
                    campground.name = req.body.campground.name
                    campground.price = req.body.campground.price
                    campground.description = req.body.campground.description
                } else {
                    campground.name = req.body.campground.name
                    campground.price = req.body.campground.price
                    campground.description = req.body.campground.description
                    campground.imageId = campground.imageId
                    campground.image = campground.image
                }
                // GEOCODING
                // geocoder.geocode(req.body.campground.location, (err, data) => {
                // 	if(err || !data.length) {
                // 		console.log(err);
                // 		req.flash('error', 'Invalid Address');
                // 		return res.redirect('back');
                // 	}
                // campground.lat = data[0].latitude;
                // campground.lng = data[0].longitude;
                // campground.location = data[0].formattedAddress;
                // })

                campground.save()
                // redirect to show page
                req.flash('success', 'Successfully updated campground!')
                res.redirect('/campgrounds/' + campground._id)
            }
        })
    }
)

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    // find and delete the correct campground
    Campground.findById(req.params.id, async (err, campground) => {
        if (err) {
            req.flash('error', err.message)
            res.redirect('/campgrounds')
        }
        try {
            await cloudinary.uploader.destroy(campground.imageId)
            campground.remove()
            req.flash('success', 'Campground deleted successfully.')
            res.redirect('/campgrounds')
        } catch (err) {
            req.flash('error', err.message)
            return res.redirect('back')
        }
    })
})

module.exports = router
