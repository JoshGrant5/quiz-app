module.exports = (db) => {
  const getAllUsers = () => {
    return db.query(`SELECT * FROM users`)
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = '${email}';`)
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  const getUserById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = '${id}';`)
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  const addNewUser = (name, email, password) => {
    return db.query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [name, email, password])
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  return {
    getAllUsers,
    getUserByEmail,
    getUserById,
    addNewUser
  }
}

