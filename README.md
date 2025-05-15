# Telefon Tamir ve Satış Otomasyonu Backend

Bu proje, telefon tamir ve satış işlemlerini yönetmek için geliştirilmiş bir backend API'sidir.

## 🚀 Özellikler

- Kullanıcı rolleri (admin, employee, customer)
- Telefon yönetimi (ekleme, durum güncelleme, IMEI sorgulama)
- Tamir işlemleri
- Satış işlemleri
- İade işlemleri
- JWT tabanlı kimlik doğrulama

## 🛠️ Teknolojiler

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- bcrypt

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MySQL (v8.0 veya üzeri)

## 🔧 Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd telefon-otomasyonu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=telefon_otomasyonu2
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

4. Veritabanını oluşturun:
```bash
mysql -u root -p < database.sql
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

## 📚 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/register` - Yeni kullanıcı kaydı

### Telefonlar
- `GET /api/phones` - Tüm telefonları listele
- `GET /api/phones/:imei` - IMEI ile telefon sorgula
- `POST /api/phones` - Yeni telefon ekle
- `PATCH /api/phones/:imei/status` - Telefon durumunu güncelle

### Tamirler
- `POST /api/repairs` - Yeni tamir kaydı oluştur
- `GET /api/repairs/history/:imei` - IMEI'ye göre tamir geçmişi
- `PATCH /api/repairs/:repair_id/status` - Tamir durumunu güncelle
- `GET /api/repairs` - Tüm tamir kayıtlarını listele

### Satışlar
- `POST /api/sales` - Yeni satış kaydı oluştur
- `GET /api/sales/imei/:imei` - IMEI'ye göre satış bilgileri
- `GET /api/sales` - Tüm satış kayıtlarını listele
- `GET /api/sales/customer/:customer_id` - Müşteriye göre satış geçmişi

### İadeler
- `POST /api/returns` - Yeni iade kaydı oluştur
- `GET /api/returns/imei/:imei` - IMEI'ye göre iade bilgileri
- `GET /api/returns` - Tüm iade kayıtlarını listele
- `GET /api/returns/customer/:customer_id` - Müşteriye göre iade geçmişi

## 👥 Kullanıcı Rolleri

### Admin
- Tüm işlemlere erişim
- Kullanıcı yönetimi
- Sistem ayarları

### Employee (Çalışan)
- Telefon ekleme
- Satış işlemleri
- Tamir işlemleri
- İade işlemleri

### Customer (Müşteri)
- Kendi satış geçmişi
- Kendi tamir geçmişi
- Kendi iade geçmişi
- IMEI sorgulama

## 🔐 Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme
- Şifre hashleme (bcrypt)
- SQL injection koruması
- XSS koruması

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 
