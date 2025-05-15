const mysql = require('mysql2/promise');
require('dotenv').config();

// Veritabanı bağlantısı oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // .env dosyasından DB_HOST değeri alınır
  user: process.env.DB_USER,       // .env dosyasından DB_USER değeri alınır
  password: process.env.DB_PASSWORD, // .env dosyasından DB_PASSWORD değeri alınır
  database: process.env.DB_NAME    // .env dosyasından DB_NAME değeri alınır
});

// Bağlantıyı kontrol etmek için
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Veritabanı bağlantısı hatalı:', err);
    return;
  }
  console.log('Veritabanına bağlanıldı');
  connection.release();  // Bağlantıyı serbest bırakıyoruz
});

module.exports = pool;  // pool'u dışa aktarıyoruz
