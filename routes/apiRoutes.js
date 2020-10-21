const express = require('express');
const router  = express.Router();

module.exports = ({ userHelpers, quizHelpers }) => {
  
  // returns an array of quiz objects given filter options
  router.get("/quizzes", (req, res) => {
    const options = req.query;
    quizHelpers.getPublicQuizzes(options)
      .then(data => res.send(data))
      .catch(err => err.message);
  });

  return router;
};
