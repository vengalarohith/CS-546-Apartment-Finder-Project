import express from 'express';

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('auth/login');
    return;
  }

  if (req.originalUrl === '/admin' && req.session.user.role !== 'admin') {
    res.status(401).send('Unauthorized');
    return;
  }

  next();
};

const loggingMiddleware = (req, res, next) => {
  console.log(`Current Timestamp: ${new

Date().toUTCString()}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Route: ${req.originalUrl}`);
  console.log(`Authenticated User: ${req.session.user ? 'Yes' : 'No'}`);
  next();
};


export {authMiddleware, loggingMiddleware};