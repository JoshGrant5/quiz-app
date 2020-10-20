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

  const $sortAndFilterBtns = $(".quiz-view-options button");
  
  // click handler on quiz category filter
  $sortAndFilterBtns.on("click", function(e) {
    const $filterBtns = $(".quiz-filter button");
    // const $sortBtns = $(".quiz-sort button");
    // console.log('filters>>', $filterBtns);
    // console.log('sorts>>', $sortBtns);

    const selectionType = $(this).parent().attr("class");
    let filterName, filterType, sortBy;
    // if filter selected, filter = target, sort = styled
    if (selectionType === "quiz-filter") {
      filterName = $(this).text();
      filterType = $(this).attr("name");
      sortBy = $(".quiz-sort button.btn-primary").attr("name");
    
    // if sort selected, sort = target, filter = styled
    } else {
      filterName = $(".quiz-filter button.btn-primary").text();
      filterType = $(".quiz-filter button.btn-primary").attr("name");
      sortBy = $(this).attr("name");
    }

    // console.log('filterName>>', filterName);
    // console.log('filterType>>', filterType);
    // console.log('sortby>>', sortBy);

    // gets category button text
    // const filterType = $(this).attr("name");
    // const filterName = $(this).text();
    
    // renders new quiz view based on filter and sort options
    $.ajax({
      method: "GET",
      url: "/api/filterAndSort",
      data: { filterType, filterName, sortBy }
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