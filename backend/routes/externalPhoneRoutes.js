const express = require('express');
const router = express.Router();
const { getAllBrandModels } = require('../controllers/externalPhoneController');

router.get('/brand-models', getAllBrandModels);

module.exports = router;
