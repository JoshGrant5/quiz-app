module.exports = (db) => {
  const getAllQuizzes = function() {
    return db.query(`SELECT * FROM quizzes`)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  return { getAllQuizzes }
}
