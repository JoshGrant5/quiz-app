module.exports = (db) => {
  const getAllQuizzes = function() {
    return db.query(`SELECT * FROM quizzes`)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const getQuizWithId = function(id) {
    return db.query(`SELECT * FROM quizzes WHERE id = $1;`, [id])
      .then(data => data.rows[0])
      .catch(err => err.message);
  }

  const getQuizWithUrl = function(url) {
    return db.query(`SELECT * FROM quizzes WHERE url = $1;`, [url])
      .then(data => data.rows[0])
      .catch(err => err.message);
  }

  const getQuestions = function(id) {
    return db.query(`SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id;`, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const getAnswers = function(id) {
    return db.query(`SELECT * FROM answers WHERE question_id = $1 ORDER BY id;`, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const getAnswersForQuiz = function(id) {
    return db.query(`SELECT * FROM answers JOIN questions ON question_id = questions.id WHERE quiz_id = $1 ORDER BY answers.id;`, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  }

  return { getAllQuizzes, getQuizWithId, getQuizWithUrl, getQuestions, getAnswers, getAnswersForQuiz }
}
