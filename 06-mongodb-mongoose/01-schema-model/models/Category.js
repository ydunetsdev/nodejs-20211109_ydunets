const mongoose = require("mongoose");
const connection = require("../libs/connection");

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

connection.model("Subcategory", subCategorySchema);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subcategories: [subCategorySchema],
});

module.exports = connection.model("Category", categorySchema, 'subcategories');
