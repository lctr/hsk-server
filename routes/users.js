const express = require('express');
const usersRoutes = require('./../controllers/users.js');
const router = express.Router();

router.get('/:usr', usersRoutes.isUser);
router.post('/create', usersRoutes.registerUser);
router.post('/login', usersRoutes.loginUser);

module.exports = router; 