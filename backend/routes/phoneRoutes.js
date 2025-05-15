const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllPhones,
  getPhoneByImei,
  addPhone,
  updatePhoneStatus,
  getAvailablePhones,
  getAvailablePhonesStructured,
  getSoldPhonesStructured
} = require('../controllers/phoneController');

// Tüm telefonları listele (sadece admin ve employee)
router.get('/', verifyToken, authorizeRoles('admin', 'employee'), getAllPhones);

// IMEI ile telefon sorgula (herkes)
router.get('/:imei', verifyToken, getPhoneByImei);

// Yeni telefon ekle (sadece admin)
router.post('/', verifyToken, authorizeRoles('admin', 'employee'), addPhone);

// Telefon durumunu güncelle (sadece admin ve employee)
router.patch('/:imei/status', verifyToken, authorizeRoles('admin', 'employee'), updatePhoneStatus);
router.get('/available/list', verifyToken, getAvailablePhones);
router.get('/available/structured', verifyToken, getAvailablePhonesStructured);
router.get('/sold/structured', verifyToken, getSoldPhonesStructured);



module.exports = router; 