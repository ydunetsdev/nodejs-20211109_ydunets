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
  const productList = await Product.find();
  ctx.body = {products: productList.map((category) => mapProduct(category))};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    if (product) {
      ctx.body = {product: mapProduct(product)};
    } else {
      ctx.status = 404;
      ctx.body = {error: '404'};
    }
  } else {
    ctx.status = 400;
    ctx.body = {error: 'id invalid'};
  }
};

