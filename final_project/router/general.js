const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => { 
    return users.some(user => user.username == username);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).json({message: "Username and password required"});
    } 

  if(doesExist(username)) {
    return res.status(409).json({message: "User already exists"})
    }

    users.push({"username":username, "password":password}); 
    return res.status(200).json({message: "User successfully registered!"})

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).send(JSON.stringify(books[req.params.isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
const author = req.params.author.toLowerCase();
const matchingBooks = [];

  Object.values(books).forEach(book => {
    if(book.author.toLowerCase() == author ) {
        matchingBooks.push(book);
    }
  });

  if(matchingBooks.length === 0 ) {
    return res.status(404).send("No matching book found")
  };

  return res.json(matchingBooks);
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title.toLowerCase();

    Object.values(books).forEach(book => {
        if(book.title.toLowerCase() == title) {
            return res.send(book);
        }
    })

    return res.status(404).json({error: "No matching title found"});
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
