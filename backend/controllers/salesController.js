const pool = require('../db');

// Yeni satış kaydı oluştur
const createSale = async (req, res) => {
  try {
    const { phone_id, customer_id, payment_status = 'completed', delivery_status = 'pending' } = req.body;
    const employee_id = req.user.id; // Giriş yapan çalışanın ID'si

    // Telefonun durumunu kontrol et
    const [phones] = await pool.query('SELECT * FROM phones WHERE id = ?', [phone_id]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    if (phone.status !== 'available') {
      return res.status(400).json({ message: 'Bu telefon satışa uygun değil' });
    }

    // Müşteriyi kontrol et
    const [customers] = await pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [customer_id, 'customer']);
    if (!customers[0]) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }

    // Satış kaydını oluştur
    const [result] = await pool.query(
      'INSERT INTO sales (customer_id, employee_id, phone_id, sale_date, payment_status, delivery_status) VALUES (?, ?, ?, NOW(), ?, ?)',
      [customer_id, employee_id, phone_id, payment_status, delivery_status]
    );

    // Telefonun durumunu 'sold' olarak güncelle
    await pool.query('UPDATE phones SET status = ? WHERE id = ?', ['sold', phone_id]);
    await pool.query(
      'INSERT INTO phone_stock_changes (phone_id, change_type, change_date) VALUES (?, ?, NOW())',
      [phone_id, 'sold']
    );


    res.status(201).json({
      success: true,
      message: 'Satış kaydı oluşturuldu',
      saleId: result.insertId
    });
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const getSaleByImei = async (req, res) => {
  try {
    const { imei } = req.params;

    // Önce telefonu bul
    const [phones] = await pool.query('SELECT * FROM phones WHERE imei = ?', [imei]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    // Satış bilgilerini getir
    const [sales] = await pool.query(`
      SELECT s.*, 
             c.name as customer_name,
             c.phone as customer_phone,
             c.email as customer_email,
             e.name as employee_name,
             s.payment_status,
             s.delivery_status
      FROM sales s
      JOIN users c ON s.customer_id = c.id
      JOIN users e ON s.employee_id = e.id
      WHERE s.phone_id = ?
    `, [phone.id]);

    res.json({
      success: true,
      phone,
      sale: sales[0] || null
    });
  } catch (error) {
    console.error('Get sale by IMEI error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Tüm satış kayıtlarını listele
const getAllSales = async (req, res) => {
  try {
    const [sales] = await pool.query(`
      SELECT s.*, 
             p.imei,
             p.brand,
             p.model,
             c.name as customer_name,
             c.phone as customer_phone,
             c.email as customer_email,
             e.name as employee_name,
             s.payment_status,
             s.delivery_status
      FROM sales s
      JOIN phones p ON s.phone_id = p.id
      JOIN users c ON s.customer_id = c.id
      JOIN users e ON s.employee_id = e.id
      ORDER BY s.sale_date DESC
    `);

    res.json({
      success: true,
      sales
    });
  } catch (error) {
    console.error('Get all sales error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Müşteriye göre satış geçmişini getir
const getCustomerSales = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const [sales] = await pool.query(`
      SELECT s.*, 
             p.imei,
             p.brand,
             p.model,
             e.name as employee_name,
             s.payment_status,
             s.delivery_status
      FROM sales s
      JOIN phones p ON s.phone_id = p.id
      JOIN users e ON s.employee_id = e.id
      WHERE s.customer_id = ?
      ORDER BY s.sale_date DESC
    `, [customer_id]);

    res.json({
      success: true,
      sales
    });
  } catch (error) {
    console.error('Get customer sales error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
const getTodaySalesCount = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT COUNT(*) as count FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `);
    res.json({ success: true, count: result[0].count });
  } catch (error) {
    console.error("Bugünkü satışları alırken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getTodaySalesTotalAmount = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT SUM(p.price) as total_amount
      FROM sales s
      JOIN phones p ON s.phone_id = p.id
      WHERE DATE(s.sale_date) = CURDATE()
    `);

    const total = result[0].total_amount || 0;

    res.json({ success: true, total_amount: total });
  } catch (error) {
    console.error("Bugünkü satış tutarı alınamadı:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


module.exports = {
  createSale,
  getSaleByImei,
  getAllSales,
  getCustomerSales,
  getTodaySalesCount,
  getTodaySalesTotalAmount
}; 