import express from 'express';

const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('auth/login');
    return;
  }
  console.log(req.session.user.role);

  if (req.originalUrl === '/' && req.session.user.role === 'landlord') {
    return res.redirect('/landlord');
  }

  if (req.originalUrl === '/landlord' && req.session.user.role === 'tenant') {
    return res.redirect('/');
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