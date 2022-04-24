const db = require("../db/connection");

// function promiseRejector(code, item) {
//   return Promise.reject({
//     status: code,
//     msg: `${item} not found`,
//   });
// }

const { promiseRejector } = require("./promiseRejector");

exports.checkCommentExists = (id) => {
  return db
    .query(
      ` SELECT * FROM comments
  WHERE comment_id = $1`,
      [id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return promiseRejector(404, "comment");
      }
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
        return promiseRejector(404, "article");
      }
    });
};
