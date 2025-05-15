const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createRepair,
  getRepairHistory,
  updateRepairStatus,
  getAllRepairs,
  getCustomerRepairs
} = require('../controllers/repairController');

// Yeni tamir kaydı oluştur (sadece employee)
router.post('/', verifyToken, authorizeRoles('employee'), createRepair);

// IMEI'ye göre tamir geçmişini getir (herkes)
router.get('/history/:imei', verifyToken, getRepairHistory);

// Tamir durumunu güncelle (sadece employee)
router.patch('/:repair_id', verifyToken, authorizeRoles('admin', 'employee'), updateRepairStatus);
// Tüm tamir kayıtlarını listele (sadece admin ve employee)
router.get('/', verifyToken, authorizeRoles('admin', 'employee'), getAllRepairs);

router.get('/customer/:customer_id', verifyToken, getCustomerRepairs);

module.exports = router; 