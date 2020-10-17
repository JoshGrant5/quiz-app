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

  // Adds quiz to db - accepts an object
  const createNewQuiz = function(info) {
    let dateString = Date.now();
    let timestamp = new Date(dateString);
    const date = timestamp.toDateString();
    return db.query(`
    INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `, [1, info.title, info.thumbnail, info.listed, 'testurl', info.category, date,])
    //! creator_id, url, and date hardcoded as a placeholders - would be logged in user_id, quiz url
    .then(data => data.rows[0])
    .catch(err => err.message);
  }

  // Sorts form data into questions, answers, and correct(s) - accepts and returns an object
  const sort = function(id, info) {
    const count = info.count;
    const questions = [];
    const answers = [];
    const correct = [];
    for (let i = 1; i <= count; i++) {
      questions.push(info[`question${i}`]);
      answers.push([info[`a${i}`], info[`b${i}`], info[`c${i}`], info[`d${i}`]]);
      correct.push(info[`correct${i}`]);
    };
    return { questions, answers, correct, id }
  }

  // Adds question to db - accepts an array
  const createQuestion = function(info) {
    return db.query(`
    INSERT INTO questions (quiz_id, question) VALUES ($1, $2) RETURNING *;`, info)
    .then(data => data.rows)
    .catch(err => err.message);
  }

  // Adds answers to db - accepts a nested array
  const createAnswer = function(info) {
    return db.query(`
    INSERT INTO answers (question_id, answer, is_correct) VALUES ($1, $2, $3) RETURNING *;`, info)
    .then(data => data.rows)
    .catch(err => err.message);
  }

  // Goes through all questions and answers, placing in correct db - accepts an object
  const addQuizContent = function(info) {
    let counter = 0; // counter used for referencing all answers against correct answer
    for (let question of info.questions) {
      createQuestion([info.id, question])
      .then(questionInfo => {
        for (let i = 1; i <= 4; i++) {
          if (Number(info.correct[counter]) === i) {
            createAnswer([questionInfo[0].id, info.answers[counter][i-1], true])
            .then(answer => {
              counter++;
            });
          } else {
            createAnswer([questionInfo[0].id, info.answers[counter][i-1], false])
            .then(answer => {
              counter++;
            });
          }
        }
      });
    }
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

<<<<<<< HEAD
  return { getAllQuizzes, getPublicQuizzes, createNewQuiz, sort, createQuestion, createAnswer, addQuizContent, getQuizWithId, getQuizWithUrl, getQuestions, getAnswers, getAnswersForQuiz }
=======
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
    getAnswersForQuiz 
  }
>>>>>>> 485e4718ac78fc55aca11b4eb738bb4c0a20c587
}
