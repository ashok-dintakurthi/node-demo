const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/', adminController.addUpdateAdminUser);
router.get('/', adminController.adminUserListing);
router.delete('/:id', adminController.deleteAdminUsers);

module.exports = router;
