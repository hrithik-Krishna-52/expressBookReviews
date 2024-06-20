const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUsers = users.some(user=> {return user.username === username})

    if(validUsers) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    let authUsers = users.some(user=> {
       return user.username === username && user.password == password 
    })

    if(authUsers) {
        return true;
    } else {
        return false;
    }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(404).json({message: "Error logging in"})
        console.log("Login error")
    };

    
    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({data : password}, 
        'access', 
        {expiresIn : 60*60 });
    
        req.session.authorization = {accessToken, username}

        return res.status(200).json({message: "User successfully logged in"})
    } else {
        return res.status(404).json({message: "Error logging in"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(!req.session.authorization) {
    res.status(403).json({message: "User not logged in"})
  }

  const username = req.session.authorization.username;

  if(!books[isbn]) {
   return  res.status(404).json({message: "Book not found"});
  }

  if(!review) {
    return res.status(404).json({message: "Review content is required"})
  }

  books[isbn].reviews[username] = review;

  res.status(200).json({message: "The review has been successfully updated!"})
});


//Deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if(!req.session.authorization) {
        res.status(404).json({message: "User not logged in"})
    }

    console.log("Logged in");
    
    const username = req.session.authorization.username;

    if(!books[isbn]) {
        res.status(404).json({message: "Book doesn't exist"})
    }

    console.log("book exists")

    if(!books[isbn].reviews[username]) {
        res.status(404).json({message: "A review by this user doesn't exist"})
    } 

    

    delete books[isbn].reviews[username]; 

    return res.status(200).json({ message: "Review successfully deleted" });
    
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
