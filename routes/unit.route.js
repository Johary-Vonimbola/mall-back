const unitController = require('../controllers/unit.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');


router.get("/", unitController.getAll);
router.get("/:id", unitController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), unitController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), unitController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), unitController.remove);

module.exports = router;