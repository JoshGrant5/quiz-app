/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /user,
 *   these routes are mounted onto /user
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (helpers) => {
  router.get("/", (req, res) => {
    helpers.getAllUsers().then(info => res.json(info));
  });

  return router;
};
