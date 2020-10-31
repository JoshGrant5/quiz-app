const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {

  // Returns partial of all quiz cards for view quizzes page
  router.get("/partial/view_quizzes", (req, res) => {
    const options = req.query;
    if(!options.offset) options.offset = 0;
    const templateVars = {};

    quizHelpers.getPublicQuizzes(options)
      .then(data => {
        templateVars.quizzes = data;
        res.render("partials/_cards", templateVars)
      })
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
    promises.push(quizHelpers.getResultsForUser(userid, options.offset));
    promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      .then(results => {
        templateVars.results = results[0];
        const outcomes = [];
        templateVars.results.forEach(result => {
          if (result.type === 'personality') {
            result.outcome_id = result.score;
            outcomes.push(quizHelpers.getOutcomeWithId(result.outcome_id))
          }
        });
        Promise.all(outcomes)
          .then(outcomes => {
            let counter = 0;
            templateVars.results.forEach(result => {
              if (result.type === 'personality') {
                result.outcome = outcomes[counter];
                counter++;
              }
            })
            templateVars.user = results[1] || undefined;
            res.render("partials/_cards", templateVars);
          });
      });
  })

  return router;
};
