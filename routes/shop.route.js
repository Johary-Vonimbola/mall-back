const shopController = require('../controllers/shop.controller');
const express = require('express');
const router = express.Router();

router.post("/", shopController.save);
router.get("/", shopController.getAll);
router.put("/:id", shopController.update);
router.delete("/:id", shopController.remove);
router.patch("/:id/activate", shopController.activate);
router.patch("/:id/deactivate", shopController.deactivate);

module.exports = router;