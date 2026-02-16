const express = require('express');
const { save, getStockMoves, getStockMoveLines, getStockMoveLinesByProduct, configThreshold } = require('../controllers/stockMove.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.post('/', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), save);
router.get('/:shopId', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoves);
router.get('/:parentId/lines', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoveLines);
router.get('/product/:productId/lines', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoveLinesByProduct);
router.put('/thresholds', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), configThreshold);

module.exports = router;