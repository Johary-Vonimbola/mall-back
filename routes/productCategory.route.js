const productCategoryController = require('../controllers/productCategory.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');


router.get("/", productCategoryController.getAll);
router.get("/:id", productCategoryController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), productCategoryController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), productCategoryController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), productCategoryController.remove);

module.exports = router;