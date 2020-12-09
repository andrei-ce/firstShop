// >>> ALL LOGIC THAT A SHOPPING CUSTOMER NEEDS <<<

const Product = require('../models/product');

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
    //through adds an additional attribute to cartItem
    await cart.addProduct(product, { through: { quantity: newQty } });
    res.redirect('/cart');
    console.log('The end');
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
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

exports.postOrder = async (req, res) => {
  console.log('POST ORDER CONTROLLER');
  let user = req.user;
  try {
    //get cart & products
    let cart = await user.getCart();
    let cartProducts = await cart.getProducts();
    console.log('UUUUUUUUUUUU');
    //create order linked to user
    let order = await user.createOrder();
    console.log(order);
    // add all products from cart to order: need to add qty individually to each prod
    await order.addProducts(
      cartProducts.map((prod) => {
        //from orderItem Model name
        prod.orderItem = { quantity: prod.cartItem.quantity }; //the quantity is available in cartItem object stored in each product
        return prod;
      })
    );
    //empty cart
    let emptyCart = await cart.setProducts(null);
    res.redirect('/orders');
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  let user = req.user;
  try {
    let orders = await user.getOrders({ include: ['products'] });
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};
