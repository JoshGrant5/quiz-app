module.exports = (db) => {
  const getAllQuizzes = function() {
    return db.query(`SELECT * FROM quizzes`)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const createNewQuiz = function(info) {
    return db.query(`
    INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, info)
    .then(data => data.rows)
    .catch(err => err.message);
  }

  const createQuestion = function()

  return { getAllQuizzes }
}
