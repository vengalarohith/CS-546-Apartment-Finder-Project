import express from 'express';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import listingData from '../data/listings.js';

router.get('/listings/new', (req, res) => {
  res.render('addNewListing', { title: 'Add New Listing' });
});


router.post('/listings/new', async (req, res) => {
    // Extract data from the form submission
    const {
        address,
        city,
        state,
        zipCode,
        numberOfBedrooms,
        numberOfBathrooms,
        squareFootage,
        rentPrice,
        description,
        images,
    } = req.body;

    const imagesArray = images.split(',').map(image => image.trim());
    console.log(imagesArray)

    const new_listing = await listingData.newListing(
        req.session.user._id,
        address,
        city,
        state,
        zipCode,
        numberOfBedrooms,
        numberOfBathrooms,
        squareFootage,
        rentPrice,
        description,
        imagesArray
    );
    console.log('completed')
    res.redirect('/landlord/listings/new');
});

export default router;