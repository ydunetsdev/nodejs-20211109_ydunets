const Product = require('../models/Product');
const mongoose = require('mongoose');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const products = await Product.find({subcategory: subcategory});
  ctx.body = {products: products.map((category) => mapProduct(category))};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map((category) => mapProduct(category))};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    if (product) {
      ctx.body = {product: mapProduct(product)};
    } else {
      ctx.throw(404, 'Not found');
    }
  } else {
    ctx.throw(400, 'Id is invalid.')
  }
};

