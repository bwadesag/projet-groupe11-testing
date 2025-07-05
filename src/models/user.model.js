const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    return this.findById(result.insertId);
  }

  static async update(id, userData) {
    const { name, email, password, role } = userData;
    
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    if (hashedPassword) {
      await db.execute(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [name, email, hashedPassword, role, id]
      );
    } else {
      await db.execute(
        'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
        [name, email, role, id]
      );
    }
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id'
    );
    return rows;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 