const express = require('express');
const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const shopCategoryRouter = require('./shopCategory.route');
const authenticationController = require('../controllers/authentication.controller');
const shopRentRouter = require('./shop-rent.route');

const router = express.Router();

router.post('/login', authenticationController.login);
router.post('/refresh-token', authenticationController.refreshToken);
router.post('/logout', authenticationController.logout);

router.use('/users', userRouter);
router.use('/shops', shopRouter);
router.use('/shop-categories', shopCategoryRouter);
router.use('/shop-rents', shopRentRouter);

module.exports = router;