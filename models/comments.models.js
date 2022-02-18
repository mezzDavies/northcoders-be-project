const db = require("../db/connection");

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
WHERE article_id = $1;`,
      [id]
    )
    .then((res) => {
      return res.rows;
    });
};