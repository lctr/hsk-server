const express = require('express');
const wordsRoutes = require('./../controllers/words.js');
const router = express.Router();

router.get('/ping', (req, res) => { res.send(true); });
router.get('/all', wordsRoutes.wordsAll);
router.get('/bylevel/:level', wordsRoutes.wordsByLevel);

module.exports = router; 