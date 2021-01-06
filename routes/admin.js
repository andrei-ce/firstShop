const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const validators = require('../middleware/validators');

router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, validators.validateAddProduct, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, validators.validateAddProduct, adminController.postEditProduct);

router.delete('/delete-product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
