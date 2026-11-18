const express = require("express");

const app = express();

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});

module.exports = app;
