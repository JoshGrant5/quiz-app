/*
 * All routes for Quizzes are defined here
 * Since this file is loaded in server.js into /quiz,
 *   these routes are mounted onto /quiz
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (helpers) => {
  router.get("/", (req, res) => {
    helpers.getAllQuizzes().then(info => res.json(info));
  });

  router.get('/create', (req, res) => {
    res.render('create_quiz');
  });

  router.post('/create', (req, res) => {
    helpers.createNewQuiz(req.body);

    // Obtain quiz ID from newly created quiz

    // helpers.createQuestion()
    // helpers.createAnswer()
    console.log(req.body);
    res.redirect('index');
  });

  router.get("/:url", (req, res) => {
    let quizInfo = {}
    helpers.getQuizWithUrl(req.params.url)
      .then(quiz => {
        quizInfo.quiz = quiz;
        return helpers.getQuestions(quiz.id);
      })
      .then(questions => {
        quizInfo.questions = questions;
        const answers = [];
        questions.forEach(question => answers.push(helpers.getAnswers(question.id)));
        return Promise.all(answers);
      })
      .then((answers) => {
        for (let i = 0; i < answers.length; i++) {
          quizInfo.questions[i].answers = answers[i];
        }
        res.render('take_quiz', quizInfo);
        // res.json(quizInfo);
      });
  });

  router.post("/:url", (req, res) => {
    let score = 0;
    helpers.getScore(req.body)
      .then(answers => {
        score = answers.score;
        return helpers.getQuizWithUrl(req.params.url);
      })
      .then(quiz => {
        return helpers.createResult(quiz.id, score, 1); //1 is user_id, hard-coded currently
      })
      .then(result => res.json(result));
      // .then(result => res.redirect(`/quiz/${req.params.url}/result/${result.id}`));
  });

  return router;
};
