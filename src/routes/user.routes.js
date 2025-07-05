const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, requireAdmin, requireAuth } = require('../middleware/auth');
const { 
  validateCreateUser, 
  validateUpdateUser, 
  validateLogin, 
  validateRefreshToken 
} = require('../middleware/validation');

// Routes publiques (pas d'authentification requise)
router.post('/register', validateCreateUser, userController.createUser);
router.post('/login', validateLogin, userController.login);
router.post('/refresh-token', validateRefreshToken, userController.refreshToken);

// Routes protégées (authentification requise)
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, requireAuth, userController.getUserById);
router.put('/:id', authenticateToken, requireAuth, validateUpdateUser, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

module.exports = router; 