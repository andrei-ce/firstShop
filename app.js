// ____ Imports ____
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const sessionConfig = require('./middleware/sessions');
const userProvider = require('./middleware/userProvider');
const connectDB = require('./services/db');
const sessionConfig = require('./middleware/sessions');
const csrfMiddleware = require('./middleware/csrf');
const csrf = require('csurf');

// ____ Middlewares ____
const app = express();
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionConfig);
app.use(csrfProtection);
app.use(userProvider);
app.use(csrfMiddleware);

// ____ Routes ____
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// ____ Database & Server spin-up ____
const PORT = process.env.PORT || 3000; //deployment looks for process.env.PORT
connectDB(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
