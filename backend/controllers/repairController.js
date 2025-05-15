const pool = require('../db');

// Yeni tamir kaydı oluştur
const createRepair = async (req, res) => {
  try {
    console.log("📥 Gelen veri:", req.body);
    console.log("🔑 Giriş yapan kullanıcı:", req.user);

    const { phone_id, customer_id, issue_type, description, repair_fee } = req.body;
    const employee_id = req.user?.id;

    if (!phone_id || !customer_id || !issue_type || !description || employee_id === undefined) {
      return res.status(400).json({ message: 'Eksik veri gönderildi' });
    }

    const [phones] = await pool.query('SELECT * FROM phones WHERE id = ?', [phone_id]);
    if (phones.length === 0) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    const [result] = await pool.query(
      'INSERT INTO repairs (phone_id, customer_id, employee_id, issue_type, description, repair_fee) VALUES (?, ?, ?, ?, ?, ?)',
      [phone_id, customer_id, employee_id, issue_type, description, Number(repair_fee) || 0]
    );

    await pool.query('UPDATE phones SET status = ? WHERE id = ?', ['repairing', phone_id]);
    await pool.query(
      'INSERT INTO phone_stock_changes (phone_id, change_type, change_date) VALUES (?, ?, NOW())',
      [phone_id, 'repaired']
    );
    await pool.query(
      'INSERT INTO customer_issues (phone_id, customer_id, employee_id, issue_type, description, issue_status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [phone_id, customer_id, employee_id, issue_type, description, 'in_progress']
    );



    res.status(201).json({
      success: true,
      message: 'Tamir kaydı oluşturuldu',
      repairId: result.insertId
    });

  } catch (error) {
    console.error('Create repair error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const getCustomerRepairs = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const [repairs] = await pool.query(`
      SELECT r.*, 
             p.imei, p.brand, p.model,
             e.name as employee_name
      FROM repairs r
      JOIN phones p ON r.phone_id = p.id
      JOIN users e ON r.employee_id = e.id
      WHERE r.customer_id = ?
      ORDER BY r.created_at DESC
    `, [customer_id]);

    res.json({
      success: true,
      repairs
    });
  } catch (error) {
    console.error('Get customer repairs error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// IMEI'ye göre tamir geçmişini getir
const getRepairHistory = async (req, res) => {
  try {
    const { imei } = req.params;

    // Önce telefonu bul
    const [phones] = await pool.query('SELECT * FROM phones WHERE imei = ?', [imei]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    // Tamir geçmişini getir
    const [repairs] = await pool.query(`
      SELECT r.*, 
             c.name as customer_name,
             c.phone as customer_phone,
             e.name as employee_name
      FROM repairs r
      JOIN users c ON r.customer_id = c.id
      JOIN users e ON r.employee_id = e.id
      WHERE r.phone_id = ?
      ORDER BY r.created_at DESC
    `, [phone.id]);

    res.json({
      success: true,
      phone,
      repairs
    });
  } catch (error) {
    console.error('Get repair history error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tamir durumunu güncelle
const updateRepairStatus = async (req, res) => {
  try {
    const { repair_id } = req.params;
    const { status } = req.body;

    const [repairs] = await pool.query('SELECT * FROM repairs WHERE id = ?', [repair_id]);
    const repair = repairs[0];

    if (!repair) {
      return res.status(404).json({ message: 'Tamir kaydı bulunamadı' });
    }

    // Tamir durumunu güncelle
    await pool.query('UPDATE repairs SET repair_status = ?, updated_at = NOW() WHERE id = ?', [status, repair_id]);

    // Telefonun mevcut durumunu kontrol et
    const [phones] = await pool.query('SELECT * FROM phones WHERE id = ?', [repair.phone_id]);
    const phone = phones[0];

    if (!phone) {
      return res.status(404).json({ message: 'Telefon bulunamadı' });
    }

    if (status === 'completed') {
      // Telefon daha önce satıldıysa, tekrar 'sold' olarak işaretle
      const [sales] = await pool.query('SELECT * FROM sales WHERE phone_id = ?', [repair.phone_id]);
      const newStatus = sales.length > 0 ? 'sold' : 'available';

      await pool.query('UPDATE phones SET status = ? WHERE id = ?', [newStatus, repair.phone_id]);
    }

    res.json({
      success: true,
      message: 'Tamir durumu güncellendi',
    });
  } catch (error) {
    console.error('Update repair status error:', error.message);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};


// Tüm tamir kayıtlarını listele
const getAllRepairs = async (req, res) => {
  try {
    const [repairs] = await pool.query(`
      SELECT r.*, 
       p.imei,
       p.brand,
       p.model,
       c.name as customer_name,
       c.phone as customer_phone,
       e.name as employee_name,
       r.repair_fee
FROM repairs r
JOIN phones p ON r.phone_id = p.id
JOIN users c ON r.customer_id = c.id
JOIN users e ON r.employee_id = e.id
ORDER BY r.created_at DESC

    `);

    res.json({
      success: true,
      repairs
    });
  } catch (error) {
    console.error('Get all repairs error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = {
  createRepair,
  getRepairHistory,
  updateRepairStatus,
  getAllRepairs,
  getCustomerRepairs
}; 