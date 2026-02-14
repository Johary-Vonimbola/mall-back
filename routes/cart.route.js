const cartController = require('../controllers/cart.controller');
const express = require('express');
const router = express.Router();

router.post("", cartController.save);
router.get("/:id", cartController.getCart);
router.delete("/:id", cartController.deleteCart);

router.post("/:id/product", cartController.addProduct);
router.patch("/:id/product/:productId", cartController.addQuantity);
router.delete("/:id/product/:productId", cartController.removeProduct);

module.exports = router;