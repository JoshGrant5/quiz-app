$(() => {

  const $quizContainer = $('#quiz-container');

  // creates a quiz article element
  const createQuizElement = (quiz) => {
    let $quiz = $(`
    <article class="card quiz">
      <a href="/quiz/${quiz.url$}">
        <img class="card-img-top" src="${quiz.photo}">
        <div class="card-body">
          <h3 class="card-title">${quiz.title}</h3>
          <p class="card-subtitle">${quiz.type} | ${quiz.category}</p>
          <p class="card-text">${quiz.description}</p>
        </div>
      </a>
    </article>
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

  const $filterBtns = $(".filters button");

  // click handler on quiz category filter
  $filterBtns.on("click", (e) => {
    // gets category button text
    const categoryFilter = $(e.target).text();
    
    // gets an array of quizzes based on filter and adds them to quiz container
    $.ajax({
      method: "GET",
      url: "/api/category",
      data: { categoryFilter }
    }).then((res) => {
      // empty quiz container and show filtered ones
      $quizContainer.empty();
      renderQuizzes(res);

      // change selected filter to solid and unselected filter to outline
      $filterBtns.each(function() {
        if($(this).hasClass("btn-primary")) $(this).removeClass("btn-primary").addClass("btn-outline-primary");
      });
      $(e.target).removeClass("btn-outline-primary").addClass("btn-primary");
    }).catch((err) => err.message);
  });
});