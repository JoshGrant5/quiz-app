/*
 * All routes for Home Page Navigation are defined here
 * Since this file is loaded in server.js into /,
 *   these routes are mounted onto /
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const user = require('./userRoutes');
const { promise } = require('bcrypt/promises');


module.exports = ({ userHelpers, quizHelpers }) => {
  router.get("/", (req, res) => {
    const templateVars = {};
    const userid = req.session.user_id;
    const quizOptions = { 
      filterName: 'All'
    }; // on first load

    // data needed for home page
    const promises = [];
    promises.push(quizHelpers.getPublicQuizzes(quizOptions));
    promises.push(quizHelpers.getCategories());
    promises.push(quizHelpers.getTypes());
    if(userid) promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      // populate templateVars with data responses
      .then(res => {
        templateVars.quizzes = res[0];
        templateVars.categories = res[1];
        templateVars.types = res[2];
        templateVars.user = res[3] || undefined;
        return templateVars;
      })
      .then(data => {
        res.render("index", data);
      });
  });

  // not used
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

  // not used
  router.get("/signup", (req, res) => {
    res.send("<h1>Signup</h1>")
  });

  return router;
};
