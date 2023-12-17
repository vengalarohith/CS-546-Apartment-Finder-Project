import express from 'express';
import {authMiddleware} from '../middleware.js';
import listingsData from '../data/listings.js';
import usersData from '../data/users.js';
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const listings = await listingsData.getListings();
  console.log(listings);
  console.log('listings');
  if (req.session.user) {
    res.render('dashboard', { title: 'Dashboard', user: req.session.user, listings: JSON.stringify(listings) });
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/listing', async (req, res) => {
  const listing = await listingsData.getListingById(req.query.id);
  const landlord = await usersData.getUserById(listing.landlordId);
  console.log(landlord);
  res.render('listing', {title: listing.address, listing: listing, landlord: landlord, comments: JSON.stringify(listing.comments)});
});

router.post('/listing/comment/new', async (req, res) => {
  console.log(req.body.id, req.body.comment)
  await listingsData.addComment(req.body.id, req.body.comment, req.session.user._id, req.session.user.username);
  res.redirect('/listing?id='+ req.body.id +'#comment-section');
});

export default router;
