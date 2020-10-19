/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /user,
 *   these routes are mounted onto /user
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {
  router.get("/", (req, res) => {
    const templateVars = { };
    const userid = req.session.user_id;

    if(!userid) {
      res.redirect("/"); // send user back to home page
    }

    // quiz and user data needed to render page
    const promises = [];
    promises.push(quizHelpers.getQuizzesForUser(userid));
    promises.push(userHelpers.getUserById(userid));

    // get data and render page
    Promise.all(promises)
      .then(res => {
        templateVars.quizzes = res[0];
        templateVars.user = res[1] || undefined;
        return templateVars;
      })
      .then(data => {
        res.render("user", data);
      });
  });

  router.get('/results', (req, res) => {
    const templateVars = { };
    const userid = req.session.user_id;

    if(!userid) {
      res.redirect("/"); // send user back to home page
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
            templateVars.user = results[1] || undefined;
            res.render("results", templateVars);
          });
      });
  });

  return router;
};
