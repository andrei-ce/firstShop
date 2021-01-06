const Product = require('../models/product');
const Order = require('../models/order');
const returnError = require('../services/returnError');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 2;

exports.getProducts = async (req, res, next) => {
  try {
    const page =
      +req.query.page || //+ is to turn into number
      1; //1 is to load if the user had enter no page parameter in the url
    let prodCount = await Product.find().countDocuments();
    let products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuth: req.session.isAuth,
      prodCount: prodCount,
      currentPage: page,
      //not really using these variables below because I will load all page buttons
      hasNextPage: ITEMS_PER_PAGE * page < prodCount,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(prodCount / ITEMS_PER_PAGE),
    });
  } catch (error) {
    returnError(error, next);
  }
};

exports.getProduct = async (req, res, next) => {
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
    returnError(error, next);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const page =
      +req.query.page || //+ is to turn into number
      1; //1 is to load if the user had enter no page parameter in the url
    let prodCount = await Product.find().countDocuments();
    let products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuth: req.session.isAuth,
      prodCount: prodCount,
      currentPage: page,
      //not really using these variables below because I will load all page buttons
      hasNextPage: ITEMS_PER_PAGE * page < prodCount,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(prodCount / ITEMS_PER_PAGE),
    });
  } catch (error) {
    returnError(error, next);
  }
};

exports.getCart = async (req, res, next) => {
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
    returnError(error, next);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    let product = await Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (error) {
    returnError(error, next);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.removeFromCart(prodId);
    res.redirect('/cart');
  } catch (error) {
    returnError(error, next);
  }
};

exports.getCheckout = async (req, res, next) => {
  try {
    let user = await req.user.populate('cart.items.productId').execPopulate();
    const products = user.cart.items;
    //total price:
    let total = 0;
    products.forEach((p) => (total += p.quantity * p.productId.price));

    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products: products,
      totalPrice: total,
      isAuth: req.session.isAuth,
    });
  } catch (error) {
    returnError(error, next);
  }
};

exports.postOrder = async (req, res, next) => {
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
    returnError(error, next);
  }
};

exports.getOrders = async (req, res, next) => {
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
    returnError(error, next);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error('No orders found'));
    } else if (order.user.userId.toString() != req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }

    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    //READING, STORING IN SERVER MEMORY AND SERVING FILE
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   } else {
    //     res.setHeader('Content-Type', 'application/pdf');
    //     //change inline to attachment to download file
    //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    //     res.send(data);
    //   }
    // });

    // //STREAMING THE FILE IN CHUNKS
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    // //as the response is a writable stream object, we can call file.pipe() on the response
    // file.pipe(res);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(invoicePath));
    doc.pipe(res);

    doc.fontSize(20).text('Vantage Parts: Invoice', { align: 'center', underline: true });
    doc.moveDown();

    //price items and total price calculation logic
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      doc.fontSize(10).text(`${prod.product.title} .................... ${prod.quantity} x $ ${prod.product.price}`, {
        align: 'right',
      });
    });

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(12).text('---------------------------', { align: 'right' });
    doc.fontSize(12).text(`Total price: $${totalPrice}`, { align: 'right' });

    doc.end();
  } catch (error) {
    returnError(error, next);
  }
};
