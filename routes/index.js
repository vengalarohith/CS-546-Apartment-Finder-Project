import express from 'express';
import {authMiddleware} from '../middleware.js';
import listingsData from '../data/listings.js';
import usersData from '../data/users.js';
import toursData from '../data/tours.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const listings = await listingsData.getListings();
  if (req.session.user) {
    res.render('dashboard', { title: 'Dashboard', user: req.session.user, listings: JSON.stringify(listings) });
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/charts', authMiddleware, async (req, res) => {
  const listings = await listingsData.getListings();
  res.render('charts', { title: 'Finder Analytics', user: req.session.user, listings: JSON.stringify(listings) });

});

router.get('/listing', async (req, res) => {
  const listing = await listingsData.getListingById(req.query.id);
  const landlord = await usersData.getUserById(listing.landlordId);
  res.render('listing', {title: listing.address, listing: listing, landlord: landlord, comments: JSON.stringify(listing.comments)});
});

router.post('/listing/comment/new', async (req, res) => {
  await listingsData.addComment(req.body.id, req.body.comment, req.session.user._id, req.session.user.username);
  res.redirect('/listing?id='+ req.body.id +'#comment-section');
});

router.post('/mytours', async (req, res) => {
  await toursData.newTour(req.session.user._id, req.session.user.username, req.body.landlord, req.body.listing, req.body.address, req.body.datetime);
  res.redirect('/mytours');
});

router.get('/mytours', async (req, res) => {
  const tours = await toursData.currentUserTours(req.session.user._id);
  res.render('tours', {tours: JSON.stringify(tours)});
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});


export default router;

