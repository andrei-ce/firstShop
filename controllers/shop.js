// >>> ALL LOGIC THAT A SHOPPING CUSTOMER NEEDS <<<

const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getIndex = async (req, res, next) => {
  try {
    let allProducts = await Product.findAll();
    res.render('shop/index', {
      prods: allProducts,
      pageTitle: 'Shop',
      path: '/',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    let allProducts = await Product.findAll();
    res.render('shop/product-list', {
      prods: allProducts,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res, next) => {
  var prodId = req.params.prodId;
  try {
    let product = await Product.findByPk(prodId);
    // let products = await Product.findAll({where: {íd: prodId}}); //returns array of 1 el
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  const user = req.user; //from middleware
  try {
    let cart = await user.getCart(); //this works because a cart is connected to this user and mySQL adds functions like getCart()
    let cartProducts = await cart.getProducts();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user; //from middleware
  try {
    let cart = await user.getCart();
    let selectedProducts = await cart.getProducts({ where: { id: prodId } });
    let product;
    let newQty = 1;
    if (selectedProducts.length > 0) {
      console.log('Product already in cart!');
      product = selectedProducts[0];
      const oldQty = product.cartItem.quantity;
      newQty = oldQty + 1;
    } else {
      console.log('New product (in cart)!');
      product = await Product.findByPk(prodId);
    }
    await cart.addProduct(product, { through: { quantity: newQty } });
    res.redirect('/cart');
    console.log('The end');
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  console.log('=====================*====================');
  const prodId = req.params.prodId;
  const user = req.user;
  try {
    let currentCart = await user.getCart();
    let selectedProducts = await currentCart.getProducts({ where: { id: prodId } });
    let product = selectedProducts[0];
    await product.cartItem.destroy();
  } catch (error) {
    console.log(error);
  }
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
