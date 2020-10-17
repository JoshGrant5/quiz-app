/*
 * All routes for Home Page Navigation are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = ({ usersHelpers, quizHelpers }) => {
  router.get("/", (req, res) => {

    const templateVars = {};

    // Data needed to render home page
    publicQuizzes = quizHelpers.getPublicQuizzes();

    Promise.all([publicQuizzes])
      // Populate templateVars with responses
      .then(res => {
        templateVars.quizzes = res[0];
        return templateVars;
      })
      .then(data => {
        res.render("index", data);
      });
  });

  router.get("/login", (req, res) => {
    res.send("<h1>Login</h1>");
  });

  router.get("/signup", (req, res) => {
    res.send("<h1>Signup</h1>")
  });

  return router;
};
