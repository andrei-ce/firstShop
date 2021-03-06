const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);

router.post('/add-to-cart', shopController.postCart);

router.post('/delete-cart-item/:prodId', shopController.postDeleteCartItem);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

router.get('/products/:prodId', shopController.getProduct);

module.exports = router;
