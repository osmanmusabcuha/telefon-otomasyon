const pool = require('../db');
const bcrypt = require('bcrypt');
// Sadece müşteri kullanıcılarını getir
const getAllCustomers = async (req, res) => {
    try {
        const [customers] = await pool.query(
            'SELECT id, name FROM users WHERE role = ?',
            ['customer']
        );
        res.json({ customers });
    } catch (err) {
        console.error('Get customers error:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
// Tüm kullanıcıları getir
// Tüm kullanıcıları getir
const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, status FROM users');
        res.json({ users });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Yeni kullanıcı ekle
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role]);
    res.status(201).json({ message: 'Kullanıcı eklendi' });
};

// Rol güncelle
const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    if (role === 'admin') return res.status(403).json({ message: 'Yetkisiz işlem' });

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'Rol güncellendi' });
};

// Kullanıcı sil
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (rows[0].role === 'admin') return res.status(403).json({ message: 'Admin silinemez' });

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Kullanıcı silindi' });
};
// userController.js içinde
const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await pool.query('UPDATE users SET status = ? WHERE id = ?', ['inactive', id]);

        res.json({ success: true, message: 'Kullanıcı pasifleştirildi' });
    } catch (error) {
        console.error('Kullanıcı pasifleştirme hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await pool.query('UPDATE users SET status = ? WHERE id = ?', ['active', id]);

        res.json({ success: true, message: 'Kullanıcı aktifleştirildi' });
    } catch (error) {
        console.error('Kullanıcı aktifleştirme hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};


module.exports = {
    getAllCustomers,
    getAllUsers,
    createUser,
    updateUserRole,
    deleteUser,
    deactivateUser,
    activateUser
};
