const productController = require('../controllers/product.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const upload = require("../middlewares/upload.middleware");
const { ROLE } = require('../data/Role');
const productMiddleware = require('../middlewares/product.middleware');

router.get("/:shopId", productController.getAll);
router.get("/:shopId/:id", productController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productMiddleware.productUploadPath, upload.single('picture'), productController.save);

router.post('/:id/upload', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productMiddleware.productUploadPath, upload.single('picture'), productController.upload);

router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productController.remove);
router.patch("/:id/activate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productController.activate);
router.patch("/:id/deactivate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), productController.deactivate);

module.exports = router;