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
    console.log('MySQL connected!');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = {
  connect,
  sequelize,
};
