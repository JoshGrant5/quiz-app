$(() => {

  let filterName = "All";
  let filterType = undefined;
  let sortName = "created";
  let sortOrder = "desc";

  const loadQuizzes = () => {
    $.ajax({
      method: "GET",
      url: "/api/partial/view_quizzes",
      data: {
        filterName: 'All',
        filterType: undefined,
        sortName: 'created',
        sortOrder: 'desc',
        offset: 0,
      }
    }).then(res => {
      $("#container").append(res);
      checkScroll();
    }).catch(err => err.message);
  };
  // run on page load
  loadQuizzes();

  const $sortAndFilterBtns = $(".quiz-view-options button");
  const $filterBtns = $(".quiz-filter button");
  const $sortBtns = $(".quiz-sort button");
  // click handler on quiz filtering and sorting
  $sortAndFilterBtns.on("click", function(e) {
    count = 0;

    const selectionType = $(this).parent().attr("class");

    // get sort and filter options based on what the user selected
    if (selectionType === "quiz-filter") {
      filterName = $(this).text();
      filterType = $(this).attr("name");
      sortName = $(".quiz-sort button.btn-primary").attr("name").split("-")[0];
      sortOrder = $(".quiz-sort button.btn-primary").attr("name").split("-")[1];
    } else {
      filterName = $(".quiz-filter button.btn-primary").text();
      filterType = $(".quiz-filter button.btn-primary").attr("name");
      sortName = $(this).attr("name").split("-")[0];
      sortOrder = $(this).attr("name").split("-")[1];
    }

    // send sort and filter options, returns an array of quizzes
    $.ajax({
      method: "GET",
      url: "/api/partial/view_quizzes",
      data: { filterType, filterName, sortName, sortOrder }
    }).then((res) => {
      // toggle button styles so only active filter/sort is solid
      toggleBtns(selectionType);
      $(e.target).removeClass("btn-outline-primary").addClass("btn-primary");

      // empty quiz container and show filtered quizzes in sort order
      $("#container").empty();
      $("#container").append(res);
      checkScroll();
    }).catch(err => err.message);
  });

  // toggle style of filter and sort buttons given selected button
  const toggleBtns = (selection) => {
    let buttons;
    (selection === 'quiz-filter') ? buttons = $filterBtns : buttons = $sortBtns;

    buttons.each(function() {
      if($(this).hasClass("btn-primary")) {
        $(this).removeClass("btn-primary").addClass("btn-outline-primary");
      }
    });
  };

  const checkScroll = function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - buffer) {
      count++;
      const currentOffset = offset * count;
      if (currentOffset > offset * pageLimit) return;
      $.ajax({
        method: "GET",
        url: "/api/partial/view_quizzes",
        data: { filterType, filterName, sortName, sortOrder, offset: currentOffset }
      }).then((res) => {
        const $res = $(res).wrap('<div/>').parent();
        if ($res.find('.quiz').length < 1) return;
        $res.find('.card').each(function() {
          $("#quiz-container").append($(this));
        });
      }).catch((err) => err.message);
    }
  }

  let count = 0;
  const offset = 12;
  const pageLimit = 10;
  const buffer = 50;

  $(window).on('scroll',checkScroll);
  $(window).on('resize',checkScroll);
});
