const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createReturn,
  getReturnByImei,
  getAllReturns,
  getCustomerReturns
} = require('../controllers/returnController');

// Yeni iade kaydı oluştur (sadece employee)
router.post('/', verifyToken, authorizeRoles('employee'), createReturn);

// IMEI'ye göre iade bilgilerini getir (herkes)
router.get('/imei/:imei', verifyToken, getReturnByImei);

// Tüm iade kayıtlarını listele (sadece admin ve employee)
router.get('/', verifyToken, authorizeRoles('admin', 'employee'), getAllReturns);

// Müşteriye göre iade geçmişini getir (müşteri kendi geçmişini, admin/employee tüm müşterilerin geçmişini görebilir)
router.get('/customer/:customer_id', verifyToken, (req, res, next) => {
  if (req.user.role === 'customer' && req.user.id !== parseInt(req.params.customer_id)) {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
  }
  next();
}, getCustomerReturns);

module.exports = router; 