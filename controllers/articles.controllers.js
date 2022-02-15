const { fetchArticle } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  fetchArticle(articleId).then((article) => {
    res.status(200).send({ article });
  });
};
