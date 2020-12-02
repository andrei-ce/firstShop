const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    getProductsFromFile((products) => {
      //if existing product
      if (this.id) {
        const existingProductIndex = products.findIndex((p) => p.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        //if new product
        this.id = Math.floor(Math.random() * 10000).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(prodId, cb) {
    getProductsFromFile((products) => {
      let product = products.find((p) => p.id === prodId);
      let prodToDeleteIndex = products.findIndex((p) => p.id === prodId);
      if (!prodToDeleteIndex) {
        return;
      } else {
        let updatedProducts = [...products];
        updatedProducts.splice(prodToDeleteIndex, 1);
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (!err) {
            Cart.deleteProduct(prodId, product.price);
          }
          console.log(err);
        });
      }
      cb();
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(prodId, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === prodId);
      cb(product);
    });
  }
};
