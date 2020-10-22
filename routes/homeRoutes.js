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

    // data needed for home page
    const promises = [];
    promises.push(quizHelpers.getCategories());
    promises.push(quizHelpers.getTypes());
    if(userid) promises.push(userHelpers.getUserById(userid));

    Promise.all(promises)
      // populate templateVars with data responses
      .then(res => {
        templateVars.categories = res[0];
        templateVars.types = res[1];
        templateVars.user = res[2] || undefined;
        return templateVars;
      })
      .then(data => {
        res.render("index", data);
      });
  });

  // not used
  router.get("/login", (req, res) => {
    const userid = req.session.user_id;
    // redirect to home if logged in
    if (userid) res.redirect("/");

    const templateVars = { user: undefined };
    res.render("login", templateVars);
  });

  router.post("/login", (req, res) => {
    // hardcoding users' login information
    const { email, password }  = req.body;
    userHelpers.getUserByEmail(email)
      .then(data => {
        const user = data;
        if (password === user.password) {
          // Set a cookie
          req.session.user_id = user.id;
          res.redirect("back");
        } else {
          res.status(401).send('Incorrect email or password');
        }
      });
  });

  // login as userid 1 AKA Alice
  router.post("/login/1", (req, res) => {
    const email = "a@a.ca";
    const password = "1";

    userHelpers.getUserByEmail(email)
      .then(data => {
        const user = data;  // anonymous { id: 1, name: 'Alice', email: 'a@a.ca', password: '1' }
        req.session.user_id = user.id;
        res.redirect("back");
      });
  });

  router.post("/logout", (req, res) => {
    // clear cookie
    req.session = null;
    res.redirect("back");
  })

  // render sign up page
  router.get("/signup", (req, res) => {
    const userid = req.session.user_id;
    // redirect to home if logged in
    if (userid) res.redirect("/");

    const templateVars = { user: undefined };
    res.render("signup", templateVars);
  });

  router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    userHelpers.addNewUser(name, email, password)
      .then(user => {
        req.session.user_id = user.id;
        res.redirect("/");
      })
  })

  return router;
};
