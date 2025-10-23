const express = require("express");
const mongoose = require("mongoose");
const { intializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");
const Genre = require("./models/genre.models");
const booksData = require("./data/bookData");
const cors = require("cors");


const app = express();

// Middleware to parse JSON body


app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


// Initialize DB connection
intializeDatabase();

// Default route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// POST: Add a book
app.post("/addBook", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();

    res.status(201).json({
      message: "Book added successfully!",
      data: savedBook
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({
      message: "Failed to add book",
      error: error.message
    });
  }
});

// GET: All books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});
// GET: Single book by ID
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bookResult = await Book.findById(id);
    if (!bookResult) {
      return res.status(404).json({ message: "Book not found!" });
    }
    res.status(200).json({
      message: "Book found successfully!",
      data: bookResult
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to find book",
      error: error.message
    });
  }
});


//get boook by genre

const getBookByGenre = async (selectedgenre) => {
    try {
        const booklist =await Book.find({genre:selectedgenre})
        return booklist
    } catch (error) {
        throw error
    }
    
}

app.get("/genre/:id/books", async (req, res) => {
    const genreId = req.params.id;
    let genreName; // Declare variable here to give it proper scope

    try {
        // 1. Find the Genre (AWAIT is essential here)
        const genreObject = await Genre.findById(genreId);
        
        if (!genreObject) {
            return res.status(404).json({ message: "Genre not found." });
        }
        
        // 2. Assign the name to the scoped variable
        genreName = genreObject.name; 
        
    } catch (error) {
        // Handle database/Mongoose connection errors for Genre.findById
        console.error("Error finding genre:", error); 
        return res.status(500).json({ message: "Server error during genre lookup." });
    }

    // 3. Use the found genreName to get the books
    try {
        const bookList = await getBookByGenre(genreName);
        
        if (bookList && bookList.length > 0) { // Check if array has content
            res.json(bookList);
        } else {
            // Use 404 (Not Found) for "no results" rather than 401 (Unauthorized)
            res.status(404).json({ error: `No books found for genre: ${genreName}` });
        }
    } catch (error) {
        // Handle errors from the getBookByGenre function
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server error during book lookup." });
    }
});

app.get("/genre", async (req, res) => {
  try {
    const genre = await Genre.find();
    res.status(200).json({ data: genre });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch genre", error: error.message });
  }
});

app.post("/genre",async(req,res)=>{
    try {
    const newGenre = new Genre(req.body);
    const savedGenre = await newGenre.save();

    res.status(201).json({
      message: "Genre added successfully!",
      data: savedGenre
    });
  } catch (error) {
    console.error("Error adding Genre:", error);
    res.status(500).json({
      message: "Failed to add Genre",
      error: error.message
    });
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});