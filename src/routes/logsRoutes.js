// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logsController');

router.get('/', logController.getLogs);

module.exports = router;
