const shopController = require('../controllers/shop.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const upload = require("../middlewares/upload.middleware");
const { ROLE } = require('../data/Role');
const { PathLogoShop } = require('../data/PathUpload');

router.get("/", shopController.getAll);
router.get("/:id", shopController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.save);

router.post('/:id/upload', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), 
  (req, res, next) => {
    req.uploadPath = PathLogoShop;
    next();
  },
  upload.single('logo'),
  shopController.upload
);

router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), shopController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.remove);
router.patch("/:id/activate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.activate);
router.patch("/:id/deactivate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.deactivate);

module.exports = router;