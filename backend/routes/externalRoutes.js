const express = require('express');
const router = express.Router();
const { getBrands, getModelsByBrand } = require('../controllers/externalController');

router.get('/brands', getBrands);

router.get('/models/:brandId', getModelsByBrand); // 👈 burası yeni

module.exports = router;
