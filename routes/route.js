const userRouter = require('./user.route');
const shopRouter = require('./shop.route');
const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication.middleware');
const authenticationController = require('../controllers/authentication.controller');

const router = express.Router();

router.post('/login', authenticationController.login);

router.use('/users', authenticationMiddleware.authenticateToken, userRouter);
router.use('/shops', shopRouter);

module.exports = router;