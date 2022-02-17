const { fetchArticle, updateArticle } = require("../models/articles.models");

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
    .then((updated_article) => {
      res.status(201).send({ updated_article });
    })
    .catch(next);
};
