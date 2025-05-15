const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createSale,
  getSaleByImei,
  getAllSales,
  getCustomerSales,
  getTodaySalesCount,
  getTodaySalesTotalAmount
} = require('../controllers/salesController');

// Yeni satış kaydı oluştur (sadece employee)
router.post('/', verifyToken, authorizeRoles('employee'), createSale);

// IMEI'ye göre satış bilgilerini getir (herkes)
router.get('/imei/:imei', verifyToken, getSaleByImei);

// Tüm satış kayıtlarını listele (sadece admin ve employee)
router.get('/', verifyToken, authorizeRoles('admin', 'employee'), getAllSales);

// Müşteriye göre satış geçmişini getir (müşteri kendi geçmişini, admin/employee tüm müşterilerin geçmişini görebilir)
router.get('/customer/:customer_id', verifyToken, (req, res, next) => {
  if (req.user.role === 'customer' && req.user.id !== parseInt(req.params.customer_id)) {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
  }
  next();
}, getCustomerSales);

router.get('/today-count', verifyToken, getTodaySalesCount);
router.get('/today-total', verifyToken, getTodaySalesTotalAmount);
module.exports = router; 