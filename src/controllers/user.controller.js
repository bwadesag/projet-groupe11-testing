const User = require('../models/user.model');
const JWTService = require('../services/jwt.service');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const userWithEmail = await User.findByEmail(email);
      if (userWithEmail && userWithEmail.id !== parseInt(id)) {
        return res.status(409).json({ 
          message: 'Cet email est déjà utilisé par un autre utilisateur' 
        });
      }
    }

    const user = await User.update(id, { name, email, password, role });
    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Générer les tokens
    const tokens = JWTService.generateTokenPair(user);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        message: 'Token de rafraîchissement requis' 
      });
    }

    // Vérifier le refresh token
    const decoded = JWTService.verifyRefreshToken(refreshToken);
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Générer de nouveaux tokens
    const tokens = JWTService.generateTokenPair(user);

    res.json({
      message: 'Tokens rafraîchis avec succès',
      tokens
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await User.delete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 