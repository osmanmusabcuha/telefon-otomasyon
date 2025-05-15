const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı e-posta ile bul
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şif' });
    }

    console.log(user)

    // Şifreyi kontrol et
    console.log("📩 Girilen şifre:", password);
    console.log("🔐 Veritabanı hash'i:", user.password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("✅ Şifre eşleşti mi?:", isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifr' });
    }


    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, status } = req.body;

    // E-posta kontrolü
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı kaydet
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role, address, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, phone, role, address, status]
    );

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


module.exports = {
  login,
  register
}; 