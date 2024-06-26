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

const fetchBooks = async ()=> {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(books)
        },1000);
    });
};

// Get the book list available in the shop      
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
  const booksData = await fetchBooks();
  return res.status(300).json(booksData);
} catch(error) {
    console.error('Error fetching books', error)
    return res.status(500).send('Internal server error');
} 
});

const fetchDetails = async (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            if(books[isbn]) {
                resolve(books[isbn])
            } else {
                reject(new Error('Book not found'))
            }
        },1000)
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
    try {
        const isbn = req.params.isbn;
        const bookDetails = await fetchDetails(isbn);
        res.status(200).json(bookDetails);
    } catch(error) {
        console.error('Error fetching book isbn',error)
        res.status(500).send('Internal Server Error');
    }
 });
  
const fetchBasedOnAuthor = async(author) =>{
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            const matchingBooks = [];
            for(const [key, book] of Object.entries(books)) {
                if(book.author.toLowerCase() == author.toLowerCase()) {
                    matchingBooks.push({ id: key, ...book });
                }
            }

            if(matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error('No books found for the given Author'))
            }
        },1000);
    });
};
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
 try { 
      const author = req.params.author;
      const booksFromAuthor = await fetchBasedOnAuthor(author);
      res.status(200).json(booksFromAuthor);
    } catch(error) {
        console.error('Error in fetching author', error);
        res.status(500).send('Internal Server Error');
    }
});

//Async function
const fetchBookBasedOnTitle = async (title) => {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {  
            const matchingBooks = [];

            for(const [key, book] of Object.entries(books)) {
                if(book.title.toLowerCase() == title.toLowerCase()) {
                    matchingBooks.push({id: key, ...book})
                }
            }

            if(matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(new Error('No Books found for given title'))
            }
        }, 1000);
    })
};
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
try {
    const title = req.params.title;
    const booksWithTitle = await fetchBookBasedOnTitle(title);
    res.status(200).send(booksWithTitle);

    } catch(error) {
        console.error('No matching book with Title found', error);
        res.status(500).send('Internal Server Error');
    }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
