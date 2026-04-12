const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const { users } = require('./auth_users.js');
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(400).json({ message: "Missing username or password" });
  }
});

// Get the book list available in the shop (using Promise)
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((books) => {
    return res.status(200).json(books);
  })
  .catch((err) => {
    return res.status(500).json({ message: "Error retrieving books" });
  });
});

// Get book details based on ISBN (using async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get book details based on author (using async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const filteredBooks = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.author === author);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("No books found for this author");
      }
    });
    return res.status(200).json(filteredBooks);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get all books based on title (using async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const filteredBooks = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.title === title);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("No books found for this title");
      }
    });
    return res.status(200).json(filteredBooks);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports = public_users;