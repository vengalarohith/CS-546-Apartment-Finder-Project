import express from 'express';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import listingsData from '../data/listings.js';
import toursData from '../data/tours.js';
import {authMiddleware} from '../middleware.js';

router.get('/', authMiddleware, async (req, res) => {
    const listings = await listingsData.getListingsLandord(req.session.user._id);
    if (req.session.user) {
        res.render('landlordDashbaord', { title: 'Landlord Dashboard', user: req.session.user, listings: JSON.stringify(listings) });
    } else {
        res.redirect('/auth/login');
    }
});

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

    const new_listing = await listingsData.newListing(
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
    res.redirect('/landlord');
});

router.get('/tours', async (req, res) => {
    const tours = await toursData.currentlandlordTours(req.session.user._id);
    res.render('landlorTours', {tours: JSON.stringify(tours)});
});

router.post('/approve-tour', async (req, res) => {
    const { tourId } = req.body;
    try {
        const updatedTour = await toursData.updateTourStatus(tourId);
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

router.get('/charts', authMiddleware, async (req, res) => {
    const listings = await listingsData.getListings();
    res.render('landlordCharts', { title: 'Finder Analytics', user: req.session.user, listings: JSON.stringify(listings) });
});

router.get('/listing', async (req, res) => {
    const listing = await listingsData.getListingById(req.query.id);
    res.render('landlordListing', {title: listing.address, listing: listing, comments: JSON.stringify(listing.comments)});
});


export default router;