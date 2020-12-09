const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');

module.exports = setRelations = () => {
  // Product-User Logic (user owns an uploaded product)
  Product.belongsTo(User, { contraints: true, onDelete: 'CASCADE' }); //when user is deleted, products are deleted too
  User.hasMany(Product); // as in uploads many products *

  // Cart-User Logic
  User.hasOne(Cart);
  Cart.belongsTo(User); // this line is redundant to the above

  // Product-Cart logic (Cart-item table)
  Product.belongsToMany(Cart, { through: CartItem });
  Cart.belongsToMany(Product, { through: CartItem }); //this means products are linked to carts through a table called Cart-items (in which these relations are stored)

  // Order-User-Product logic (Order-item table)
  Order.belongsTo(User); //here its not Order-Cart-User (Order.belongsTo(Cart)) because we cant to use the same cart to shop for other things once an order is paid
  Product.belongsToMany(Order, { through: OrderItem });
  // Order.belongsToMany(Product, { through: OrderItem }); //not necessary
};
