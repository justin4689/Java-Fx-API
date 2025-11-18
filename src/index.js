const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route santé pour les pings
app.get('/health', (req, res) => {
  console.log('✅ Health check reçu à', new Date().toISOString());
  res.status(200).json({ 
    status: 'OK',
    message: 'API en ligne',
    timestamp: new Date().toISOString()
  });
});
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ answer: "0", comment: 'Something broke!' });
});

// Start server AFTER DB connection
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to DB:", err);
});
