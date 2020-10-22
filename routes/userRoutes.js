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
    promises.push(quizHelpers.getQuizzesForUser(userid, 0));
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

  return router;
};
