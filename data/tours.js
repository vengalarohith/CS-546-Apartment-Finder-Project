import { ObjectId } from 'mongodb';
import { listings, users, tours } from '../config/mongoCollections.js';

const newTour = async (userId, username, landlordId, listingId, listingAddress, tourDateTime) => {
    const tour = {
        _id: new ObjectId(),
        userId,
        username,
        landlordId,
        listingId,
        listingAddress,
        tourDateTime,
        confirmed: false,
    };

    const toursCollection = await tours();
    await toursCollection.insertOne(tour);

    return tour;
};

const currentUserTours = async (userId) => {
    const toursCollection = await tours();
    const allTours = await toursCollection.find({userId: userId}).toArray();
    return allTours;
}

const currentlandlordTours = async (userId) => {
    const toursCollection = await tours();
    const allTours = await toursCollection.find({landlordId: userId}).toArray();
    return allTours;
}

const updateTourStatus = async (tourId) => {
    const toursCollection = await tours();

    const updatedTour = await toursCollection.findOneAndUpdate(
        { _id: new ObjectId(tourId) },
        { $set: { confirmed: true } },
        { returnDocument: 'after' }
    );

    return updatedTour;
};


export default {
newTour,
currentUserTours,
updateTourStatus,
currentlandlordTours
}