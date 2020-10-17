/*
 * All routes for Home Page Navigation are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');


module.exports = ({ userHelpers, quizHelpers }) => {
  router.get("/", (req, res) => {
    const templateVars = {};

    // data needed for home page
    publicQuizzes = quizHelpers.getPublicQuizzes();
    user = userHelpers.getUserById(req.session.user_id);

    Promise.all([publicQuizzes, user])
      // populate templateVars with data responses
      .then(res => {
        templateVars.quizzes = res[0];
        templateVars.user = res[1];
        return templateVars;
      })
      .then(data => {
        res.render("index", data);
      });
  });

  router.get("/login", (req, res) => {
    res.send("<h1>Login</h1>");
  });

  router.post("/login", (req, res) => {
    // hardcoding users' login information
    const email = "a@a.ca";
    const password = "1";

    userHelpers.getUserByEmail(email)
      .then(data => {
        const user = data;  // anonymous { id: 1, name: 'Alice', email: 'a@a.ca', password: '1' }
        if (password === user.password) {
          // Set a cookie
          req.session.user_id = user.id;
          res.redirect("/");
        } else {
          res.status(401).send('Incorrect password');
        }
      });
  });

  router.post("/logout", (req, res) => {
    // clear cookie
    req.session = null;
    res.redirect("/");
  })

  router.get("/signup", (req, res) => {
    res.send("<h1>Signup</h1>")
  });

  return router;
};
