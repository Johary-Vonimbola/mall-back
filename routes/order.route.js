const orderController = require('../controllers/order.controller');
const express = require('express');
const router = express.Router();

router.post("", orderController.save);
router.get("/:shopId/:clientId", orderController.getAll);
router.get("/:orderId", orderController.getById);
router.put("/:orderId", orderController.updateStatusOrder);

module.exports = router;