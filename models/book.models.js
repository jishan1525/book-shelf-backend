const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  costPrice: Number,
  sellingPrice: Number,
  image: String,
  description: String,
  rating: Number,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;