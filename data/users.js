import { ObjectId } from 'mongodb';
import {users} from '../config/mongoCollections.js';

const createUser = async (username, firstName, lastName, emailAddress, password, role) => {
  const user = {
    _id: new ObjectId(),
    username,
    firstName,
    lastName,
    emailAddress,
    password,
    role,
  };

  const usersCollection = await users();
  await usersCollection.insertOne(user);

  return user;
};

const getUserByEmail = async (emailAddress) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ emailAddress });

  return user;
};

const getUserById = async (id) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  return user;
};

export default {
  createUser,
  getUserByEmail,
  getUserById
};
