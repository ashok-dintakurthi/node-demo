// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

router.post('/', feedController.addFeed);
router.post('/adminAccess', feedController.feedAccessToAdmin);
router.get('/', feedController.feedListing);
router.delete('/:id', feedController.deleteFeed);

module.exports = router;
