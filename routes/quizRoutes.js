/*
 * All routes for Quizzes are defined here
 * Since this file is loaded in server.js into /quiz,
 *   these routes are mounted onto /quiz
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {

  router.get('/create', (req, res) => {
    const userid = req.session.user_id;
    // redirect to home if logged out
    if (!userid) res.redirect("/");

    const templateVars = {};

    userHelpers.getUserById(userid)
      .then(data => {
        templateVars.user = data;
        res.render('options', templateVars);
      })
  });

  router.get('/create/trivia', (req, res) => {
    const templateVars = { };
    const userid = req.session.user_id;
    // redirect to home if logged out
    if (!userid) res.redirect("/");

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

  router.get('/create/personality', (req, res) => {
    const templateVars = { };
    const userid = req.session.user_id;
    // redirect to home if logged out
    if (!userid) res.redirect("/");

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

  router.post('/create/trivia', (req, res) => {
    quizHelpers.createNewQuiz(req.session.user_id, req.body)
    .then(data => {
      return quizHelpers.triviaSort(data.id, req.body);
    })
    .then(sortedData => {
      res.redirect('/user')
      return quizHelpers.addTriviaQuizContent(sortedData);
    })
    .catch(err => err.message);
  })

  router.post('/create/personality', (req,res) => {
    console.log(req.body)
    quizHelpers.createNewQuiz(req.session.user_id, req.body)
    .then(data => {
      return quizHelpers.personalitySort(data.id ,req.body);
    })
    .then(sortedData => {
      res.redirect('/user')
      return quizHelpers.addPersonalityQuizContent(sortedData);
    })
    .catch(err => err.message);
  });

  // Displays the quiz with the given url, to be taken
  router.get("/:url", (req, res) => {
    const promises = [];
    const userid = req.session.user_id;
    promises.push(quizHelpers.getQuizWithUrl(req.params.url));
    if(userid) promises.push(userHelpers.getUserById(userid));
    let quizInfo = {};
    Promise.all(promises)
      .then(results => {
        if (!results[0]) res.redirect('/'); //Redirect to home page if url does not exist
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
          quizInfo.questions[i].answers = quizHelpers.shuffle(answers[i]);
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
              let score;
              console.log(result.score)
              console.log(Object.keys(req.body).length)
              if (result.score > Object.keys(req.body).length) score = 100;
              else if (Object.keys(req.body).length === 0) score = 0;
              else score = Math.floor(result.score/Object.keys(req.body).length * 100);
              console.log(score)
              return quizHelpers.createTriviaResult(result.quiz.id, user_id, score);
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
        if (!results[0]) res.redirect('/'); //Redirect to home page if url does not exist
        resultInfo.quiz = results[0];
        resultInfo.user = results[1] || undefined;
        return quizHelpers.getResult(req.params.id, resultInfo.quiz.type);
      })
      .then(result => {
        resultInfo.result = result;
        if (!result || resultInfo.result.url !== req.params.url) res.redirect('/'); //Redirect to home page if id does not belong to given url or id doesn't exist
        const promises = [];
        if (resultInfo.quiz.type === 'trivia') {
          promises.push(quizHelpers.getNumScoresBeatenForQuiz(resultInfo.result.quiz_id, resultInfo.result.score));
          promises.push(quizHelpers.getNumResultsForQuiz(resultInfo.result.quiz_id));
        }
        else {
          promises.push(quizHelpers.getOutcomeWithId(resultInfo.result.outcome_id));
        }
        return Promise.all(promises);
      })
      .then(results => {
        if (resultInfo.quiz.type === 'trivia') {
          if (results[1] === 1) resultInfo.result.numBeaten = 100;
          else resultInfo.result.numBeaten = Math.floor(results[0] / (results[1] - 1) * 100);
        }
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
  router.post("/:url/rating", (req, res) => {
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
  router.post("/:url/favourite", (req, res) => {
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
  router.post("/:url/favourite/delete", (req, res) => {
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
