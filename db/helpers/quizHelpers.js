module.exports = (db) => {
  const getAllQuizzes = () => {
    return db.query(`
      SELECT * 
      FROM quizzes;
    `)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const getPublicQuizzes = () => {
    return db.query(`
      SELECT *
      FROM quizzes
      WHERE listed = true;
    `)
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const createNewQuiz = (info) => {
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
  };

  const createQuestion = (info) => {
    return db.query(`
      INSERT INTO questions (quiz_id, question)
      VALUES ($1, $2);
    `, info)
    .then(data => data.rows)
    .catch(err => err.message);
  };

  const createAnswer = (info) => {
    return db.query(`
      INSERT INTO answers (question_id, answer, is_correct)
      VALUES ($1, $2, $3);
    `, info)
    .then(data => data.rows)
    .catch(err => err.message);
  };

  const getQuizWithId = (id) => {
    return db.query(`
      SELECT * 
      FROM quizzes 
      WHERE id = $1;
    `, [id])
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  const getQuizWithUrl = (url) => {
    return db.query(`
      SELECT * 
      FROM quizzes 
      WHERE url = $1;
    `, [url])
      .then(data => data.rows[0])
      .catch(err => err.message);
  };

  const getQuestions = (id) => {
    return db.query(`
      SELECT *
      FROM questions
      WHERE quiz_id = $1
      ORDER BY id;
    `, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getAnswers = (id) => {
    return db.query(`
      SELECT *
      FROM answers
      WHERE question_id = $1
      ORDER BY id;
    `, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getAnswersForQuiz = (id) => {
    return db.query(`
      SELECT *
      FROM answers
      JOIN questions ON question_id = questions.id
      WHERE quiz_id = $1
      ORDER BY answers.id;
    `, [id])
      .then(data => data.rows)
      .catch(err => err.message);
  };

  const getCategories = () => {
    return db.query(`
      SELECT DISTINCT category
      FROM quizzes;
    `)
      .then(data => {
        const categories = [];
        data.rows.forEach((item) => categories.push(item.category));
        return categories;
      })
      .catch(err => err.message);
  };

  return { 
    getAllQuizzes,
    getPublicQuizzes,
    createNewQuiz, 
    createQuestion, 
    createAnswer, 
    getQuizWithId, 
    getQuizWithUrl, 
    getQuestions, 
    getAnswers, 
    getAnswersForQuiz,
    getCategories
  }
}