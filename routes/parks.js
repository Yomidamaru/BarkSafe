const express = require('express');
const router = express.Router();
const parks = require('../controllers/parks');
const Park = require('../models/park');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePark } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(parks.index))
    // route validate swapped with upload. fix later
    .post(isLoggedIn, upload.array('image'), validatePark,catchAsync(parks.createPark))
   
router.get('/new', isLoggedIn, parks.renderNewForm);

router.route('/:id')
    .get(catchAsync(parks.showPark))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePark, catchAsync(parks.updatePark))
    .delete(isLoggedIn, isAuthor, catchAsync(parks.destroyPark))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parks.renderEditForm));


module.exports = router;
