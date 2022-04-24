const db = require("../db/connection");

exports.getTopics = () => {
  validTopics = [null];
  return db
    .query(
      `SELECT topic 
    FROM articles
    GROUP BY topic;`
    )
    .then(({ rows }) => {
      rows.forEach((obj) => {
        validTopics.push(obj.topic);
      });
      return validTopics;
    });
};
