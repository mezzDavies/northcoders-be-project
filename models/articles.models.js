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
      const updatedArticle = rows[0];
      if (!updatedArticle) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return updatedArticle;
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT * FROM articles
  ORDER BY created_at DESC;`
    )
    .then((res) => {
      return res.rows;
    });
};

exports.checkArticleExists = (id) => {
  return db
    .query(
      ` SELECT * FROM articles
  WHERE article_id = $1`,
      [id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
    });
};
