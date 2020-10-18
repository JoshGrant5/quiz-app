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
    quizHelpers.createNewQuiz(req.body)
    .then(data => {
      return quizHelpers.sort(data.id ,req.body);
    })
    .then(sortedData => {
      res.redirect('/user')
      return quizHelpers.addQuizContent(sortedData);
    })
    .catch(err => err.message);
  })

  //?
  let quizInfo = {}
  // quizHelpers.getQuizWithUrl(req.params.url)
  // let quizInfo = {user_id: cookie};
  quizHelpers.getQuizWithUrl(req.params.url)
    .then(quiz => {
      quizInfo.quiz = quiz;
      return quizHelpers.getQuestions(quiz.id);
    })

  router.get("/:url", (req, res) => {
    const promises = [];
    const userid = req.session.user_id;
    promises.push(quizHelpers.getQuizWithUrl(req.params.url));
    if(userid) promises.push(userHelpers.getUserById(userid));
    let quizInfo = {};
    Promise.all(promises)
      .then(results => {
        quizInfo.quiz = results[0];
        quizInfo.user = results[1] || undefined;
        return quizHelpers.getQuestions(quizInfo.quiz.id);
      })
      .then(questions => {
        quizInfo.questions = questions;
        const answers = [];
        questions.forEach(question => answers.push(quizHelpers.getAnswers(question.id)));
        return Promise.all(answers);
      })
      .then((answers) => {
        for (let i = 0; i < answers.length; i++) {
          quizInfo.questions[i].answers = quizHelpers.shuffle(answers[i]);
          // quizInfo.questions = helpers.shuffle(quizInfo.questions); If we want questions shuffled within quiz
        }
        res.render('take_quiz', quizInfo);
        // res.json(quizInfo);
      });
  })


  router.post("/:url", (req, res) => {
    let score = 0;
    quizHelpers.getScore(req.body)
      .then(answers => {
        score = answers.score;
        return quizHelpers.getQuizWithUrl(req.params.url);
      })
      .then(quiz => {
        let user_id = '';
        if(req.session.user_id) user_id = req.session.user_id;
        return quizHelpers.createResult(quiz.id, user_id, score, Object.keys(req.body).length);
      })
      .then(result => res.redirect(`/quiz/${req.params.url}/result/${result.id}`));
  });

  router.get("/:url/result/:id", (req, res) => {
    const promises = [];
    const userid = req.session.user_id;
    const resultInfo = {};
    promises.push(quizHelpers.getResult(req.params.id));
    if(userid) promises.push(userHelpers.getUserById(userid));
    Promise.all(promises)
      .then(results => {
        resultInfo.result = results[0];
        resultInfo.user = results[1] || undefined;
        const promises = [];
        promises.push(quizHelpers.getNumScoresBeatenForQuiz(resultInfo.result.quiz_id, resultInfo.result.score));
        promises.push(quizHelpers.getNumResultsForQuiz(resultInfo.result.quiz_id));
        return Promise.all(promises);
      })
      .then(results => {
        resultInfo.result.numBeaten = Math.floor(results[0] / results[1] * 100);
        if (resultInfo.result.url !== req.params.url) res.redirect('/');
        else res.render('result', resultInfo);
      });
  });

  return router;
};
