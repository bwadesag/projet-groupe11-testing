const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const { validateVehicle } = require('../middleware/validation');

// Toutes les routes véhicules nécessitent une authentification
router.use(authenticateToken);
router.use(requireAuth);

// Get all vehicles
router.get('/', vehicleController.getAllVehicles);

// Search by registration number
router.get('/registration/:number', vehicleController.getVehicleByRegistration);

// Search by price range
router.get('/price/range', vehicleController.getVehiclesByPriceRange);

// Get vehicle by ID
router.get('/:id', vehicleController.getVehicleById);

// Create new vehicle
router.post('/', validateVehicle, vehicleController.createVehicle);

// Update vehicle
router.put('/:id', validateVehicle, vehicleController.updateVehicle);

// Delete vehicle
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router; 