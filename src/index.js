const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoute);

// Default route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API JavaFX</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .container {
          text-align: center;
          padding: 2rem;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #727cf5;
          margin-bottom: 1rem;
        }
        p {
          color: #666;
          margin-bottom: 1.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bienvenue sur l'API du Projet JavaFX</h1>
        <p>L'API est opérationnelle et prête à recevoir des requêtes.</p>
      </div>
    </body>
    </html>
  `);
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
