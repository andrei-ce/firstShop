// >>> ALL LOGIC THAT A STORE MANAGER NEEDS <<<

const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.findAll();
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

//FIRST MYSQL SHIT
exports.postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  try {
    await req.user.createProduct({
      title,
      imageUrl,
      price,
      description,
    });
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  //check query parameters
  const editMode = req.query.edit; //url/:prodId?edit=true
  const prodId = req.params.prodId;
  if (!editMode) {
    return res.redirect('/');
  }
  try {
    let product = await Product.findByPk(prodId);
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.prodId;
  const { title, imageUrl, description, price } = req.body;

  try {
    let updatedProduct = await Product.findByPk(prodId);
    updatedProduct.title = title;
    updatedProduct.imageUrl = imageUrl;
    updatedProduct.description = description;
    updatedProduct.price = price;
    await updatedProduct.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.params.prodId;
  try {
    let deletedProd = await Product.findByPk(prodId);
    await deletedProd.destroy();
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
  }
};
