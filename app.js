const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use("/*", (req, res) => {
  return res.status(404).send({ msg: "path not found" });
});

module.exports = app;
