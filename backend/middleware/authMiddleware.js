const jwt = require('jsonwebtoken');
const pool = require('../db');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcı bilgilerini veritabanından al
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (!user[0]) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
}; 