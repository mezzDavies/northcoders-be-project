const express = require("express");
const app = express();

const { handle500s, handleCustomErrors } = require("./error-handlers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  patchArticle,
  getArticles,
} = require("./controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controllers");

const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:articleId", getArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:articleId/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

app.patch("/api/articles/:articleId", patchArticle);

app.post("/api/articles/:articleId/comments", postComment);

app.delete("/api/comments/:commentId", deleteCommentById);

app.all("/*", (req, res) => {
  return res.status(404).send({ msg: "path not found" });
});
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
