const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post("/", userController.save);
router.get("/", userController.getAll);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

module.exports = router;