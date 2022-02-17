const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query(
      `SELECT *
    FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return article;
    });
};

exports.updateArticle = (id, patch) => {
  // console.log("in the patch model with id and patch:", id, patch);
  const { inc_votes } = patch;
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
