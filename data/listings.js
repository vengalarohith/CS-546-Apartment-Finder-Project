import { ObjectId } from 'mongodb';
import { listings, users } from '../config/mongoCollections.js';

const newListing = async (
landlordId,
address,
city,
state,
zipCode,
numberOfBedrooms,
numberOfBathrooms,
squareFootage,
rentPrice,
description,
images
) => {
    const listing = {
        _id: new ObjectId(),
        landlordId,
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
        createdOn: new Date(),
    };

    const listingsCollection = await listings();
    await listingsCollection.insertOne(listing);

    return listing;
};

const getListingById = async (id) => {
    const listingsCollection = await listings();
    const listing = await listingsCollection.findOne({ _id: new ObjectId(id) });
    return listing;
};

const getListings = async () => {
    const listingsCollection = await listings();
    const listing = await listingsCollection.find().toArray();
    return listing;
};

const addComment = async (listingId, comment, userId, username) => {
    console.log(listingId)
    const newComment = {
        _id: new ObjectId(),
        user: userId,
        username: username,
        comment: comment,
        dataPosted: new Date(),
    };
    const listingsCollection = await listings();
    listingsCollection.updateOne(
        { _id: new ObjectId(listingId) },
        { $push: { comments: newComment } }
    );
}

export default {
getListingById,
newListing,
getListings,
addComment
};
