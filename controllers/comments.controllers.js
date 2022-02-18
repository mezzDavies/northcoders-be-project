const { fetchCommentsByArticleId } = require("../models/comments.models");

const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  Promise.all([
    fetchCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])
    .then(([comments]) => {
      console.log("comments in controller >>>", comments);
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
