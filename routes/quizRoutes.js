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
    quizHelpers.getAllQuizzes().then(info => res.json(info));
  });

  router.get('/create', (req, res) => {
    res.render('create_quiz');
  });

  router.post('/create', (req, res) => {
    quizHelpers.createNewQuiz(req.body)
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
  });

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
    promises.push(quizHelpers.getResult(req.params.id));
    if(userid) promises.push(userHelpers.getUserById(userid));
    Promise.all(promises)
      .then(results => {
        result = results[0];
        user = results[1] || undefined;
        res.render('result', { user, result })
      });
  });

  return router;
};
