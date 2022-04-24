const db = require("../db/connection");

const { promiseRejector } = require("../util_functions/promiseRejector");

exports.fetchUsers = () => {
  return db
    .query(
      `SELECT username
    FROM users;`
    )
    .then((res) => {
      const users = res.rows;
      return users;
    });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT * 
    FROM users 
    WHERE username = $1;`,
      [username]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return promiseRejector(404, "user");
      }

      const user = res.rows[0];
      return user;
    });
};
