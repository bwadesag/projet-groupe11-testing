const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicle.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/error.handler');

const app = express();

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Propelize opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Ne démarrer le serveur que si ce fichier est exécuté directement
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Propelize API démarré sur le port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 API Utilisateurs: http://localhost:${PORT}/api/users`);
    console.log(`🚗 API Véhicules: http://localhost:${PORT}/api/vehicles`);
  });
}

module.exports = app; 