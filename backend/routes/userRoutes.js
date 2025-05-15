const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllCustomers, getAllUsers,
    createUser,
    updateUserRole,
    deleteUser, deactivateUser, activateUser } = require('../controllers/userController');

// Müşterileri listele (admin ve employee)
router.get('/customers', verifyToken, getAllCustomers);
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);
router.post('/', verifyToken, authorizeRoles('admin'), createUser);
router.patch('/:id', verifyToken, authorizeRoles('admin'), updateUserRole);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteUser);
router.patch('/deactivate/:id', verifyToken, authorizeRoles('admin'), deactivateUser);
router.patch('/activate/:id', verifyToken, authorizeRoles('admin'), activateUser);

module.exports = router;
