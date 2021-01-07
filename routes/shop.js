const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout', isAuth, shopController.getCheckout);
// if it fails i want to redirect to the checkout page again
router.get('/checkout/cancel', isAuth, shopController.getCheckout);
// if payment succeeds i want to create an order (old '/create-order'route using shopController.postOrder )
router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);

module.exports = router;
