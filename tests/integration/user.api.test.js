const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const JWTService = require('../../src/services/jwt.service');
const bcrypt = require('bcryptjs');

// Mock de la base de données
jest.mock('../../src/config/database', () => ({
  execute: jest.fn()
}));

// Mock du service JWT
jest.mock('../../src/services/jwt.service', () => ({
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  generateTokenPair: jest.fn()
}));

const db = require('../../src/config/database');

describe('User API Integration Tests', () => {
  let server;

  beforeAll(() => {
    // Démarrer le serveur sur un port différent pour les tests
    server = app.listen(3001);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      // Mock: user doesn't exist
      db.execute.mockResolvedValueOnce([[]]);
      
      // Mock: insert user
      db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      
      // Mock: get created user
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      ]]);

      const response = await request(server)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('name', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(server)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Données invalides');
      expect(response.body.errors).toContain('L\'email doit être un email valide');
    });

    it('should return 400 for short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const response = await request(server)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.errors).toContain('Le mot de passe doit contenir au moins 6 caractères');
    });

    it('should return 409 for existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock: user already exists
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'Existing User',
          email: 'existing@example.com'
        }
      ]]);

      const response = await request(server)
        .post('/api/users/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Un utilisateur avec cet email existe déjà');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      // Créer un vrai hash bcrypt
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Mock: user exists
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          password: hashedPassword,
          role: 'user'
        }
      ]]);

      // Mock: JWT tokens
      JWTService.generateTokenPair.mockReturnValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 900
      });

      const response = await request(server)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock: user doesn't exist
      db.execute.mockResolvedValueOnce([[]]);

      const response = await request(server)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(server)
        .get('/api/users')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Token d\'accès requis');
    });

    it('should return users for admin user', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
      ];

      // Mock: JWT verification (admin user)
      JWTService.verifyAccessToken.mockReturnValue({
        id: 2,
        email: 'jane@example.com',
        role: 'admin'
      });

      // Mock: get user by token (admin) - appelé par authenticateToken
      db.execute.mockResolvedValueOnce([[
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin'
        }
      ]]);

      // Mock: get all users - appelé par getAllUsers
      db.execute.mockResolvedValueOnce([mockUsers]);

      const response = await request(server)
        .get('/api/users')
        .set('Authorization', 'Bearer valid-admin-token')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      // Mock: JWT verification
      JWTService.verifyAccessToken.mockReturnValue({
        id: 1,
        email: 'john@example.com',
        role: 'user'
      });

      // Mock: get user by token - appelé par authenticateToken
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      ]]);

      // Mock: get user to update (même utilisateur) - appelé par updateUser
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      ]]);

      // Mock: check if email is used by another user (pas de conflit) - appelé par updateUser
      db.execute.mockResolvedValueOnce([[]]);

      // Mock: update user - appelé par updateUser
      db.execute.mockResolvedValueOnce([]);

      // Mock: get updated user - appelé par updateUser
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Updated',
          email: 'john.updated@example.com',
          role: 'user'
        }
      ]]);

      const response = await request(server)
        .put('/api/users/1')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Utilisateur mis à jour avec succès');
      expect(response.body.user).toHaveProperty('name', 'John Updated');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user for admin', async () => {
      // Mock: JWT verification (admin user)
      JWTService.verifyAccessToken.mockReturnValue({
        id: 2,
        email: 'jane@example.com',
        role: 'admin'
      });

      // Mock: get user by token (admin) - appelé par authenticateToken
      db.execute.mockResolvedValueOnce([[
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin'
        }
      ]]);

      // Mock: delete user - appelé par deleteUser
      db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await request(server)
        .delete('/api/users/1')
        .set('Authorization', 'Bearer valid-admin-token')
        .expect(204);
    });

    it('should return 403 for non-admin user', async () => {
      // Mock: JWT verification (user, not admin)
      JWTService.verifyAccessToken.mockReturnValue({
        id: 1,
        email: 'john@example.com',
        role: 'user'
      });

      // Mock: get user by token (user, not admin) - appelé par authenticateToken
      db.execute.mockResolvedValueOnce([[
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      ]]);

      const response = await request(server)
        .delete('/api/users/1')
        .set('Authorization', 'Bearer valid-user-token')
        .expect(403);

      expect(response.body).toHaveProperty('message', 'Accès refusé. Permissions insuffisantes.');
    });
  });
}); 