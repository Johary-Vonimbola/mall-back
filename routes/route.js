const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const shopCategoryRouter = require('./shopCategory.route');
const express = require('express');
const router = express.Router();

router.use('/users', userRouter);
router.use('/shops', shopRouter);
router.use('/shop-categories', shopCategoryRouter);

module.exports = router;