const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');

const store = new MongoDBStore({
  uri: config.get('mongoURI'),
  collection: 'sessions',
});

const sessionConfig = session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { httpOnly: true },
});

module.exports = sessionConfig;
