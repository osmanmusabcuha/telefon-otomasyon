const pool = require('../db');

// Tüm telefonları listele
const getAllPhones = async (req, res) => {
  try {
    const [phones] = await pool.query('SELECT * FROM phones');
    res.json({ success: true, phones });
  } catch (error) {
    console.error('Get all phones error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// IMEI ile telefon sorgula
const getPhoneByImei = async (req, res) => {
  try {
    const { imei } = req.params;

    // Telefon bilgilerini al
    const [phones] = await pool.query('SELECT * FROM phones WHERE imei = ?', [imei]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    // Eğer telefon satılmışsa, satış bilgilerini de getir
    if (phone.status === 'sold') {
      const [sales] = await pool.query(`
        SELECT s.*, 
               c.name as customer_name, 
               c.phone as customer_phone,
               e.name as employee_name
        FROM sales s
        JOIN users c ON s.customer_id = c.id
        JOIN users e ON s.employee_id = e.id
        WHERE s.phone_id = ?
      `, [phone.id]);

      if (sales[0]) {
        phone.saleInfo = sales[0];
      }
    }

    res.json({ success: true, phone });
  } catch (error) {
    console.error('Get phone by IMEI error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni telefon ekle
const addPhone = async (req, res) => {
  try {
    const { brand, model, imei, price, warranty_period } = req.body;

    // IMEI kontrolü
    const [existingPhones] = await pool.query('SELECT * FROM phones WHERE imei = ?', [imei]);
    if (existingPhones.length > 0) {
      return res.status(400).json({ message: 'Bu IMEI numarası zaten kayıtlı' });
    }

    // Telefonu ekle
    const [result] = await pool.query(
      'INSERT INTO phones (brand, model, imei, price, warranty_period) VALUES (?, ?, ?, ?, ?)',
      [brand, model, imei, price, warranty_period]
    );

    res.status(201).json({
      success: true,
      message: 'Telefon başarıyla eklendi',
      phoneId: result.insertId
    });
  } catch (error) {
    console.error('Add phone error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Telefon durumunu güncelle
const updatePhoneStatus = async (req, res) => {
  try {
    const { imei } = req.params;
    const { status } = req.body;

    // Geçerli durum kontrolü
    const validStatuses = ['available', 'sold', 'repairing', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    // Telefonu güncelle
    const [result] = await pool.query(
      'UPDATE phones SET status = ?, updated_at = NOW() WHERE imei = ?',
      [status, imei]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    res.json({
      success: true,
      message: 'Telefon durumu güncellendi'
    });
  } catch (error) {
    console.error('Update phone status error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

const getAvailablePhones = async (req, res) => {
  try {
    const [phones] = await pool.query(
      'SELECT id, brand, model, imei FROM phones WHERE status = ?',
      ['available']
    );
    res.json({ phones });
  } catch (err) {
    console.error('Get available phones error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
const getAvailablePhonesStructured = async (req, res) => {
  try {
    const [phones] = await pool.query(
      'SELECT id, brand, model, imei, price FROM phones WHERE status = ?', ['available']
    );

    res.json({ phones });
  } catch (err) {
    console.error('Structured phone list error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
const getSoldPhonesStructured = async (req, res) => {
  try {
    const [phones] = await pool.query(`
      SELECT 
  p.id, p.brand, p.model, p.imei, p.price, p.status, s.customer_id
FROM phones p
JOIN sales s ON s.phone_id = p.id
WHERE p.status = 'sold'

    `);

    res.json({ phones });
  } catch (err) {
    console.error('Get sold phones error:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};



module.exports = {
  getAllPhones,
  getPhoneByImei,
  addPhone,
  updatePhoneStatus,
  getAvailablePhones,
  getAvailablePhonesStructured,
  getSoldPhonesStructured

};


