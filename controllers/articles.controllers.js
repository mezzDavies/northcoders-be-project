const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.articleId;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params.articleId;
  const patch = req.body;
  updateArticleById(articleId, patch)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const { order, topic } = req.query;

  fetchArticles(sortBy, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
