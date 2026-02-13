const express = require('express');
const { save, getStockMoves, getStockMoveLines, getStockMoveLinesByProduct } = require('../controllers/stockMove.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication.middleware');
const { ROLE } = require('../data/Role');

router.post('/', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), save);
router.get('/:shopId', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoves);
router.get('/:parentId/lines', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoveLines);
router.get('/product/:productId/lines', authMiddleware.authenticateToken, authMiddleware.authenticateRole(ROLE.SHOP), getStockMoveLinesByProduct);

module.exports = router;