// <* Imports *>
const path = require('path');
const express = require('express');
const sessionConfig = require('./middleware/sessions');
const userProvider = require('./middleware/userProvider');
const bodyParser = require('body-parser');
const connectDB = require('./services/db');
const User = require('./models/user');
// <* Imports *>

// <* Middlewares *>
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionConfig);
app.use(userProvider);
// <* Middlewares *>

// <* Routes *>
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
// <* Routes *>

// <* Database & Server spin-up *>
const PORT = process.env.PORT || 3000; //deployment looks for process.env.PORT
connectDB(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
// <* Database & Server spin-up *>
