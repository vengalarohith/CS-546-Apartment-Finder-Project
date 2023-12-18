import express from 'express';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import listingData from '../data/listings.js';
import toursData from '../data/tours.js';

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

router.get('/tours', async (req, res) => {
    const tours = await toursData.currentUserTours(req.session.user._id);
    res.render('landlorTours', {tours: JSON.stringify(tours)});
});

router.post('/approve-tour', async (req, res) => {
    const { tourId } = req.body;
    try {
        const updatedTour = await toursData.updateTourStatus(tourId);
        console.log(updatedTour);
        if (updatedTour) {
            res.status(200).json({ message: 'Tour approved successfully', tour: updatedTour });
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

});


export default router;