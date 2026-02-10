const statusController = require('../controllers/status.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');


router.get("/", statusController.getAll);
router.get("/:id", statusController.getById);
router.post("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), statusController.save);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), statusController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), statusController.remove);

module.exports = router;