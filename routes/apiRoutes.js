const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {

  // returns an array of quiz objects given filter options
  router.get("/filter", (req, res) => {
    const filterOptions = req.query;
    quizHelpers.getPublicQuizzes(filterOptions)
      .then(data => {
        res.send(data);
      });
  })

  router.get("/filterAndSort", (req, res) => {
    const options = req.query;
    // {"filterType":"category","filterName":"TV/Movies","sortBy":"created-desc"}
    quizHelpers.getPublicQuizzes(options)
      .then(data => res.send(data))
      .catch(err => err.message);
  });

  return router;
};
