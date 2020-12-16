const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res) => {
  try {
    let products = await Product.find();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const prodId = req.params.productId;
    let product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res) => {
  try {
    let products = await Product.find();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res) => {
  try {
    //execPopulate() is needed because req.user is an existing document
    let user = await req.user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items;
    console.log(products);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res) => {
  try {
    const prodId = req.body.productId;
    let product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.postCartDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    await req.user.removeFromCart(prodId);
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res) => {
  try {
    let user = await req.user.populate('cart.items.productId').execPopulate();
    let products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } }; //normal object, not Mongoose Full OBJ
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user._id,
      },
      products: products,
    });
    await order.save();
    await user.clearCart();
    res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find({ 'user.userId': req.user._id });
    console.log(orders);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    console.log(error);
  }
};
