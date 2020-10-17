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
      return quizHelpers.addQuizContent(sortedData);
    })
    .then(res => res.redirect('/create'))
    .catch(err => err.message);
  })

  router.get("/:url", (req, res) => {
    let quizInfo = {}
    quizHelpers.getQuizWithUrl(req.params.url)
    // let quizInfo = {user_id: cookie};
    helpers.getQuizWithUrl(req.params.url)
      .then(quiz => {
        quizInfo.quiz = quiz;
        return quizHelpers.getQuestions(quiz.id);
      })
      .then(questions => {
        quizInfo.questions = questions;
        return quizHelpers.getAnswersForQuiz(quizInfo.quiz.id);
        const answers = [];
        questions.forEach(question => answers.push(helpers.getAnswers(question.id)));
        return Promise.all(answers);
      })
      .then((answers) => {
        for (let i = 0; i < answers.length; i++) {
          quizInfo.questions[i].answers = helpers.shuffle(answers[i]);
          // quizInfo.questions = helpers.shuffle(quizInfo.questions); If we want questions shuffled within quiz
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
        let user_id = 1;
        // let user_id = NULL;
        // if(cookie) user_id = cookie;
        return helpers.createResult(quiz.id, user_id, score);
      })
      // .then(result => res.json(result));
      .then(result => res.redirect(`/quiz/${req.params.url}/result/${result.id}`));
  });

  router.get("/:url/result/:id", (req, res) => {
    helpers.getResult(req.params.id)
      .then(result => res.render('result', { result }));
  });

  return router;
};
