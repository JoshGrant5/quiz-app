module.exports = (db) => {
  const getAllUsers = () => {
    return db.query(`SELECT * FROM users`)
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1;`, [email])
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  const getUserById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1;`, [id])
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  return {
    getAllUsers,
    getUserByEmail,
    getUserById
  }
}

