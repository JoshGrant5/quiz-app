jQuery(function() {

  // show My Quizzes on page load
  const loadMyQuizzes = () => {
    $.ajax({
      method: "GET",
      url: "/api/partial/_quizzes"
    }).then((res) => {
      $("#container").append(res);
      checkScroll();
    })
  };
  loadMyQuizzes();

  const $myPageBtns = $(".my-page-nav button");
  let currentFilter = '_quizzes';

  $(".my-page-nav button").on('click', function(e) {
    count = 0;
    const $button = $(this);
    currentFilter = $button.attr("name");
    $.ajax({
      method: "GET",
      url: `/api/partial/${currentFilter}`,
    })
      .then(res => {
        $("#container").empty();
        $("#container").append(res)
        checkScroll()

        $myPageBtns.each(function() {
          if($(this).hasClass("btn-primary")) {
            $(this).removeClass("btn-primary").addClass("btn-outline-primary");
          }
        });

        $button.removeClass("btn-outline-primary").addClass("btn-primary");
      });
  });

  const checkScroll = function() {
    if($(window).scrollTop() + $(window).height() > $(document).height() - buffer) {
      count++;
      const currentOffset = offset * count;
      if (currentOffset > offset * pageLimit) return;
      $.ajax({
        method: "GET",
        url: `/api/partial/${currentFilter}`,
        data: { offset: currentOffset }
      }).then((res) => {
        const $res = $(res).wrap('<div/>').parent();
        if ($res.find('.quiz').length < 1) return;
        $res.find('.card').each(function() {
          $("#quiz-container").append($(this));
        });
      });
    }
  }

  let count = 0;
  const offset = 12;
  const pageLimit = 10;
  const buffer = 50;

  $(window).on('scroll',checkScroll);
  $(window).on('resize',checkScroll);
});
