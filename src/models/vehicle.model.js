const db = require('../config/database');

class Vehicle {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM vehicles ORDER BY id');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM vehicles WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(vehicleData) {
    const { registrationNumber, make, model, year, rentPrice } = vehicleData;
    const [result] = await db.execute(
      'INSERT INTO vehicles (registration_number, make, model, year, rent_price) VALUES (?, ?, ?, ?, ?)',
      [registrationNumber, make, model, year, rentPrice]
    );
    return this.findById(result.insertId);
  }

  static async update(id, vehicleData) {
    const { registrationNumber, make, model, year, rentPrice } = vehicleData;
    await db.execute(
      'UPDATE vehicles SET registration_number = ?, make = ?, model = ?, year = ?, rent_price = ? WHERE id = ?',
      [registrationNumber, make, model, year, rentPrice, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM vehicles WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async findByRegistration(registrationNumber) {
    const [rows] = await db.execute(
      'SELECT * FROM vehicles WHERE registration_number = ?',
      [registrationNumber]
    );
    return rows[0];
  }

  static async findByPriceRange(minPrice, maxPrice) {
    const [rows] = await db.execute(
      'SELECT * FROM vehicles WHERE rent_price BETWEEN ? AND ?',
      [minPrice, maxPrice]
    );
    return rows;
  }
}

module.exports = Vehicle; 