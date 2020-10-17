module.exports = (db) => {
  const getAllUsers = function() {
    return db.query(`SELECT * FROM users`)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  return { getAllUsers }
}
