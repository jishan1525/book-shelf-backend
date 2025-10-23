const booksData = require("./data/bookData");
const { intializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");

const seedBooks = async () => {
  try {
    await intializeDatabase();
    await Book.insertMany(booksData);

    console.log("All books added successfully!");
    process.exit(); 
  } catch (error) {
    console.error(" Error while seeding data:", error);
    process.exit(1);
  }
};

seedBooks();