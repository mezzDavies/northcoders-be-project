const {
  fetchArticle,
  updateArticle,
  fetchArticles,
} = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  fetchArticle(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const patch = req.body;
  updateArticle(articleId, patch)
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
