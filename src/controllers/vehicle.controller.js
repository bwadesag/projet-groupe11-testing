const Vehicle = require('../models/vehicle.model');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.update(req.params.id, req.body);
    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const result = await Vehicle.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getVehicleByRegistration = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByRegistration(req.params.number);
    if (!vehicle) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.getVehiclesByPriceRange = async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const vehicles = await Vehicle.findByPriceRange(
      parseFloat(min) || 0,
      parseFloat(max) || Number.MAX_VALUE
    );
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
}; 