const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const addUserToRequest = require('./middleWare/addUser');
const DB = require('./util/db');
const setRelations = require('./util/relations');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(addUserToRequest);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//connect MySQL
setRelations();
DB.connect();

app.listen(3000, () => console.log('Server listening on port 3000...'));
