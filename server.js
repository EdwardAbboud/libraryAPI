"use strict";

const express = require("express");
const app = express();
const data = require("./books.json");
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

app.get("/books", function (req, res) {
  readBooks(req, res);
});

app.post("/books", function (req, res) {
  createBook(req, res);
});

app.put("/books/:id", function (req, res) {
  updateBook(req, res);
});

app.delete("/books/:id", function (req, res) {
  deleteBook(req, res);
});

const readBooks = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(data);
};

const isInvalid = (req) => {
  const title = req.body.title;
  const author = req.body.author;
  const body = req.body;
  if (!title || !author || !body) {
    res.status(400);
    res.send("invalid request");
    return true;
  } else {
    return false;
  }
};

const createBook = (req, res) => {
  if (isInvalid(req)) {
    res.status(400);
    res.send("invalid request");
    return;
  }
  const id = uuidv4();
  let newBook = {
    id: id,
    title: req.body.title,
    author: req.body.author,
  };
  data.push(newBook);
  res.status(200);
  res.send(id);
};

const updateBook = (req, res) => {
  if (isInvalid(req)) {
    res.status(400);
    res.send("invalid request");
    return;
  }
  const bookToUpdate = data.find((book) => book.id === req.params.id);
  if (!bookToUpdate) {
    res.status(404);
    res.send("No such book exists");
    return;
  }
  bookToUpdate.title = req.body.title;
  bookToUpdate.author = req.body.author;
  res.send("ok");
};

const deleteBook = (req, res) => {
  const bookToDelete = data.find((book) => book.id === req.params.id);
  if (!bookToDelete) {
    res.status(404);
    res.send("No such book exists");
    return;
  }
  data.splice(data.indexOf(bookToDelete), 1);
  res.send("ok");
};

app.listen(3000);
