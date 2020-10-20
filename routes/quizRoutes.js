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
    promises.push(quizHelpers.getCategories());
    Promise.all(promises)
      // populate templateVars with data responses
      .then(res => {
        templateVars.user = res[0] || undefined;
        templateVars.categories = res[1];
        return templateVars;
      })
      .then(data => {
        res.render("create_quiz", data);
      });
  });

  router.post('/create', (req, res) => {
    quizHelpers.createNewQuiz(req.session.user_id, req.body)
    .then(data => {
      return quizHelpers.sort(data.id ,req.body);
    })
    .then(sortedData => {
      res.redirect('/user')
      return quizHelpers.addQuizContent(sortedData);
    })
    .catch(err => err.message);
  })

  // Displays the quiz with the given url, to be taken
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
        return quizHelpers.getQuestions(quizInfo.quiz.id, quizInfo.quiz.type);
      })
      .then(questions => {
        quizInfo.questions = questions;
        const answers = [];
        questions.forEach(question => answers.push(quizHelpers.getAnswers(question.id, quizInfo.quiz.type)));
        return Promise.all(answers);
      })
      .then((answers) => {
        for (let i = 0; i < answers.length; i++) {
          quizInfo.questions[i].answers = answers[i];
          // quizInfo.questions[i].answers = quizHelpers.shuffle(answers[i]);
        }
        res.render('take_quiz', quizInfo);
      });
  });


  // Posts the answers selected to the quiz with the given url, to be stored in the database as a result
  router.post("/:url", (req, res) => {
    const result = {};
    quizHelpers.getQuizWithUrl(req.params.url)
      .then(quiz => {
        if (quiz.type === 'trivia') {
          result.quiz = quiz;
          quizHelpers.getScore(req.body)
            .then(answers => {
              result.score = answers.score;
              let user_id = '';
              if(req.session.user_id) user_id = req.session.user_id;
              return quizHelpers.createTriviaResult(result.quiz.id, user_id, result.score, Object.keys(req.body).length);
            })
            .then(result => res.redirect(`/quiz/${req.params.url}/result/${result.id}`));
        }
        else {
          result.quiz = quiz;
          quizHelpers.getOutcome(req.body)
            .then(outcome_id => {
              let user_id = '';
              if(req.session.user_id) user_id = req.session.user_id;
              return quizHelpers.createPersonalityResult(result.quiz.id, user_id, outcome_id);
            })
            .then(result => res.redirect(`/quiz/${req.params.url}/result/${result.id}`));
        }
      });
  });

  // Displays the result with the given id
  router.get("/:url/result/:id", (req, res) => {
    const promises = [];
    const userid = req.session.user_id;
    const resultInfo = {};
    promises.push(quizHelpers.getQuizWithUrl(req.params.url));
    if (userid) promises.push(userHelpers.getUserById(userid));
    Promise.all(promises)
      .then(results => {
        resultInfo.quiz = results[0];
        resultInfo.user = results[1] || undefined;
        return quizHelpers.getResult(req.params.id, resultInfo.quiz.type);
      })
      .then(result => {
        resultInfo.result = result;
        if (resultInfo.result.url !== req.params.url) res.redirect('/'); //Redirect to home page if id does not belong to given url
        const promises = [];
        if (resultInfo.quiz.type === 'trivia') {
          if (resultInfo.result.total === 0 && resultInfo.result.score === 0) resultInfo.result.percent = 0;
          else if (resultInfo.result.total === 0 && resultInfo.result.score !== 0) resultInfo.result.percent = 100;
          else resultInfo.result.percent = Math.floor(resultInfo.result.score/resultInfo.result.total * 100);
          promises.push(quizHelpers.getNumScoresBeatenForQuiz(resultInfo.result.quiz_id, resultInfo.result.score));
          promises.push(quizHelpers.getNumResultsForQuiz(resultInfo.result.quiz_id));
        }
        else {
          promises.push(quizHelpers.getOutcomeWithId(resultInfo.result.outcome_id));
        }
        return Promise.all(promises);
      })
      .then(results => {
        if (resultInfo.quiz.type === 'trivia') resultInfo.result.numBeaten = Math.floor(results[0] / results[1] * 100);
        else resultInfo.outcome = results[0];
        const promises = [];
        if (!userid) return Promise.all(promises);
        promises.push(quizHelpers.getRating(resultInfo.user.id, resultInfo.quiz.id));
        promises.push(quizHelpers.getFavourite(resultInfo.user.id, resultInfo.quiz.id));
        return Promise.all(promises);
      })
      .then(results => {
        resultInfo.rating = results[0];
        resultInfo.favourite = results[1];
        res.render('result', resultInfo);
      });
  });

  // Posts the rating to the database with the current user and the quiz url given
  router.post("/:url/result/:id/rating", (req, res) => {
    const userid = req.session.user_id;
    if (!userid) return;
    const promises = [];
    const rating = {};
    promises.push(userHelpers.getUserById(userid));
    promises.push(quizHelpers.getQuizWithUrl(req.params.url))
    Promise.all(promises)
      .then(results => {
        rating.user = results[0];
        rating.quiz = results[1];
        return quizHelpers.getRating(rating.user.id, rating.quiz.id);
      })
      .then(stars => {
        if (stars) return quizHelpers.updateRating(rating.user.id, rating.quiz.id, req.body.stars);
        else return quizHelpers.addRating(rating.user.id, rating.quiz.id, req.body.stars)
      });
  });

  // Adds a favorite to the database with the current user and the quiz url given
  router.post("/:url/result/:id/favourite", (req, res) => {
    const userid = req.session.user_id;
    if (!userid) return;
    const promises = [];
    promises.push(userHelpers.getUserById(userid));
    promises.push(quizHelpers.getQuizWithUrl(req.params.url))
    Promise.all(promises)
      .then(results => {
        return quizHelpers.addFavourite(results[0].id, results[1].id);
      });
  });

  // Deletes a favorite from the database belonging to the current user and the quiz url given
  router.post("/:url/result/:id/favourite/delete", (req, res) => {
    const userid = req.session.user_id;
    if (!userid) return;
    const promises = [];
    promises.push(userHelpers.getUserById(userid));
    promises.push(quizHelpers.getQuizWithUrl(req.params.url))
    Promise.all(promises)
      .then(results => {
        return quizHelpers.deleteFavourite(results[0].id, results[1].id);
      });
  });

  return router;
};
