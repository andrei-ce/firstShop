const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/products => GET
router.get('/edit-product/:prodId', adminController.getEditProduct);

// /admin/edit-products => POST
router.post('/edit-product', adminController.postEditProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/delete-product => POST
router.post('/delete-product/:prodId', adminController.postDeleteProduct);

module.exports = router;
