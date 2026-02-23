const express = require('express');
const router = express.Router();
const dashboardShopController = require('../controllers/dashboardShop.controller');

router.get('/:shopId', dashboardShopController.getDashboardShop);

module.exports = router;
