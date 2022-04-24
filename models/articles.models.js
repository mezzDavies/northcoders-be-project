const db = require("../db/connection");
const { promiseRejector } = require("../util_functions/promiseRejector");
const { getTopics } = require("../util_functions/getTopics");

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return promiseRejector(404, "article");
      }
      return article;
    });
};

exports.updateArticleById = (id, patch) => {
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
        return promiseRejector(404, "article");
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
  const validTopics = ["mitch", "cats", "football", null];
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
    let queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
                      FROM articles LEFT JOIN comments
                      ON articles.article_id = comments.article_id `;
    const queryEnd = ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
    if (topicQuery !== "") {
      queryString += topicQuery += queryEnd;
    } else {
      queryString += queryEnd;
    }

    return db.query(queryString).then((res) => {
      return res.rows;
    });
  }
};

// exports.fetchArticles = (
//   sortBy = "created_at",
//   order = "DESC",
//   topic = null
// ) => {
//   const validSortBys = ["created_at", "votes"];
//   const validOrders = ["asc", "DESC"];
//   let topicQuery = "";
//   getTopics().then((validTopics) => {
//     console.log("validTopics >>>", validTopics);
//     if (topic) {
//       topicQuery = `WHERE topic = '${topic}' `;
//     }

//     if (
//       !validSortBys.includes(sortBy) ||
//       !validOrders.includes(order) ||
//       !validTopics.includes(topic)
//     ) {
//       return Promise.reject({
//         status: 400,
//         msg: "bad request",
//       });
//     } else {
//       let queryString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//                         FROM articles LEFT JOIN comments
//                         ON articles.article_id = comments.article_id `;
//       const queryEnd = ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
//       if (topicQuery !== "") {
//         queryString += topicQuery += queryEnd;
//       } else {
//         queryString += queryEnd;
//       }

//       return db.query(queryString).then((res) => {
//         return res.rows;
//       });
//     }
//   });
// };
