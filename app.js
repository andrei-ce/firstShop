const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./services/db');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const connectDB = require('./services/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5fd341b466206005779998d6')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//deployment looks for process.env.PORT
const PORT = process.env.PORT || 3000;

connectDB(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
