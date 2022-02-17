const express = require("express");
const app = express();

const { handle500s, handleCustomErrors } = require("./error-handlers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  patchArticle,
} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:articleId", getArticle);

app.patch("/api/articles/:articleId", patchArticle);

app.use("/*", (req, res) => {
  return res.status(404).send({ msg: "path not found" });
});
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
