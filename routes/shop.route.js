const shopController = require('../controllers/shop.controller');
const express = require('express');
const router = express.Router();

router.post("/", shopController.save);
router.get("/", shopController.getAll);
router.put("/:id", shopController.update);
router.delete("/:id", shopController.remove);

module.exports = router;