module.exports = (db) => {
  const getAllQuizzes = function() {
    return db.query(`SELECT * FROM quizzes;`)
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getPublicQuizzes = () => {
    return db.query(`
      SELECT * FROM quizzes
      WHERE listed = true
      LIMIT 10;
    `) // may need to refactor after adding a load more button
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getQuizzesForUser = (id) => {
    return db.query(`
      SELECT * FROM quizzes
      JOIN users ON users.id = creator_id
      WHERE creator_id = '${id}';
    `)
      .then(data => data.rows)
      .catch(err => err.message);
  };

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

  const getScore = function(answers) {
    let query = `SELECT COUNT(*) AS score FROM answers
    WHERE is_correct = true AND (`;
    const values = [];

    for (const answer in answers) {
      values.push(answers[answer]);
      if (values.length > 1) query += ` OR`
      query += ` id = $${values.length}`;
    }

    query += `);`

    return db.query(query, values)
      .then(data => data.rows[0])
      .catch(err => err.message);
  }

  const createResult = function(quiz_id, user_id, score) {
    const dateString = Date.now();
    const timestamp = new Date(dateString);
    const date = timestamp.toDateString();
    const query = `INSERT INTO results (quiz_id, user_id, score, date_completed)
    VALUES ($1, $2, $3, $4) RETURNING *;`;
    const values = [quiz_id, user_id, score, date];

    return db.query(query, values)
      .then(data => data.rows[0])
      .catch(err => err.message);
  }

  const getResult = function(result_id) {
    const query = `SELECT * FROM quizzes JOIN results ON quiz_id = quizzes.id WHERE results.id = $1;`
    const values = [result_id];
    return db.query(query, values)
      .then(data => data.rows[0])
      .catch(err => err.message);
  }

  const shuffle = function(answers) {
    const shuffled = answers.slice(0);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return {
    getAllQuizzes,
    getPublicQuizzes,
    getQuizzesForUser,
    createNewQuiz,
    createQuestion,
    createAnswer,
    getQuizWithId,
    getQuizWithUrl,
    getQuestions,
    getAnswers,
    getAnswersForQuiz,
    getScore,
    createResult,
    getResult,
    shuffle,
  }
}
