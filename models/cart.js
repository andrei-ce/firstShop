const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
  // constructor() {
  //   this.products = [];
  //   this.totalPrice = 0;
  //   this.paid = false;
  // }

  //there will be only 1 cart available to user, so this logic looks better (than using constructor())
  static addProduct(prodId, prodPrice) {
    //fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0, paid: false };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //loop through cart and look for item
      const existingProductIdex = cart.products.findIndex((p) => p.id === prodId);
      const existingProduct = cart.products[existingProductIdex];
      let updatedProduct;
      //if it exists add 1 to qty
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIdex] = updatedProduct;
        //if not add the complete product?
      } else {
        updatedProduct = { id: prodId, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // cart.totalPrice = cart.totalPrice + +prodPrice;
      cart.totalPrice = cart.totalPrice + parseFloat(prodPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(prodId, prodPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      let cart = JSON.parse(fileContent);
      let updatedCart = { ...cart };
      let product = updatedCart.products.find((p) => p.id === prodId);
      if (!product) return;

      // if a cart and a product was found, then remove it and update total price
      updatedCart.products = cart.products.filter((p) => p.id !== prodId);
      updatedCart.totalPrice = cart.totalPrice - product.qty * prodPrice;
      //save
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
};
