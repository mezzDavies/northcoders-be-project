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

exports.fetchArticles = (
  sortBy = "created_at",
  order = "DESC",
  topic = null
) => {
  const validSortBys = ["created_at", "votes"];
  const validOrders = ["asc", "DESC"];
  const validTopics = ["mitch", "cats", null];
  let topicQuery = "";

  if (topic) {
    topicQuery = `WHERE topic = '${topic}' `;
  }

  if (
    !validSortBys.includes(sortBy) ||
    !validOrders.includes(order) ||
    !validTopics.includes(topic)
  ) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  } else {
    let queryString = `SELECT * FROM articles `;
    let queryOrder = `ORDER BY ${sortBy} ${order};`;
    if (topicQuery !== "") {
      queryString += topicQuery += queryOrder;
    } else {
      queryString += queryOrder;
    }

    return db.query(queryString).then((res) => {
      return res.rows;
    });
  }
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
