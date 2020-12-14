const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config');

const store = new MongoDBStore({
  uri: config.get('mongoURI'),
  collection: 'sessions',
  expires: 300,
});

const sessionConfig = session({
  secret: config.get('sessionSecret'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  store: store,
});

module.exports = sessionConfig;
