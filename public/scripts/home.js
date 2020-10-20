$(() => {

  // element definitions
  const $quizContainer = $('#quiz-container');

  // creates a quiz article element
  const createQuizElement = (quiz) => {
    let $quiz = $(`
      <a href="/quiz/${quiz.url}">
        <article class="quiz">
          ${quiz.title}
          <img src="${quiz.photo}"><br>
        </article>
      </a>
    `);

    return $quiz;
  };

  // renders all quizzes into the quiz container
  const renderQuizzes = (quizzes) => {
    quizzes.forEach((quiz) => {
      const $quiz = createQuizElement(quiz);
      $quizContainer.append($quiz);
    })
  };

  // click handler on quiz category filter
  $(".filters button").on("click", (e) => {
    // gets category button text
    const categoryFilter = $(e.target).text();
    
    // gets an array of quizzes based on filter and adds them to quiz container
    $.ajax({
      method: "GET",
      url: "/api/category",
      data: { categoryFilter }
    }).then((res) => {
      $quizContainer.empty();
      renderQuizzes(res);
    }).catch((err) => err.message);
    
  });
});