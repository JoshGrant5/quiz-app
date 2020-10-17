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

  /*

  { title: 'test',
  thumbnail: 'test',
  category: 'test',
  listed: 'true',

  question1: '1',
  a1: 'a',
  correct1: 'a',
  b1: 'b',
  c1: 'c',
  d1: 'd',

  question2: '2',
  a2: 'a',
  b2: 'b',
  correct2: 'b',
  c2: 'c',
  d2: 'd'

  count: '2'}
  */

  const sort = function(info) {
    const count = info.count;
    const questions = [];
    const answers = [];
    const correct = [];
    for (let i = 1; i <= count; i++) {
      questions.push(info[`question${i}`]);
      answers.push([info[`a${i}`], info[`b${i}`], info[`c${i}`], info[`d${i}`]]);
      correct.push(info[`correct${i}`]);
    };
    console.log('sorted:' , { questions, answers, correct });
    return { questions, answers, correct };
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

  return { getAllQuizzes, createNewQuiz, createQuestion, sort, createAnswer, getQuizWithId, getQuizWithUrl, getQuestions, getAnswers, getAnswersForQuiz }
}
