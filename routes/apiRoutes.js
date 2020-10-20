const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {
  
  // api route that returns an array of quiz objects
  router.get("/category", (req, res) => {
    const category = req.query;
    quizHelpers.getPublicQuizzes(category)
      .then(data => res.send(data))
      .catch(err => err.message);
  });

  // returns an array of quiz objects given filter options
  router.get("/filter", (req, res) => {
    const filterOptions = req.query;
    quizHelpers.getPublicQuizzes(filterOptions)
      .then(data => {
        res.send(data);
      });

  })

  return router;
};
