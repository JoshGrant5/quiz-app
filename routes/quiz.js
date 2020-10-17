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


  return router;
};
