const JWTService = require('../services/jwt.service');
const User = require('../models/user.model');

// Middleware pour vérifier l'authentification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Token d\'accès requis' 
      });
    }

    // Vérifier le token
    const decoded = JWTService.verifyAccessToken(token);
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      message: 'Token invalide ou expiré' 
    });
  }
};

// Middleware pour vérifier les rôles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentification requise' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = authorizeRole(['admin']);

// Middleware pour vérifier si l'utilisateur est admin ou user
const requireAuth = authorizeRole(['admin', 'user']);

module.exports = {
  authenticateToken,
  authorizeRole,
  requireAdmin,
  requireAuth
}; 