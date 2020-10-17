module.exports = (db) => {
  const getAllQuizzes = function() {
    return db.query(`SELECT * FROM quizzes`)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const createNewQuiz = function(info) {
    let dateString = Date.now();
    let timestamp = new Date(dateString);
    const date = timestamp.toDateString();
    return db.query(`
    INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [1, info.title, info.thumbnail, info.listed, '/testurl', info.category, date,])
    //! creator_id, url, and date hardcoded as a placeholders - would be logged in user_id, quiz url
    .then(data => data.rows)
    .catch(err => err.message);
  }
  const createQuestion = function(info) {
    return db.query(`
    INSERT INTO questions (quiz_id, question)
    VALUES ($1, $2);
    `, info)
    .then(data => data.rows)
    .catch(err => err.message);
  }
  const createAnswer = function(info) {
    return db.query(`
    INSERT INTO answers (question_id, answer, is_correct)
    VALUES ($1, $2, $3);
    `, info)
    .then(data => data.rows)
    .catch(err => err.message);
  }

  return { getAllQuizzes, createNewQuiz, createQuestion, createAnswer }
}
