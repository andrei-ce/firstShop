const db = require('../config/db');
const { Sequelize } = require('sequelize');

//this starts a connection pool
const sequelize = new Sequelize('node-complete', 'root', db.pw, {
  dialect: 'mysql',
  host: 'localhost',
});

const connect = async () => {
  try {
    // await sequelize.sync({ force: true }); //overwrites all data!!!!
    let result = await sequelize.sync();
    await createDummyData();
    console.log('MySQL connected!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Just so when I {force: true}, it creates a user with a cart associated
const createDummyData = async () => {
  const Product = require('../models/product');
  const User = require('../models/user');
  const Cart = require('../models/cart');
  try {
    let user = await User.findByPk(1);
    if (!user) {
      let createdUser = await User.create({ name: 'Max', email: 'max@text.com' });
      console.log('Creating new user with id 1:');
      console.log(createdUser);
      let cart = await createdUser.createCart();
      console.log(cart);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connect,
  sequelize,
};
