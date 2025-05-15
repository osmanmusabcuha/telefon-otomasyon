const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // Veritabanı bağlantısını import ettik

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/phones', require('./routes/phoneRoutes'));
app.use('/api/repairs', require('./routes/repairRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/external', require('./routes/externalRoutes'));
app.use('/api/external-phone', require('./routes/externalPhoneRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
