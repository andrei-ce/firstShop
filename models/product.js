const Cart = require('./cart');
const db = require('../util/db');

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [
      this.title,
      this.price,
      this.imageUrl,
      this.description,
    ]);
  }

  static deleteById(prodId) {}

  static fetchAll() {
    return db.query('SELECT * FROM products');
  }

  static findById(prodId) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [prodId]);
  }
};
