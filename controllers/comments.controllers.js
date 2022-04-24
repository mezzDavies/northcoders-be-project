const {
  fetchCommentsByArticleId,
  addCommentByArticleId,
  removeCommentById,
  updateCommentByid,
} = require("../models/comments.models");

const {
  checkCommentExists,
  checkArticleExists,
} = require("../util_functions/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  Promise.all([
    fetchCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;

  addCommentByArticleId(articleId, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { commentId } = req.params;

  removeCommentById(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { commentId } = req.params;
  const voteValue = req.body.inc_votes;
  Promise.all([
    updateCommentByid(commentId, voteValue),
    checkCommentExists(commentId),
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
