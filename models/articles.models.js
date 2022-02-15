const db = require("../db/connection");

exports.fetchArticle = (id) => {
  // console.log("in the model articleId >>>", id);
  return db
    .query(
      `SELECT *
    FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then((res) => {
      return res.rows[0];
    });
};
