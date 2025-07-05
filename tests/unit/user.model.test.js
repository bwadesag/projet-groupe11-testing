const User = require('../../src/models/user.model');
const bcrypt = require('bcryptjs');

// Mock de la base de données
jest.mock('../../src/config/database', () => ({
  execute: jest.fn()
}));

const db = require('../../src/config/database');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      db.execute.mockResolvedValueOnce([[mockUser]]);

      const result = await User.findById(1);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      db.execute.mockResolvedValueOnce([[]]);

      const result = await User.findById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user'
      };

      db.execute.mockResolvedValueOnce([[mockUser]]);

      const result = await User.findByEmail('john@example.com');

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['john@example.com']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      };

      const mockInsertResult = { insertId: 1 };
      const mockCreatedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      db.execute
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([[mockCreatedUser]]);

      const result = await User.create(userData);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        expect.arrayContaining([
          'John Doe',
          'john@example.com',
          expect.any(String), // hashed password
          'user'
        ])
      );
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('update', () => {
    it('should update user with new password', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        password: 'newpassword123',
        role: 'admin'
      };

      const mockUpdatedUser = {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'admin'
      };

      db.execute
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([[mockUpdatedUser]]);

      const result = await User.update(1, updateData);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        expect.arrayContaining([
          'John Updated',
          'john.updated@example.com',
          expect.any(String), // hashed password
          'admin',
          1
        ])
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should update user without password', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'admin'
      };

      const mockUpdatedUser = {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'admin'
      };

      db.execute
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([[mockUpdatedUser]]);

      const result = await User.update(1, updateData);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        ['John Updated', 'john.updated@example.com', 'admin', 1]
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('delete', () => {
    it('should delete user and return true', async () => {
      db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await User.delete(1);

      expect(db.execute).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        [1]
      );
      expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
      db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await User.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
      ];

      db.execute.mockResolvedValueOnce([mockUsers]);

      const result = await User.findAll();

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id'
      );
      expect(result).toEqual(mockUsers);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.verifyPassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.verifyPassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });
  });
}); 