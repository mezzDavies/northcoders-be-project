const db = require("../db/connection");

exports.checkCommentExists = (id) => {
  return db
    .query(
      ` SELECT * FROM comments
  WHERE comment_id = $1`,
      [id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
    });
};
