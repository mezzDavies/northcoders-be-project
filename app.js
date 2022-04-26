const express = require("express");
const app = express();
const cors = require("cors");

const {
  handle404s,
  handle500s,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handlers");

const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  patchCommentById,
} = require("./controllers/comments.controllers");

const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");

const endpoints = require("./endpoints.json");

app.use(cors());

app.use(express.json());
app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:articleId", getArticleById);
app.get("/api/articles/:articleId/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

app.patch("/api/articles/:articleId", patchArticleById);
app.patch("/api/comments/:commentId", patchCommentById);

app.post("/api/articles/:articleId/comments", postCommentByArticleId);

app.delete("/api/comments/:commentId", deleteCommentById);

app.all("/*", handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
