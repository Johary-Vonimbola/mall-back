const shopCategoryController = require('../controllers/shopCategory.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');


router.get("/", shopCategoryController.getAll);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopCategoryController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopCategoryController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopCategoryController.remove);

module.exports = router;