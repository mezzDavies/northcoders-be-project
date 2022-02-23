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

exports.addComment = (artId, user, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING author, body;
`,
      [artId, user, body]
    )
    .then((res) => {
      return res.rows[0];
    });
};
