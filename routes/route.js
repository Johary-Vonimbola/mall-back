const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const express = require('express');
const router = express.Router();

router.use('/users', userRouter);
router.use('/shops', shopRouter);

module.exports = router;