const userController = require('../controllers/user.controller');
const express = require('express');
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');
const router = express.Router();

router.post("/", userController.save);
router.get("/", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), userController.getAll);
router.put("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), userController.update);
router.delete("/:id", authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.ADMIN), userController.remove);

module.exports = router;