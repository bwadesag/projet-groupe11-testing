const Joi = require('joi');

const vehicleSchema = Joi.object({
  registrationNumber: Joi.string()
    .pattern(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Le numéro d\'immatriculation doit être au format AA-123-BB'
    }),
  
  make: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'La marque doit contenir au moins 2 caractères',
      'string.max': 'La marque ne peut pas dépasser 50 caractères'
    }),
  
  model: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Le modèle doit contenir au moins 2 caractères',
      'string.max': 'Le modèle ne peut pas dépasser 50 caractères'
    }),
  
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.min': 'L\'année doit être supérieure à 1900',
      'number.max': 'L\'année ne peut pas être supérieure à l\'année prochaine'
    }),
  
  rentPrice: Joi.number()
    .precision(2)
    .min(0)
    .required()
    .messages({
      'number.min': 'Le prix de location doit être positif'
    })
});

exports.validateVehicle = (req, res, next) => {
  const { error } = vehicleSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
    
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }
  
  next();
}; 