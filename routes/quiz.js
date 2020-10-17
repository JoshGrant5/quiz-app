/*
 * All routes for Quizzes are defined here
 * Since this file is loaded in server.js into /quiz,
 *   these routes are mounted onto /quiz
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {
  router.get("/", (req, res) => {
    helpers.getAllQuizzes().then(info => res.json(info));
  });

  router.get('/create', (req, res) => {
    const templateVars = { };
    const userid = req.session.user_id;
    const promises = [];
    promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      // populate templateVars with data responses
      .then(res => {
        templateVars.user = res[1] || undefined;
        return templateVars;
      })
      .then(data => {
        res.render("create_quiz", data);
      });
  });

  router.post('/create', (req, res) => {
    helpers.createNewQuiz(req.body)
    .then(data => {
      return quizHelpers.sort(data.id ,req.body);
    })
    .then(sortedData => {
      return quizHelpers.addQuizContent(sortedData);
    })
    .then(res => res.redirect('index'))
    .catch(err => err.message);
  })

  router.get("/:url", (req, res) => {
    let quizInfo = {}
    quizHelpers.getQuizWithUrl(req.params.url)
      .then(quiz => {
        quizInfo.quiz = quiz;
        return quizHelpers.getQuestions(quiz.id);
      })
      .then(questions => {
        quizInfo.questions = questions;
        return quizHelpers.getAnswersForQuiz(quizInfo.quiz.id);
      })
      .then(answers => {
        quizInfo.answers = answers;
        res.json(quizInfo);
      })
      .catch(err => res.json(err));
  });

  return router;
};
