// >>> ALL LOGIC THAT A SHOPPING CUSTOMER NEEDS <<<

const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find((p) => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  console.log('123');
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.params.prodId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
  });
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
