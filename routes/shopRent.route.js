const express = require('express');
const router = express.Router();
const { getAll, save, update, getAllFrequencies, deactivate, activate, getById } = require('../controllers/shopRent.controller');
const { authenticateToken, authenticateRole } = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.get("/", authenticateToken, authenticateRole(ROLE.ADMIN), getAll);
router.get("/frequencies", authenticateToken, authenticateRole(ROLE.ADMIN), getAllFrequencies);
router.get("/:id", authenticateToken, authenticateRole(ROLE.ADMIN), getById);
router.post("/", authenticateToken, authenticateRole(ROLE.ADMIN), save);
router.put("/:id", authenticateToken, authenticateRole(ROLE.ADMIN), update);
router.patch("/:id/d", authenticateToken, authenticateRole(ROLE.ADMIN), deactivate);
router.patch("/:id/a", authenticateToken, authenticateRole(ROLE.ADMIN), activate);

module.exports = router;