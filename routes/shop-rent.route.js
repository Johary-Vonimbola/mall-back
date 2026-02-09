const express = require('express');
const router = express.Router();
const { getAll, save, update } = require('../controllers/shop-rent.controller');
const { authenticateToken, authenticateRole } = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.get("/", authenticateToken, authenticateRole(ROLE.ADMIN), getAll);
router.post("/", authenticateToken, authenticateRole(ROLE.ADMIN), save);
router.put("/:id", authenticateToken, authenticateRole(ROLE.ADMIN), update);

module.exports = router;