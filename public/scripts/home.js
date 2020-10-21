$(() => {

  const $quizContainer = $('#quiz-container');
  const $sortAndFilterBtns = $(".quiz-view-options button");
  const $filterBtns = $(".quiz-filter button");
  const $sortBtns = $(".quiz-sort button");
  
  // click handler on quiz filtering and sorting
  $sortAndFilterBtns.on("click", function(e) {

    const selectionType = $(this).parent().attr("class");
    let filterName, filterType, sortName, sortOrder;
    
    // if filter selected, filter = target, sort = styled
    if (selectionType === "quiz-filter") {
      filterName = $(this).text();
      filterType = $(this).attr("name");
      sortName = $(".quiz-sort button.btn-primary").attr("name").split("-")[0];
      sortOrder = $(".quiz-sort button.btn-primary").attr("name").split("-")[1];
    
    // if sort selected, sort = target, filter = styled
    } else {
      filterName = $(".quiz-filter button.btn-primary").text();
      filterType = $(".quiz-filter button.btn-primary").attr("name");
      sortName = $(this).attr("name").split("-")[0];
      sortOrder = $(this).attr("name").split("-")[1];
    }

    // send sort and filter options, returns an array of quizzes
    $.ajax({
      method: "GET",
      url: "/api/filterAndSort",
      data: { filterType, filterName, sortName, sortOrder }
    }).then((res) => {
      // empty quiz container and show filtered quizzes in sort order
      $quizContainer.empty();
      renderQuizzes(res);

      // toggle button styles so only active filter/sort is solid
      toggleBtns(selectionType);
      $(e.target).removeClass("btn-outline-primary").addClass("btn-primary");
    }).catch((err) => err.message);
  });

  // toggle style of filter and sort button given selected button
  const toggleBtns = (selection) => {
    let buttons;
    (selection === 'quiz-filter') ? buttons = $filterBtns : buttons = $sortBtns;
    
    buttons.each(function() {
      if($(this).hasClass("btn-primary")) {
        $(this).removeClass("btn-primary").addClass("btn-outline-primary");
      }
    });
  };

  // creates a quiz article element
  const createQuizElement = (quiz) => {
    if (!quiz.photo) {
      quiz.photo = '/imgs/temp-photo.jpg';
    }
    if (!quiz.description) {
      quiz.description = '';
    }

    let $quiz = $(`
    <article class="card quiz">
      <a href="/quiz/${quiz.url}">
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
});