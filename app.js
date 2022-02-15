const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { getArticle } = require("./controllers/articles.controllers");
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:articleId", getArticle);

app.use("/*", (req, res) => {
  return res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  console.log("500 err in app >>>", err);
  return res.status(500).send({ msg: "server error" });
});
module.exports = app;
