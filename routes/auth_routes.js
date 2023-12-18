import express from 'express';
const router = express.Router();
import { check, validationResult } from 'express-validator';
import usersData from '../data/users.js';
import {comparePasswords, hashPassword} from '../helpers.js';
import {authMiddleware} from '../middleware.js';


router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', [
  check('username').isAlpha().withMessage('Username must be alphabetic'),
  check('username').isLength({ min: 2, max: 12 }).withMessage('First name must be between 2 and 12 characters'),
  check('firstName').isAlpha().withMessage('First name must be alphabetic'),
  check('firstName').isLength({ min: 2, max: 25 }).withMessage('First name must be between 2 and 25 characters'),
  check('lastName').isAlpha().withMessage('Last name must be alphabetic'),
  check('lastName').isLength({ min: 2, max: 25 }).withMessage('Last name must be between 2 and 25 characters'),
  check('emailAddress').isEmail().withMessage('Invalid email address'),
  check('password1').isStrongPassword().withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  check('password2').custom((value, { req }) => {
       if (value !== req.body.password1) {
          throw new Error('Passwords do not match');
       }
      return true;
  }),
], async (req, res) => {
  const errors = validationResult(req);
    console.log(errors);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).render('register', { errors: errorMessages });
    return;
  }



  try {
    const user = await usersData.createUser(
      req.body.username,
      req.body.firstName,
      req.body.lastName,
      req.body.emailAddress.toLowerCase(),
      await hashPassword(req.body.password1),
      req.body.role,
    );

    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Internal Error' });
    }
 });

 // Login route
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', [
  check('emailAddress').isEmail().withMessage('Invalid email address'),
  check('password').isStrongPassword().withMessage('Invalid password'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).render('login', { errors: errorMessages });
    return;
  }

  try {
    const user = await usersData.getUserByEmail(req.body.emailAddress.toLowerCase());
    console.log('got user email:', req.body.emailAddress)

    if (!user) {
      res.status(400).render('login', { error: 'No account found for: ' + req.body.emailAddress });
      return;
    }

    const isMatch = await comparePasswords(req.body.password, user.password);
    if (!isMatch) {
      res.status(400).render('login', { error: 'Invalid email address or password' });
      return;
    }

    req.session.user = user;

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Internal server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

router.get('/admin', authMiddleware, (req, res) => {
  res.render('admin', { title: 'Admin Area' });
});

export default router;