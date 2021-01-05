// ____ Imports ____
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const connectDB = require('./services/db');
const userProvider = require('./middleware/userProvider');
const sessionConfig = require('./middleware/sessions');
const csrfMiddleware = require('./middleware/csrf');
const upload = require('./middleware/storage');

// ____ Middlewares ____
const app = express();
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
//use multer file parser to look for incoming files in any request. This is not recommended in multer docs. Only endpoints that receive files should have this middleware. As of now, if I add in the admin routes, it would crash.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(upload.single('image'));
app.use(sessionConfig);
app.use(csrfProtection);
app.use(userProvider);
app.use(csrfMiddleware);
app.use(flash());

// ____ Routes ____
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

//this would never be reached if there wasnt a 4 arg middleware below
app.use((error, req, res, next) => {
  // console.log(error.httpStatusCode);
  console.log(error);
  res.redirect('/500');
});

// ____ Database & Server spin-up ____
const PORT = process.env.PORT || 3000; //deployment looks for process.env.PORT
connectDB(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
