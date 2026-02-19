const express = require('express');
const { getRentsByYear, createRentPayment, update } = require('../controllers/shopRentPayment.controller');
const { authenticateToken, authenticateRole } = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

const router = express.Router();

router.get('/:shopId/:year', authenticateToken, authenticateRole(ROLE.SHOP), getRentsByYear);
router.post("", authenticateToken, authenticateRole(ROLE.SHOP), createRentPayment);
router.put("/:rentId", authenticateToken, authenticateRole(ROLE.SHOP), update);

module.exports = router;