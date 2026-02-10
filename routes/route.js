const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const shopCategoryRouter = require('./shopCategory.route');
const statusRouter = require('./status.route');
const unitRouter = require('./unit.route');
const productRouter = require('./product.route');
const productCategoryRouter = require('./productCategory.route');
const express = require('express');
const authenticationController = require('../controllers/authentication.controller');

const router = express.Router();

router.post('/login', authenticationController.login);
router.post('/refresh-token', authenticationController.refreshToken);
router.post('/logout', authenticationController.logout);

router.use('/users', userRouter);
router.use('/shops', shopRouter);
router.use('/shop-categories', shopCategoryRouter);
router.use('/status', statusRouter);
router.use('/units', unitRouter);
router.use('/products', productRouter);
router.use('/product-categories', productCategoryRouter);

module.exports = router;