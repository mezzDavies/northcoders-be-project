const {
  fetchCommentsByArticleId,
  addComment,
  removeCommentById,
  updateCommentByid,
} = require("../models/comments.models");

const { checkCommentExists } = require("../util functions/utils");

const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  Promise.all([
    fetchCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;

  addComment(articleId, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { commentId } = req.params;

  removeCommentById(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { commentId } = req.params;
  const voteValue = req.body.inc_votes;
  Promise.all([
    updateCommentByid(commentId, voteValue),
    checkCommentExists(commentId),
  ])

    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
