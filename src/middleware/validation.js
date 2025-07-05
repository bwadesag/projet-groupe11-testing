const Joi = require('joi');

// Schéma de validation pour les véhicules
const vehicleSchema = Joi.object({
  registrationNumber: Joi.string().pattern(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/).required()
    .messages({
      'string.pattern.base': 'Le numéro d\'immatriculation doit être au format XX-123-XX',
      'any.required': 'Le numéro d\'immatriculation est requis'
    }),
  make: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'La marque doit contenir au moins 2 caractères',
      'string.max': 'La marque ne peut pas dépasser 50 caractères',
      'any.required': 'La marque est requise'
    }),
  model: Joi.string().min(2).max(50).required()
    .messages({
      'string.min': 'Le modèle doit contenir au moins 2 caractères',
      'string.max': 'Le modèle ne peut pas dépasser 50 caractères',
      'any.required': 'Le modèle est requis'
    }),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required()
    .messages({
      'number.base': 'L\'année doit être un nombre',
      'number.integer': 'L\'année doit être un nombre entier',
      'number.min': 'L\'année doit être supérieure à 1900',
      'number.max': 'L\'année ne peut pas dépasser l\'année suivante',
      'any.required': 'L\'année est requise'
    }),
  rentPrice: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'Le prix de location doit être un nombre',
      'number.positive': 'Le prix de location doit être positif',
      'number.precision': 'Le prix de location ne peut avoir que 2 décimales',
      'any.required': 'Le prix de location est requis'
    })
});

// Schéma de validation pour la création d'utilisateur
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est requis'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'L\'email doit être un email valide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
  role: Joi.string().valid('admin', 'user').default('user')
    .messages({
      'any.only': 'Le rôle doit être "admin" ou "user"'
    })
});

// Schéma de validation pour la mise à jour d'utilisateur
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100)
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères'
    }),
  email: Joi.string().email()
    .messages({
      'string.email': 'L\'email doit être un email valide'
    }),
  password: Joi.string().min(6)
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères'
    }),
  role: Joi.string().valid('admin', 'user')
    .messages({
      'any.only': 'Le rôle doit être "admin" ou "user"'
    })
});

// Schéma de validation pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'L\'email doit être un email valide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Le mot de passe est requis'
    })
});

// Schéma de validation pour le refresh token
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'any.required': 'Le token de rafraîchissement est requis'
    })
});

// Middleware de validation générique
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Middlewares de validation spécifiques
const validateVehicle = validate(vehicleSchema);
const validateCreateUser = validate(createUserSchema);
const validateUpdateUser = validate(updateUserSchema);
const validateLogin = validate(loginSchema);
const validateRefreshToken = validate(refreshTokenSchema);

module.exports = {
  validateVehicle,
  validateCreateUser,
  validateUpdateUser,
  validateLogin,
  validateRefreshToken
}; 