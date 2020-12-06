const Product = require('../models/product');
const User = require('../models/user');

module.exports = setRelations = () => {
  Product.belongsTo(User, { contraints: true, onDelete: 'CASCADE' });
  User.hasMany(Product);
};
