module.exports = (db) => {

  const getAllQuizzes = () => {
    return db.query(`
      SELECT *
      FROM quizzes;
    `)
      .then(data => data.rows)
      .catch(err => err.message);
  };

  /**
   * Get all public (listed) quizze
   * @param {category: string} category filter
   * Returns array of quiz objects
   */
  const getPublicQuizzes = (category) => {
    const queryParams = [];
    let queryString = `
      SELECT *
      FROM quizzes
      WHERE listed = true
    `;

    if(category.categoryFilter !== 'All') {
      queryParams.push(category.categoryFilter);
      queryString += `AND category = $${queryParams.length} `;
    }

    queryString += `
      LIMIT 10;
    `;

    return db.query(queryString, queryParams)
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

  // Adds quiz to db - accepts user_id string, and an object
  const createNewQuiz = (id, info) => {
    const dateString = Date.now();
    const timestamp = new Date(dateString);
    const date = timestamp.toDateString();
    const createdURL = Math.random().toString(20).substr(2, 8);
    return db.query(`
    INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `, [id, info.title, info.thumbnail, info.listed, createdURL, info.category, date,])
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
  };

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
              return answer;
            });
          } else {
            createAnswer([questionInfo[0].id, info.answers[counter][i-1], false])
            .then(answer => {
              counter++;
              return answer;
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

  /**
   * Get all quiz categories
   * Returns an array of categories
   */
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

  const createResult = function(quiz_id, user_id, score, total) {
    const dateString = Date.now();
    const timestamp = new Date(dateString);
    const date = timestamp.toDateString();
    let query = '';
    let values = [];
    if (user_id) {
      query += `INSERT INTO results (quiz_id, user_id, score, total, date_completed)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      values = [quiz_id, user_id, score, total, date];
    }
    else {
      query += `INSERT INTO results (quiz_id, score, total, date_completed)
      VALUES ($1, $2, $3, $4) RETURNING *;`;
      values = [quiz_id, score, total, date];
    }

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

  const getAllResultsForQuiz = function(quiz_id) {
    const query = `SELECT * FROM results WHERE quiz_id = $1;`
    const values = [quiz_id];
    return db.query(query, values)
      .then(data => data.rows)
      .catch(err => err.message);
  }

  const getNumResultsForQuiz = function(quiz_id) {
    const query = `SELECT COUNT(*) FROM results WHERE quiz_id = $1;`
    const values = [quiz_id];
    return db.query(query, values)
      .then(data => Number(data.rows[0].count))
      .catch(err => err.message);
  }

  const getNumScoresBeatenForQuiz = function(quiz_id, score) {
    const query = `SELECT COUNT(*) FROM results WHERE quiz_id = $1 AND score < $2;`
    const values = [quiz_id, score];
    return db.query(query, values)
      .then(data => Number(data.rows[0].count))
      .catch(err => err.message);
  }

  const getAllResultsForUser = function(user_id) {
    const query = `SELECT * FROM results WHERE user_id = $1;`
    const values = [user_id];
    return db.query(query, values)
      .then(data => data.rows)
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
    sort,
    createQuestion,
    createAnswer,
    addQuizContent,
    getQuizWithId,
    getQuizWithUrl,
    getQuestions,
    getAnswers,
    getAnswersForQuiz,
    getScore,
    createResult,
    getResult,
    getAllResultsForQuiz,
    getNumResultsForQuiz,
    getNumScoresBeatenForQuiz,
    getAllResultsForUser,
    shuffle,
    getCategories,
  }
}
