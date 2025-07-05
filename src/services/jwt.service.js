const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'propelize-secret-key-2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'propelize-refresh-secret-key-2024';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

class JWTService {
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token d\'accès invalide');
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Token de rafraîchissement invalide');
    }
  }

  static generateTokenPair(user) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
      expiresIn: 900 // 15 minutes en secondes
    };
  }
}

module.exports = JWTService; 