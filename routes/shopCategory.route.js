const shopCategoryController = require('../controllers/shopCategory.controller');
const express = require('express');
const router = express.Router();

router.post("/", shopCategoryController.save);
router.get("/", shopCategoryController.getAll);
router.put("/:id", shopCategoryController.update);
router.delete("/:id", shopCategoryController.remove);

module.exports = router;