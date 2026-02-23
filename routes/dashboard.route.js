const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.get(
    "/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), adminDashboardController.getDashboard
);

module.exports = router;