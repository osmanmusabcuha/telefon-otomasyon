const pool = require('../db');

// Yeni iade kaydı oluştur
const createReturn = async (req, res) => {
  try {
    const { phone_id, customer_id, reason } = req.body;
    const employee_id = req.user.id; // Giriş yapan çalışanın ID'si

    // Telefonun durumunu kontrol et
    const [phones] = await pool.query('SELECT * FROM phones WHERE id = ?', [phone_id]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    if (phone.status !== 'sold') {
      return res.status(400).json({ message: 'Bu telefon iade edilemez' });
    }

    // Satış kaydını kontrol et
    const [sales] = await pool.query(
      'SELECT * FROM sales WHERE phone_id = ? AND customer_id = ?',
      [phone_id, customer_id]
    );

    if (!sales[0]) {
      return res.status(400).json({ message: 'Bu telefon bu müşteriye satılmamış' });
    }

    // İade kaydını oluştur
    const [result] = await pool.query(
      'INSERT INTO returns (phone_id, customer_id, employee_id, reason, return_status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [phone_id, customer_id, employee_id, reason, 'pending'] // return_status 'pending' olarak başlatılıyor
    );

    // Telefonun durumunu 'returned' olarak güncelle
    await pool.query('UPDATE phones SET status = ? WHERE id = ?', ['returned', phone_id]);
    await pool.query(
      'INSERT INTO phone_stock_changes (phone_id, change_type, change_date) VALUES (?, ?, NOW())',
      [phone_id, 'returned']
    );
    await pool.query(
      'INSERT INTO customer_issues (phone_id, customer_id, employee_id, issue_type, description, issue_status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [phone_id, customer_id, employee_id, 'return', reason, 'pending']
    );



    res.status(201).json({
      success: true,
      message: 'İade kaydı oluşturuldu',
      returnId: result.insertId
    });
  } catch (error) {
    console.error('Create return error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// IMEI'ye göre iade bilgilerini getir
const getReturnByImei = async (req, res) => {
  try {
    const { imei } = req.params;

    // Telefonu ve satış bilgilerini birlikte getir
    const [results] = await pool.query(`
      SELECT p.*, s.customer_id
      FROM phones p
      JOIN sales s ON s.phone_id = p.id
      WHERE p.imei = ?
    `, [imei]);

    const phone = results[0];
    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    // İade bilgilerini getir
    const [returns] = await pool.query(`
      SELECT r.*, 
             c.name as customer_name,
             c.phone as customer_phone,
             c.email as customer_email,
             e.name as employee_name
      FROM returns r
      JOIN users c ON r.customer_id = c.id
      JOIN users e ON r.employee_id = e.id
      WHERE r.phone_id = ?
    `, [phone.id]);

    res.json({
      success: true,
      phone,
      return: returns[0] || null
    });
  } catch (error) {
    console.error('Get return by IMEI error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};



// Tüm iade kayıtlarını listele
const getAllReturns = async (req, res) => {
  try {
    const [returns] = await pool.query(`
      SELECT r.*, 
             p.imei,
             p.brand,
             p.model,
             c.name as customer_name,
             c.phone as customer_phone,
             c.email as customer_email,
             e.name as employee_name,
             r.return_status
      FROM returns r
      JOIN phones p ON r.phone_id = p.id
      JOIN users c ON r.customer_id = c.id
      JOIN users e ON r.employee_id = e.id
      ORDER BY r.created_at DESC
    `);

    res.json({
      success: true,
      returns
    });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Müşteriye göre iade geçmişini getir
const getCustomerReturns = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const [returns] = await pool.query(`
      SELECT r.*, 
             p.imei,
             p.brand,
             p.model,
             e.name as employee_name,
             r.return_status
      FROM returns r
      JOIN phones p ON r.phone_id = p.id
      JOIN users e ON r.employee_id = e.id
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
    `, [customer_id]);

    res.json({
      success: true,
      returns
    });
  } catch (error) {
    console.error('Get customer returns error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


module.exports = {
  createReturn,
  getReturnByImei,
  getAllReturns,
  getCustomerReturns
}; 