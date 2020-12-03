const db = require('../config/db');
const mysql = require('mysql2');

// const pool = mysql.createConnection()

// Each query needs its own connection. A pool of connections
// lets us make many queries without having to connect/disconnect
// multiple times - that would use the code commented above

// A pool is only disconnected when the app is shut down
const pool = mysql.createPool({
  host: 'localHost',
  user: 'root',
  database: 'node-complete',
  password: db.pw,
});

//This way is a specially useful to transform queries into Promises
module.exports = pool.promise();
