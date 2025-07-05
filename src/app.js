const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicle.routes');
const errorHandler = require('./middleware/error.handler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 