const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {

  router.get("/quizzes", (req, res) => {
    const options = req.query;
    if (!options.offset) options.offset = 0
    quizHelpers.getPublicQuizzes(options)
      .then(data => res.send(data))
      .catch(err => err.message);
  });

  // Returns the favourites partial with all info needed
  router.get('/partial/_favourites', (req, res) => {
    const options = req.query;
    if (!options.offset) options.offset = 0;
    const templateVars = { };
    const userid = req.session.user_id;

    if(!userid) {
      res.redirect("/"); // If not logged in redirect back to home page
    }

    const promises = [];
    promises.push(quizHelpers.getFavourites(userid, options.offset));
    promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      .then(results => {
        templateVars.quizzes = results[0];
        templateVars.user = results[1] || undefined;
        res.render("partials/_cards", templateVars);
      });
  })

  // Returns the quizzes partial with all info needed
  router.get('/partial/_quizzes', (req, res) => {
    const options = req.query;
    if (!options.offset) options.offset = 0;
    const templateVars = { };
    const userid = req.session.user_id;

    if(!userid) {
      res.redirect("/"); // send user back to home page
    }

    // quiz and user data needed to render page
    const promises = [];
    promises.push(quizHelpers.getQuizzesForUser(userid, options.offset));
    promises.push(userHelpers.getUserById(userid));

    // get data and render page
    Promise.all(promises)
      .then(res => {
        templateVars.quizzes = res[0];
        templateVars.user = res[1] || undefined;
        return templateVars;
      })
      .then(data => {
        res.render("partials/_cards", data);
      })
      .catch(err => err.message);
  })

  // Returns the results partial with all info needed
  router.get('/partial/_results', (req, res) => {
    const options = req.query;
    if (!options.offset) options.offset = 0;
    const templateVars = { };
    const userid = req.session.user_id;

    if(!userid) {
      res.redirect("/"); // If not logged in redirect back to home page
    }

    const promises = [];
    promises.push(quizHelpers.getResultsForUser(userid));
    promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      .then(results => {
        const trivia = results[0][0].rows;
        for (const result of trivia) {
          if (result.total === 0 && result.score === 0) result.percent = 0;
          else if (result.total === 0 && result.score !== 0) result.percent = 100;
          else result.percent = Math.floor(result.score/result.total * 100);
        }
        const personality = results[0][1].rows;
        const outcomes = [];
        personality.forEach(result => outcomes.push(quizHelpers.getOutcomeWithId(result.outcome_id)));
        Promise.all(outcomes)
          .then(outcomes => {
            for (let i = 0; i < outcomes.length; i++) {
              personality[i].outcome = outcomes[i];
            }
            templateVars.results = trivia.concat(personality);
            templateVars.results = templateVars.results.sort((a, b) => {
              if (a.date_completed < b.date_completed) return 1;
              if (a.date_completed > b.date_completed) return -1;
              if (a.id < b.id) return 1;
              if (a.id > b.id) return -1;
              return 0;
            });
            templateVars.user = results[1] || undefined;
            templateVars.results = templateVars.results.slice(options.offset, options.offset + 12);
            res.render("partials/_cards", templateVars);
          });
      });
  })

  return router;
};
