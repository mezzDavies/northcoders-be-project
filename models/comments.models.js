const db = require("../db/connection");

const { promiseRejector } = require("../util_functions/promiseRejector");

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT 
comment_id, 
votes, 
created_at, 
author, 
body
FROM comments
WHERE article_id = $1
ORDER BY created_at;`,
      [id]
    )
    .then((res) => {
      return res.rows;
    });
};

exports.addCommentByArticleId = (artId, user, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;`,
      [artId, user, body]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.removeCommentById = (commentId) => {
  return db
    .query(
      `DELETE FROM comments
    WHERE comment_id = $1;`,
      [commentId]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return promiseRejector(404, "comment");
      }
    });
};

exports.updateCommentByid = (commentId, voteValue) => {
  return db
    .query(
      `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`,
      [voteValue, commentId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
