const orderController = require('../controllers/order.controller');
const express = require('express');
const router = express.Router();

router.post("", orderController.save);
router.get("/:shopId/:clientId", orderController.getAll);
router.get("/:id", orderController.getById);
router.put("/:id", orderController.updateStatusOrder);

module.exports = router;