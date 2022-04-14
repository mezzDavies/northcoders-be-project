const db = require("../db/connection");

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
        return Promise.reject({
          status: 404,
          msg: "user not found",
        });
      }
      const user = res.rows[0];

      return user;
    });
};
