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
    const { email, password }  = req.body;
    if (!email || !password) res.status(401).send('Please fill all fields');
    userHelpers.getUserByEmail(email)
      .then(user => {
        if (!user) return res.status(401).send('Incorrect email');
        if (bcrypt.compareSync(password, user.password)) {
          // Set a cookie
          req.session.user_id = user.id;
          return res.redirect("/");
        } else {
          return res.status(401).send('Incorrect password');
        }
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
    if (!name || !email || !password) res.status(401).send('Please fill all fields');
    userHelpers.getUserByEmail(email)
      .then(user => {
        if (user) res.status(401).send('Email already exists');
        else return userHelpers.addNewUser(name, email, bcrypt.hashSync(password, 10))
      })
      .then(user => {
        if (!user) return;
        req.session.user_id = user.id;
        return res.redirect("/");
      })
  })

  return router;
};
