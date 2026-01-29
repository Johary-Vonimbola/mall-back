const shopController = require('../controllers/shop.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.get("/", shopController.getAll);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.remove);
router.patch("/:id/activate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.activate);
router.patch("/:id/deactivate", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), shopController.deactivate);

module.exports = router;