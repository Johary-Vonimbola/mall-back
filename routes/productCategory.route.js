const productCategoryController = require('../controllers/productCategory.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');


router.get("/shops/:shopId", productCategoryController.getAll);
router.get("/:id", productCategoryController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productCategoryController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productCategoryController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productCategoryController.remove);

module.exports = router;